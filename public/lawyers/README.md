# 변호사 사진 업로드 가이드

이 폴더에 변호사 사진을 넣으면 `/people/lawyers` 목록과 `/people/lawyers/[slug]` 상세 페이지에 자동으로 반영됩니다.

## 파일명 규칙

`<slug>.jpg` (또는 `.png`, `.webp`) — slug는 `lib/data/lawyers.ts` 에 정의된 값.

| slug | 사진 파일명 | 변호사 |
|---|---|---|
| `hong-myung-ho` | `hong-myung-ho.jpg` | 홍명호 대표변호사 |
| `bang-jeong-sook` | `bang-jeong-sook.jpg` | 방정숙 파트너변호사 |
| `lim-woong-chan` | `lim-woong-chan.jpg` | 임웅찬 파트너변호사 |
| `yoon-eun-hee` | `yoon-eun-hee.jpg` | 윤은희 변호사 (의사) |
| `jung-aerina` | `jung-aerina.jpg` | 정애리나 파트너변호사 |
| `lim-won-gyun` | `lim-won-gyun.jpg` | 임원균 변호사 |
| `seo-so-hyun` | `seo-so-hyun.jpg` | 서소현 파트너변호사 |
| `kim-geun-yo` | `kim-geun-yo.jpg` | 김근요 변호사 |
| `choi-gyu-sung` | `choi-gyu-sung.jpg` | 최규성 변호사 |
| `kim-yong-jun` | `kim-yong-jun.jpg` | 김용준 변호사 |
| `lee-hyo-jung` | `lee-hyo-jung.jpg` | 이효정 변호사 |
| `kang-min-ju` | `kang-min-ju.jpg` | 강민주 변호사 |
| `jung-chan-ik` | `jung-chan-ik.jpg` | 정찬익 변호사 |

## 권장 사양

- **비율**: 4:5 세로 (목록 카드 기본). 정사각형이나 4:3도 자동 크롭됨.
- **크기**: 최소 800×1000px, 최대 2000×2500px
- **포맷**: JPG (사진), PNG (배경 투명 필요시), WebP (최적화)
- **용량**: 한 장당 200KB–800KB 권장 (Next/Image가 자동 최적화)
- **스타일**: 회색조로 자동 변환되며 호버 시 컬러로 전환됨 (PRD §4.7.2 Lawyer card)

## 사진 추가 후 할 일

### 옵션 A — 자동 다운로드 (도원 사이트에서 미러)

`lib/data/lawyers.ts`의 11명 변호사는 이미 `photoUrl`이
`https://www.dowonlaw.com/upload/employee/...` 로 설정되어 있습니다 (정애리나·임원균은
도원 사이트 자체에 사진 없음). 운영(Vercel)은 image optimizer로 자동 캐싱하므로 별도
다운로드가 없어도 사진이 표시됩니다.

로컬 사본을 두고 싶다면:

```bash
npm run photos       # 11장을 public/lawyers/{slug}.png 로 저장
```

다운로드가 끝나면 `lib/data/lawyers.ts`의 각 `photoUrl`을 `/lawyers/{slug}.png` 로
바꾸거나, 아예 필드를 지우면 됩니다. (LawyerPhoto 컴포넌트가 자동으로 그 경로를 시도)

### 옵션 B — 수동 업로드

1. 새 사진을 이 폴더에 `{slug}.jpg` 또는 `{slug}.png` 로 저장
2. `lib/data/lawyers.ts`의 해당 객체에서 `photoUrl` 줄을 제거 (자동 매핑이 작동)
3. `npm run dev` 후 `/people/lawyers` 확인
4. `git add public/lawyers/{slug}.png && git commit && git push`

## 이력·바이오 업데이트

`lib/data/lawyers.ts`의 각 변호사 객체에서 다음 필드를 실제 자료로 교체하세요:

- `bioShort` — 카드/상세 페이지의 한 줄 소개
- `education` — 학력 배열 (예: `["서울대 법학 학사 (2010)", "사법연수원 41기"]`)
- `career` — 경력 배열
- `cases` — 대표 사건 배열 (`{ issue, result, insight }`)
- `email` — 변호사 직통 이메일

업데이트 후 Supabase 동기화:

```bash
npm run seed       # lawyers 테이블에 upsert (slug 기준)
```

> **주의** — 사건 정보는 변호사법 §23(광고) 및 §28(비밀유지)를 준수해 비식별 처리하세요.
> 의뢰인 식별 가능 정보(이름·회사·금액 등)는 노출 금지.
