import requests
import csv
import time
import uuid
import json
from datetime import datetime

API_KEY = "AIzaSyDKxttwWCA_6EbhIFrymCgCP3IbDF5b2aY"

CITIES = [
    # 한국
    {"name": "Seoul",     "country": "Korea", "lat": 37.5665, "lng": 126.9780},
    {"name": "Busan",     "country": "Korea", "lat": 35.1796, "lng": 129.0756},
    {"name": "Incheon",   "country": "Korea", "lat": 37.4563, "lng": 126.7052},
    {"name": "Daegu",     "country": "Korea", "lat": 35.8714, "lng": 128.6014},
    {"name": "Daejeon",   "country": "Korea", "lat": 36.3504, "lng": 127.3845},
    {"name": "Gwangju",   "country": "Korea", "lat": 35.1595, "lng": 126.8526},
    {"name": "Jeju",      "country": "Korea", "lat": 33.4996, "lng": 126.5312},
    # 일본
    {"name": "Tokyo",     "country": "Japan", "lat": 35.6762, "lng": 139.6503},
    {"name": "Osaka",     "country": "Japan", "lat": 34.6937, "lng": 135.5023},
    {"name": "Kyoto",     "country": "Japan", "lat": 35.0116, "lng": 135.7681},
    {"name": "Nagoya",    "country": "Japan", "lat": 35.1815, "lng": 136.9066},
    {"name": "Sapporo",   "country": "Japan", "lat": 43.0618, "lng": 141.3545},
    {"name": "Fukuoka",   "country": "Japan", "lat": 33.5904, "lng": 130.4017},
    {"name": "Kobe",      "country": "Japan", "lat": 34.6901, "lng": 135.1956},
    {"name": "Yokohama",  "country": "Japan", "lat": 35.4437, "lng": 139.6380},
    {"name": "Hiroshima", "country": "Japan", "lat": 34.3853, "lng": 132.4553},
]

KEYWORDS = [
    # 한국어
    "게이바", "게이클럽", "퀴어바", "LGBT바", "성소수자 바",
    # 일본어
    "ゲイバー", "ゲイクラブ", "LGBTバー", "クィアバー",
    # 영어
    "gay bar", "gay club", "LGBT venue",
]

CATEGORY_MAP = {
    "bar": "bar", "club": "club", "cafe": "cafe", "sauna": "sauna",
    "나이트클럽": "club", "바": "bar", "카페": "cafe",
    "ナイトクラブ": "club", "バー": "bar",
}

def detect_category(name: str, types: list) -> str:
    name_lower = name.lower()
    if any(t in name_lower for t in ["sauna", "사우나", "サウナ"]):
        return "sauna"
    if any(t in name_lower for t in ["cafe", "카페", "カフェ", "coffee"]):
        return "cafe"
    if any(t in name_lower for t in ["club", "클럽", "クラブ"]):
        return "club"
    return "bar"

def text_search(keyword: str, city: dict) -> list:
    url = "https://places.googleapis.com/v1/places:searchText"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.types,places.rating,places.userRatingCount",
    }
    body = {
        "textQuery": f"{keyword} {city['name']}",
        "locationBias": {
            "circle": {
                "center": {"latitude": city["lat"], "longitude": city["lng"]},
                "radius": 30000.0,
            }
        },
        "maxResultCount": 20,
    }

    try:
        res = requests.post(url, headers=headers, json=body, timeout=10)
        data = res.json()
        return data.get("places", [])
    except Exception as e:
        print(f"  검색 오류: {e}")
        return []

def get_place_details(place_id: str) -> dict:
    url = f"https://places.googleapis.com/v1/places/{place_id}"
    headers = {
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "reviews",
    }
    try:
        res = requests.get(url, headers=headers, timeout=10)
        return res.json()
    except Exception as e:
        print(f"  상세 오류: {e}")
        return {}

def main():
    seen_ids = set()
    places_data = []

    print(f"=== 장소 수집 시작 ({datetime.now().strftime('%H:%M:%S')}) ===\n")

    for city in CITIES:
        print(f"[{city['country']}] {city['name']} 검색 중...")

        for keyword in KEYWORDS:
            results = text_search(keyword, city)

            for place in results:
                pid = place.get("id")
                if not pid or pid in seen_ids:
                    continue
                seen_ids.add(pid)

                name = place.get("displayName", {}).get("text", "")
                location = place.get("location", {})
                lat = location.get("latitude", "")
                lng = location.get("longitude", "")
                address = place.get("formattedAddress", "")
                types = place.get("types", [])
                category = detect_category(name, types)

                places_data.append({
                    "id": str(len(places_data) + 1),
                    "name": name,
                    "lat": lat,
                    "lng": lng,
                    "address": address,
                    "category": category,
                    "country": city["country"],
                    "city": city["name"],
                    "place_id": pid,
                    "source_keyword": keyword,
                    "reviews": "",
                })

            time.sleep(0.3)  # API 과부하 방지

        print(f"  → 누적 {len(places_data)}개 장소")

    # 리뷰 수집
    print(f"\n=== 리뷰 수집 시작 (총 {len(places_data)}개) ===\n")
    for i, place in enumerate(places_data):
        print(f"[{i+1}/{len(places_data)}] {place['name']} 리뷰 수집...")
        details = get_place_details(place["place_id"])
        reviews = details.get("reviews", [])
        if reviews:
            review_texts = [r.get("text", {}).get("text", "") for r in reviews[:3]]
            place["reviews"] = " | ".join(filter(None, review_texts))
        time.sleep(0.2)

    # CSV 저장
    output_file = "places_output.csv"
    fieldnames = ["id", "name", "lat", "lng", "address", "category", "country", "city", "source_keyword", "reviews"]

    with open(output_file, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for p in places_data:
            writer.writerow({k: p[k] for k in fieldnames})

    print(f"\n=== 완료! ===")
    print(f"총 {len(places_data)}개 장소 → {output_file} 저장됨")

if __name__ == "__main__":
    main()
