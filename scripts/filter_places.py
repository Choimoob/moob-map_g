import csv

INPUT_FILE = "places_output.csv"
OUTPUT_FILE = "places_filtered.csv"

# 이 키워드로 검색해서 나온 결과는 무조건 통과 (핵심 gay 키워드)
STRICT_GAY_KEYWORDS = [
    "게이바", "게이클럽", "퀴어바", "LGBT바", "성소수자 바",
    "ゲイバー", "ゲイクラブ", "LGBTバー", "クィアバー",
    "gay bar", "gay club", "LGBT venue",
]

# 이름/리뷰에 포함되면 통과
NAME_REVIEW_KEYWORDS = [
    "gay", "lgbt", "lgbtq", "queer", "lesbian", "drag",
    "게이", "퀴어", "성소수자", "레즈", "이반",
    "ゲイ", "クィア", "レズ", "LGBT",
    "おかま", "オカマ", "ニューハーフ", "男の娘", "ビアン",
    "pride", "rainbow",
]

def is_valid(row: dict) -> bool:
    name = row.get("name", "").lower()
    reviews = row.get("reviews", "").lower()
    text = name + " " + reviews

    # 이름 또는 리뷰에 키워드 포함 시 통과
    for kw in NAME_REVIEW_KEYWORDS:
        if kw.lower() in text:
            return True

    return False

def main():
    with open(INPUT_FILE, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    total = len(rows)
    passed = []
    rejected = []

    for row in rows:
        if is_valid(row):
            passed.append(row)
        else:
            rejected.append(f"{row.get('name')} (검색어: {row.get('source_keyword')})")

    # 필터링된 결과에서 구글시트용 컬럼만 추출 (source_keyword 제외)
    out_fieldnames = ["id", "name", "lat", "lng", "address", "category", "country", "city", "reviews"]
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=out_fieldnames)
        writer.writeheader()
        for row in passed:
            writer.writerow({k: row[k] for k in out_fieldnames})

    print(f"=== 필터링 완료 ===")
    print(f"전체: {total}개")
    print(f"통과: {len(passed)}개 → {OUTPUT_FILE}")
    print(f"제거: {len(rejected)}개")
    print(f"\n제거된 장소:")
    for name in rejected:
        print(f"  - {name}")

if __name__ == "__main__":
    main()
