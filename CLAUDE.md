# moob map_g — 프로젝트 컨텍스트

## 서비스 정의
게이 친화 장소(게이바, 클럽, 카페, 사우나 등)를 Google Maps 위에 핀으로 표시하고,
각 장소마다 **익명 커뮤니티 게시판**을 제공하는 웹 서비스.

## 초기 거점 (5개 지역)
- 🇰🇷 서울 (종로/이태원)
- 🇰🇷 부산
- 🇯🇵 도쿄 (신주쿠 2초메)
- 🇹🇭 태국 방콕 실롬
- 🇹🇼 대만 타이페이 시먼딩

---

## 기술 스택
| 역할 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) + TypeScript |
| 지도 | Google Maps JavaScript API |
| 장소 데이터 | Google Sheets (초기 관리) |
| 게시판 DB | Supabase (PostgreSQL) |
| 스타일 | Tailwind CSS |
| 배포 | Vercel (예정) |

---

## 환경변수 (.env.local)
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=   # 지도 표시
GOOGLE_SHEETS_API_KEY=             # Sheets 읽기
GOOGLE_SHEET_ID=                   # 1jhu9fJEocCEbZ2vPX4SbrTXU4hmgRG2GjDDuHzAjMAk
NEXT_PUBLIC_SUPABASE_URL=          # https://wxucjbnuamaifshjskwg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # sb_publishable__...
```

---

## 프로젝트 구조
```
src/
├── app/
│   ├── api/
│   │   ├── places/route.ts     ← Google Sheets에서 장소 데이터 읽기
│   │   ├── posts/route.ts      ← 게시글 CRUD (GET/POST/DELETE)
│   │   └── comments/route.ts   ← 댓글 CRUD (GET/POST/DELETE)
│   └── page.tsx                ← MapView 렌더링
├── components/
│   ├── MapView.tsx             ← 지도 + GPS + 마커
│   └── BoardPanel.tsx          ← 게시판 패널 + 리뷰 아코디언 + SNS 링크
├── lib/
│   ├── sheets.ts               ← Google Sheets API 연동
│   └── supabase.ts             ← Supabase 클라이언트
└── types/index.ts              ← Place, Post, Comment 타입

scripts/
├── collect_places.py           ← Google Places API 수집
└── filter_places.py            ← 게이 관련 키워드 필터링
```

---

## Google Sheets 구조
- 시트명: `places_output`
- 컬럼: `id | name | lat | lng | address | category | country | city | reviews | instagram | twitter | facebook`
- A~H: 기본 장소 정보
- I: 수집된 Google 리뷰 (` | ` 구분)
- J~L: SNS 링크 (직접 입력)

## Supabase 테이블
```sql
posts(id, place_id, nickname, password_hash, content, created_at)
comments(id, post_id, nickname, password_hash, content, created_at)
```
- 비밀번호는 SHA-256 해시로 저장
- 익명 게시판: 닉네임 + 4자리 비밀번호로 본인 글 수정/삭제

---

## 구현된 기능
- [x] Google Maps 전체화면 지도
- [x] 장소 유형별 컬러 마커 (bar/club/cafe/sauna/other)
- [x] 마커 클릭 → 사이드 패널 (모바일: 하단 슬라이드업)
- [x] 익명 게시글/댓글 (닉네임 + 4자리 비번)
- [x] GPS 현위치 표시 (파란 점, 무료)
- [x] 리뷰 접힘 아코디언
- [x] SNS 링크 슬롯 (Sheets J/K/L열 입력 시 자동 표시)
- [x] 모바일 반응형

---

## 데이터 수집 현황
- 수집 완료: 499개 → 필터링 후 166개 (한국 7개 도시 + 일본 9개 도시)
- 미수집: 태국 실롬, 대만 타이페이 시먼딩
- 수집 비용: ~$58 사용 / ~$142 잔여 (무료 크레딧 $200 기준)

---

## TODO
- [ ] Vercel 배포
- [ ] 태국 실롬 + 대만 타이페이 데이터 수집
- [ ] SNS 링크 데이터 채우기 (Sheets J/K/L열)
- [ ] 아키텍처 문서화
- [ ] BM / 마케팅 방향 수립
- [ ] 장소 직접 제보 기능
- [ ] DeepL 번역 기능 검토 (무료 API)
- [ ] Sheets → Supabase 마이그레이션 (데이터 많아질 때)

---

## Notion HQ
- HQ 페이지: https://www.notion.so/33e4fbce10e9805c86a8d5edb391f9d2
- 기획서: https://www.notion.so/moob-map_g-33e4fbce10e981369870f97719570c14

## 로컬 실행
```bash
cd /Users/yeonghwachoi/moob/map_g
npm run dev
# → http://localhost:3000
```
