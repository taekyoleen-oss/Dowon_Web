# 도메인 발급 후 작업 체크리스트

> 작성: 2026-05-14 · Vercel에서 도메인(예: `dowonlaw.com`) 연결이 완료된 시점에 이 문서대로 진행
>
> 전제: 도메인이 Vercel에 연결되어 있고(자체 구매 또는 외부 도메인 nameserver 변경 완료), `npm run dev`가 정상 동작하는 상태.
>
> 각 작업은 5~30분, 모두 무료. 위에서 아래 순서대로 진행하면 됩니다.

---

## 1. Resend 도메인 인증 (최우선 — 실제 메일 발송)

### 왜 필요한가
현재 상담 신청 알림은 다음 한계가 있습니다:
- `NOTIFY_FROM = onboarding@resend.dev` (Resend 테스트 도메인)
- `NOTIFY_EMAIL = taekyoleen@gmail.com` (Resend 가입 시 인증한 본인 이메일로만 발송 가능)

→ 도메인 인증을 마쳐야 의뢰인 이메일로도 발송할 수 있고, 발신자 도메인이 회사 도메인이 됨 (스팸 점수↓).

### 절차
1. https://resend.com → **Domains** → **Add Domain**
2. 도메인 입력: **`send.dowonlaw.com`** (서브도메인 권장 — 메인 도메인의 다른 메일 설정과 충돌 방지)
3. Region: **Tokyo (ap-northeast-1)** (한국에서 가장 가까움)
4. Resend가 표시하는 DNS 레코드 4종 (MX / TXT-SPF / TXT-DKIM / TXT-DMARC) 복사
5. **Vercel Dashboard → Domains → DNS Records** 에 그대로 추가
   - Name 입력 시 Vercel은 서브도메인 부분만 받음 (예: `send` 한 줄, `resend._domainkey.send` 한 줄)
6. Resend 페이지에서 **Verify DNS Records** 클릭 → 보통 5~30분 안에 ✅
7. 환경변수 업데이트 (`.env.local` + Vercel Environment Variables 둘 다):
   ```env
   NOTIFY_FROM="법무법인 도원 <noreply@send.dowonlaw.com>"
   NOTIFY_EMAIL=dowonlaw@dowonlaw.com   # 또는 실제 수신을 원하는 주소
   ```
8. dev/prod 재배포

### 검증
- `/contact/personal` 또는 `/tools/intake` 거쳐서 더미 폼 제출
- `NOTIFY_EMAIL`로 알림 도착 (스팸함도 확인)
- 알림 메일 → "답장" 누르면 to에 의뢰인 이메일이 자동으로 들어감 (reply-to 헤더 적용 확인)
- Resend → Emails 대시보드에 "Delivered" 로그

---

## 2. NEXT_PUBLIC_SITE_URL 운영 도메인으로 교체

### 왜 필요한가
- 현재 `http://localhost:3000` 으로 되어 있어 OG 이미지·메타데이터·sitemap의 절대 URL이 localhost로 박힘
- JSON-LD `LegalService`의 `@id` 도 이 값으로 절대화됨

### 절차
1. **Vercel Project → Settings → Environment Variables**:
   ```
   NEXT_PUBLIC_SITE_URL=https://www.dowonlaw.com
   ```
2. **Redeploy** (env 변경은 새 빌드에서만 반영됨 — Settings → Deployments → ⋯ → Redeploy)

### 검증
- 페이지 소스 보기 → `<link rel="canonical" href="https://www.dowonlaw.com/" />`
- `/sitemap.xml` 열기 → 모든 URL이 운영 도메인 prefix
- 공유 카드 미리보기 (https://www.opengraph.xyz/url/... 에 운영 URL 입력) → OG 이미지가 운영 URL로 표시

---

## 3. Naver Maps Client ID 등록 (인라인 네이버 지도 활성화)

### 왜 필요한가
현재 `/about/contact` 의 인라인 지도는 Google Maps fallback. 진짜 네이버 지도로 띄우려면 Naver Cloud Platform의 무료 Client ID 필요.

### 절차
1. https://www.ncloud.com → 회원가입 (네이버 아이디 SSO 가능, 무료)
2. Console → **AI·Application Service → Maps → Application 등록**
3. **Service** 항목에서 **Web Dynamic Map** 체크
4. **Web 서비스 URL** 입력 (한 줄에 하나씩):
   ```
   http://localhost:3000
   https://www.dowonlaw.com
   https://dowonlaw.com           # www 없는 형식도 사용한다면
   ```
5. 등록 후 Application 상세 → **Client ID** 복사 (예: `abc1d2e3f4`)
6. `.env.local` + Vercel Environment Variables:
   ```env
   NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=abc1d2e3f4
   ```
7. Redeploy

### 검증
- `/about/contact` 새로고침 → 인라인 지도가 Google → Naver로 전환 (한국어 라벨, 줌 컨트롤)
- 위치가 빗나가면 `lib/data/office.ts`의 `OFFICE.lat`/`OFFICE.lng` 두 줄만 갱신
  - 정확한 좌표 얻는 법: map.kakao.com 에서 건물 우클릭 → "좌표복사"

---

## 4. Search Console / Naver Search Advisor 등록 (SEO 노출)

### 왜 필요한가
검색엔진이 사이트맵을 자동 발견하기 전에 수동 제출 → 인덱싱 속도 향상.

### 절차

**Google Search Console**
1. https://search.google.com/search-console
2. **Add property** → 도메인 입력 (예: `dowonlaw.com`)
3. 소유 확인 (DNS TXT 레코드 또는 HTML 파일 업로드 중 택1) — Vercel DNS는 TXT 추가가 더 빠름
4. 사이트맵 제출: **Sitemaps** → `sitemap.xml` 입력 → Submit

**Naver Search Advisor (네이버 검색 등록)**
1. https://searchadvisor.naver.com
2. 사이트 등록 → 도메인 입력
3. 소유 확인 (HTML 메타태그 또는 파일 업로드)
4. **요청 → 사이트맵 제출**: `https://www.dowonlaw.com/sitemap.xml`

### 검증
- Search Console: "URL 검사" 도구에 홈 URL 입력 → "URL이 Google에 등록되어 있음" 표시까지 보통 1~3일
- Naver: 등록 후 24~48시간 내 색인 시작

---

## 5. Slack 알림 활성화 (선택 — 팀 협업 도구)

### 절차
1. Slack workspace → **Apps** → **Incoming Webhooks** 추가
2. 알림 받을 채널 선택 (예: `#dowon-consultations`)
3. Webhook URL 복사
4. `.env.local` + Vercel:
   ```env
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../...
   ```
5. Redeploy

### 검증
- `/admin` → "테스트 알림 발송" 버튼 → Slack 채널에 메시지 도착
- 실제 상담 폼 제출 → 이메일 + Slack 동시 알림

---

## 6. Sentry / Upstash / PostHog (도메인 무관 — 언제든 가능)

이 셋은 도메인이 없어도 진행 가능합니다. 자세한 단계는 별도 가이드 참조:

→ **`docs/observability-setup.md`** (각 ~10분)

- Sentry: 에러 자동 수집
- Upstash: AI 도구 rate limit 활성화
- PostHog: 사용자 행동 분석

---

## 7. 도메인 후 자동으로 활성화되는 것들

별도 작업 없이, 위 1~3번이 끝나면 자동 동작:

- ✅ 변호사 프로필 OG 이미지가 카카오톡·X 공유 시 정상 표시
- ✅ JSON-LD `LegalService` / `Person` / `Article` 가 운영 URL로 절대화 → Google Rich Results 인식
- ✅ AI 도구 호출이 audit log에 정상 기록 (Supabase 키 이미 설정됨)

---

## 체크리스트 한 줄 요약

```
[ ]  1. Resend 도메인 인증 + NOTIFY_FROM/EMAIL 운영 모드 전환
[ ]  2. NEXT_PUBLIC_SITE_URL → https://www.dowonlaw.com
[ ]  3. Naver Maps Client ID 발급 + env 추가
[ ]  4. Google Search Console + Naver Search Advisor 등록
[ ]  5. Slack Webhook (팀 채널 정해지면)
[ ]  6. Sentry / Upstash / PostHog 키 등록 (도메인 무관, 언제든)
```

---

## 도메인 자체 발급/연결이 아직이라면

**Vercel 대시보드 → Project → Settings → Domains** 에서:
- (A) Vercel에서 도메인 구매 — 가장 간단, 자동으로 모든 설정 완료
- (B) 외부에서 산 도메인 연결:
  1. **Add Domain** 클릭 → 도메인 입력
  2. Vercel이 표시하는 A 레코드 / Nameserver 정보를 등록처(가비아·후이즈 등)에 반영
  3. SSL 자동 발급 (Let's Encrypt, 자동)
  4. DNS 전파 완료까지 보통 1~24시간

연결이 끝나면 위 1번부터 진행.
