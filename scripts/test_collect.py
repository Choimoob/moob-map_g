import requests
import json

API_KEY = "AIzaSyDKxttwWCA_6EbhIFrymCgCP3IbDF5b2aY"

url = "https://places.googleapis.com/v1/places:searchText"
headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location",
}
body = {
    "textQuery": "게이바 Seoul",
    "locationBias": {
        "circle": {
            "center": {"latitude": 37.5665, "longitude": 126.9780},
            "radius": 30000.0,
        }
    },
    "maxResultCount": 5,
}

res = requests.post(url, headers=headers, json=body)
data = res.json()
print(json.dumps(data, ensure_ascii=False, indent=2))
