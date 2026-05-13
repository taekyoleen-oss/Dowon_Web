# 환경 변수 설정 가이드

> 작성: 2026-05-13
> 대상 파일: `.env.local` (로컬), Vercel `Project Settings → Environment Variables` (운영)
> 전체 변수 템플릿: `.env.example`

이 문서는 **이후에 새 키를 발급받았을 때 어디에 어떻게 추가하면 되는지** 한 자리에서 보기 위한 안내입니다. 발급 절차도 단계별로 정리되어 있으니 그대로 따라 하시면 됩니다.

---

## 1. 환경 변수 한눈 보기

| 변수 | 우선순위 | 발급처 | 없으면 | 비용 |
|---|---|---|---|---|
| `ANTHROPIC_API_KEY` | 필수 | console.anthropic.com | AI 챗봇·검색·분석 동작 안 함 | 사용량 |
| `OPENAI_API_KEY` | 필수 | platform.openai.com | 임베딩(시맨틱 검색) 동작 안 함 | 사용량 |
| `NEXT_PUBLIC_SUPABASE_URL` | 필수 | Supabase 프로젝트 → Settings → API | DB 전체 동작 안 함 | 무료 (Free 플랜) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 필수 | 동일 | 브라우저 측 DB 조회 안 됨 | — |
| `SUPABASE_SERVICE_ROLE_KEY` | 필수 | 동일 (Service Role) | 상담 폼·어드민·시드 동작 안 함 | — |
| `ADMIN_EMAIL_WHITELIST` | 필수 | 직접 입력 | `/admin` 접근 불가 | — |
| `CRON_SECRET` | 필수 | `crypto.randomBytes` 로컬 생성 | Vercel Cron이 401 받음 | — |
| `NEXT_PUBLIC_SITE_URL` | 필수 (배포 직전) | 본인 도메인/Vercel URL | sitemap·OpenGraph 링크 깨짐 | — |
| `RESEND_API_KEY` | 권장 | resend.com | 상담 신청 이메일 알림 없음 (콘솔 로그만) | 무료 3,000통/월 |
| `SLACK_WEBHOOK_URL` | 권장 | api.slack.com | 실시간 Slack 알림 없음 | 무료 |
| `NOTIFY_EMAIL` | 권장 | 직접 입력 | 알림 받을 이메일 주소 | — |
| `NOTIFY_FROM` | 권장 | 직접 입력 | Resend 발송자 표시 이름 | — |
| `DOWON_DISABLE_EXTERNAL_AI` | 권장 (의료) | 직접 입력 (`true`/`false`) | 의무기록 분석 외부 API 호출 차단 옵션 | — |
| `SANITY_PROJECT_ID` | Phase 4 (선택) | sanity.io | CMS 없음 (코드 직접 편집) | 무료 |
| `SANITY_DATASET` | Phase 4 (선택) | 동일 | 동일 | — |
| `POSTHOG_KEY` | Phase 4 (선택) | posthog.com | KPI 추적 안 됨 | 무료 1M events/월 |

---

## 2. 환경 변수 추가 공통 절차

### 2-1. 로컬 (`.env.local`)

1. 프로젝트 루트의 `.env.local` 파일을 엽니다 (없으면 `.env.example`을 복사해 생성).
2. 해당 변수 줄을 찾아 `=` 뒤에 값을 붙여넣습니다.
   ```env
   RESEND_API_KEY=re_abc123def456...
   ```
3. dev 서버를 재시작합니다.
   ```bash
   # Ctrl+C 로 종료 후
   npm run dev
   ```

> ⚠️ `.env.local` 은 `.gitignore` 에 등록되어 있어 GitHub에 올라가지 않습니다. 안전합니다.

### 2-2. Vercel (운영)

1. https://vercel.com 로그인 → `Dowon_Web` 프로젝트
2. **Settings → Environment Variables** 메뉴
3. **Add New** 버튼
4. 입력:
   - **Key**: 변수명 (예: `RESEND_API_KEY`)
   - **Value**: 발급받은 값
   - **Environment**: `Production` / `Preview` / `Development` 모두 체크 (또는 운영용만 `Production`)
5. **Save**
6. ⚠️ 환경 변수 추가/변경은 **자동 재배포를 트리거하지 않습니다**. 적용하려면:
   - **Deployments** 탭 → 최신 배포 우측 **⋯ 메뉴 → Redeploy**

---

## 3. 변수별 발급 절차

### 3-1. `RESEND_API_KEY` (이메일 알림)

#### 무엇을 위한 키
상담 신청이 들어오면 `NOTIFY_EMAIL` 주소(기본: `dowonlaw@dowonlaw.com`)로 알림 메일을 자동 발송합니다. 또한 Phase 3 주간 뉴스레터 (AI #8) 발송도 이 키를 사용합니다.

#### 발급 단계
1. **https://resend.com 가입** (Google/GitHub 로그인 가능)
2. 좌측 메뉴 **Domains → Add Domain**
3. `dowonlaw.com` 입력 → **Add**
4. 표시되는 DNS 레코드 (4-5건) 를 도메인 등록처(예: 가비아·후이즈)에 추가:
   - `MX` 1건
   - `TXT` (SPF) 1건
   - `TXT` (DKIM) 2건
   - `TXT` (DMARC) 1건 — 선택이지만 권장
5. Resend가 자동 검증 (5분~24시간 소요)
6. 좌측 **API Keys → Create API Key**
   - **Name**: `dowon-prod`
   - **Permission**: `Sending access`
   - **Domain**: `dowonlaw.com` 선택
7. 생성된 `re_xxxxxxxxxxxxxxxxxxxxx` 키 복사 (한 번만 노출됨)

#### 도메인 인증 전 임시 테스트
도메인 검증이 완료되기 전에도 Resend 기본 발송 주소로 테스트 가능합니다.
```env
RESEND_API_KEY=re_xxxxxxxxxxxx
NOTIFY_FROM="Dowon Test <onboarding@resend.dev>"
```
> 운영 발송은 반드시 도메인 검증 후 자체 도메인 발송자로 교체.

#### 어디에
- `.env.local` 16번 줄 `RESEND_API_KEY=` 뒤
- Vercel Environment Variables

---

### 3-2. `SLACK_WEBHOOK_URL` (실시간 Slack 알림)

#### 무엇을 위한 키
상담 신청이 들어오면 도원 Slack 채널에 카드 형태로 즉시 알림이 옵니다. 이메일보다 빠르게 응답할 수 있습니다.

#### 발급 단계
1. https://api.slack.com/apps 접속
2. **Create New App → From scratch**
   - **App Name**: `도원 웹 알림`
   - **Workspace**: 도원 팀 워크스페이스 선택
3. 좌측 **Features → Incoming Webhooks** → 우측 상단 토글 **On**
4. 페이지 하단 **Add New Webhook to Workspace** 클릭
5. 알림을 받을 채널 선택 (예: `#상담-신청`, `#general`)
6. **Authorize**
7. 페이지에 표시된 Webhook URL 복사

형식: `hooks.slack.com/services/` 로 시작하는 URL이 발급됩니다. (전체 URL을 문서/저장소에 노출하지 마세요 — GitHub Secret Scanning이 차단합니다.)

#### 어디에
- `.env.local` 38번 줄 `SLACK_WEBHOOK_URL=` 뒤
- Vercel Environment Variables

---

### 3-3. `NEXT_PUBLIC_SITE_URL` (절대 URL)

#### 단계
1. Vercel 첫 배포 후 발급되는 임시 URL 확인 (예: `https://dowon-web.vercel.app`)
2. Vercel Environment Variables 에서:
   ```
   NEXT_PUBLIC_SITE_URL=https://dowon-web.vercel.app
   ```
3. 도메인을 연결하면 (예: `dowonlaw.com`) 다시 갱신:
   ```
   NEXT_PUBLIC_SITE_URL=https://www.dowonlaw.com
   ```
4. **Redeploy**

> 로컬은 `http://localhost:3000` 그대로 두세요. dev 환경에서 절대 URL이 깨지지 않도록 일부러 분리.

---

### 3-4. `SANITY_PROJECT_ID` / `SANITY_DATASET` (Phase 4 · 선택)

#### 도입 의사결정
| 상황 | 권장 |
|---|---|
| 변호사·운영진이 직접 콘텐츠 추가하길 원함 | Sanity 도입 |
| 개발자가 매번 업데이트해도 무방 | **현재 상태 유지** |

현재는 `lib/data/lawyers.ts`, `library.ts`, `practice-areas.ts` 를 직접 수정 → `npm run seed` 로 Supabase 동기화하는 방식입니다. Sanity 도입은 별도 마이그레이션(1~2일) 작업이 필요합니다.

#### 발급 단계 (도입 시)
1. https://www.sanity.io/signup 가입 (GitHub/Google)
2. **Create new project**
   - **Name**: `dowon-cms`
   - **Dataset**: `production` (기본값 권장)
3. 프로젝트 대시보드 상단 **Project ID** 복사

```env
SANITY_PROJECT_ID=abc12345
SANITY_DATASET=production
```

#### 비용
무료 (3명·3GB·연 500K API call까지).

---

### 3-5. `POSTHOG_KEY` (Phase 4 · 분석)

#### 무엇을 위한 키
PRD §10 KPI 추적:
- 페르소나별 진입·전환 깔때기
- A/B 테스트 (Hero 메시지, CTA 위치)
- 페이지뷰·이탈률·세션 시간

#### 발급 단계
1. https://posthog.com/signup
2. 리전 선택:
   - **EU 권장** (개인정보보호법 — 데이터가 EU에 저장됨)
   - US도 가능
3. 프로젝트 생성
4. **Project Settings → Project API Key** 복사 (`phc_xxxxxxxxxxxxxxx`)

```env
POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com    # EU 리전 사용 시
```

> Phase 4에서 `app/layout.tsx` 에 PostHog 클라이언트 초기화 코드 추가 작업이 별도로 필요합니다 (15분).

#### 비용
무료 1M events/월.

---

## 4. 키 회전 (Rotation) 절차

키가 노출됐거나 정기 회전이 필요한 경우:

| 키 | 회전 방법 |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys → Revoke → Create new |
| `OPENAI_API_KEY` | platform.openai.com → API keys → Delete → Create |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → Reset service_role key |
| `RESEND_API_KEY` | Resend → API Keys → Revoke → Create |
| `SLACK_WEBHOOK_URL` | Slack App → Incoming Webhooks → 기존 삭제 → 새로 발급 |
| `CRON_SECRET` | 로컬에서 재생성: `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |
| `ADMIN_EMAIL_WHITELIST` | 이메일 추가/제거만, 회전 불필요 |

회전 후:
1. `.env.local` 업데이트
2. Vercel Environment Variables 업데이트 (동일 키 클릭 → Edit)
3. Vercel **Redeploy**

---

## 5. 체크리스트 (배포 전)

운영 배포 전 다음을 모두 만족하는지 확인하세요.

- [ ] `ANTHROPIC_API_KEY` Vercel 입력
- [ ] `OPENAI_API_KEY` Vercel 입력
- [ ] `NEXT_PUBLIC_SUPABASE_URL` Vercel 입력
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` Vercel 입력
- [ ] `SUPABASE_SERVICE_ROLE_KEY` Vercel 입력
- [ ] `ADMIN_EMAIL_WHITELIST` Vercel 입력
- [ ] `CRON_SECRET` Vercel 입력 (`.env.local` 과 동일 값)
- [ ] `NEXT_PUBLIC_SITE_URL` Vercel 입력 (배포 URL 또는 도메인)
- [ ] Vercel **Redeploy** 실행
- [ ] 배포 URL에서 `/admin/login` 접속 → 화이트리스트 이메일로 로그인 가능 확인
- [ ] `/library/search` 에 "약관 면책" 입력 → 결과 표시 확인 (Supabase·OpenAI·Anthropic 전부 정상)
- [ ] `/contact/personal` 폼 제출 → Supabase `consultation_requests` 테이블에 row 추가 확인
- [ ] (선택) `RESEND_API_KEY` 추가 후 폼 재제출 → 이메일 수신 확인
- [ ] (선택) `SLACK_WEBHOOK_URL` 추가 후 폼 재제출 → Slack 알림 수신 확인

---

## 6. 트러블슈팅

| 증상 | 원인·해결 |
|---|---|
| `/admin/login` 에서 "허용되지 않은 계정" | `ADMIN_EMAIL_WHITELIST` 에 이메일이 정확히 등록됐는지 확인 (대소문자 무시되지만 공백 주의) |
| `/library/search` 결과가 비어있음 | `npm run seed && npm run embeddings` 실행했는지 확인. Vercel에서는 `vercel env pull` 후 로컬에서 실행 |
| Triage 챗봇이 응답 안 함 | `ANTHROPIC_API_KEY` 형식 확인 (`sk-ant-api03-...`로 시작) |
| 상담 폼 제출 후 어드민에 안 보임 | Supabase `consultation_requests` 테이블 RLS 확인. `0001_init.sql` 적용 여부 |
| Vercel Cron이 401 | `CRON_SECRET` 이 Vercel Environment Variables 에 등록됐는지 확인. Vercel은 자동으로 `Authorization: Bearer <CRON_SECRET>` 헤더를 부착 |
| 이메일이 안 옴 | (a) `RESEND_API_KEY` 비어있음 → 콘솔 로그만. (b) 도메인 미검증. (c) `NOTIFY_FROM` 도메인이 Resend 등록 도메인과 다름 |
| Slack 알림이 안 옴 | `SLACK_WEBHOOK_URL` 의 채널이 비공개로 변경됐거나 봇이 추방됐을 가능성. Slack 앱 페이지에서 재발급 |

---

## 7. 관련 파일

| 파일 | 역할 |
|---|---|
| `.env.local` | 로컬 dev 환경 변수 (gitignore) |
| `.env.example` | 변수 목록 템플릿 (커밋됨) |
| `docs/deploy-vercel.md` | Vercel 배포 단계별 가이드 |
| `public/lawyers/README.md` | 변호사 사진/이력 업로드 가이드 |
| `README.md` | 프로젝트 개요 + 로컬 개발 시작 가이드 |
| `dowon-website-prd.md` | 원본 PRD (§7.4 환경변수 명세) |
