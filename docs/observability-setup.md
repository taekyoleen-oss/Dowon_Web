# Observability — Sentry · Upstash · PostHog 활성화 가이드

세 도구 모두 **코드는 이미 통합되어 있고**, 환경변수만 비어있는 상태입니다. 각각 무료 티어 키만 받아 `.env.local`에 추가하면 즉시 활성화됩니다. 키가 없으면 자동으로 no-op 처리되므로 dev/test는 영향 없음.

각 작업 약 10분, 총 30분.

---

## 1. Sentry — 에러 모니터링

운영 후 발생하는 클라이언트·서버 에러를 자동 수집. 무료 티어로 월 5,000 events 가능.

### 키 발급
1. https://sentry.io/signup/ 가입 (GitHub 로그인 가능)
2. 프로젝트 생성 → Platform: **Next.js** 선택
3. DSN 복사 (`https://abc123@o12345.ingest.us.sentry.io/678910` 형태)

### `.env.local` 추가
```env
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_DSN=https://...@sentry.io/...    # 동일 값
```

배포 시 소스맵 업로드를 원하면 (선택):
```env
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=dowon-web
SENTRY_AUTH_TOKEN=sntrys_...   # Project Settings → Auth Tokens
```

### 동작 확인
- dev 재시작 후 어디든 의도적 에러 발생 → Sentry 대시보드에 1분 내 표시
- 코드 위치: `sentry.client.config.ts` · `sentry.server.config.ts` · `sentry.edge.config.ts`

---

## 2. Upstash Redis — Rate Limit

AI 도구 남용 방지. 무료 티어로 10,000 requests/day, 256MB 충분.

### 키 발급
1. https://console.upstash.com/ 가입
2. **Create Database** → Type: **Regional Redis** → Region: `ap-northeast-1` (도쿄, 한국에서 가장 가까움)
3. 생성 후 → **REST API** 탭 → `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` 복사

### `.env.local` 추가
```env
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AY...
```

### 동작 확인
- dev 재시작 후 같은 AI 도구를 빠르게 반복 호출 → 곧 429 응답 (rate limited)
- Tier별 한도는 `lib/ai/rate-limit.ts` 상단 주석 참조 (chat 20/60s, heavy 5/60min 등)

---

## 3. PostHog — 사용자 행동 분석

페이지뷰·전환·drop-off 트래킹. 무료 티어로 1M events/월.

### 키 발급
1. https://us.posthog.com/signup (또는 EU 거주자: https://eu.posthog.com/signup)
2. 가입 후 **Project Settings → Project API Key** 복사 (`phc_...` 형태)
3. 같은 페이지 상단에서 호스트 URL 확인 (`https://us.i.posthog.com` 또는 `https://eu.i.posthog.com`)

### `.env.local` 추가
```env
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com    # EU면 eu.i.posthog.com
```

> ⚠ **반드시 `NEXT_PUBLIC_` 접두어** — 클라이언트 JS에서 읽혀야 함.

### 동작 확인
- dev 재시작 → 사이트 페이지 이동 → PostHog 대시보드 **Live events** 에 `$pageview` 이벤트 즉시 표시
- 코드 위치: `components/analytics/posthog-init.tsx` (App Router pathname 변경마다 수동 pageview 캡처)

### 식별·이벤트 추적 추가 (선택)
폼 제출 등 주요 전환 이벤트를 명시적으로 캡처하고 싶으면:
```ts
import posthog from "posthog-js";
posthog.capture("consultation_submitted", { persona: "personal" });
```

---

## 운영 점검 한 줄 요약

| 도구 | 어디서 보나 | 무엇을 보나 |
|---|---|---|
| Sentry | sentry.io → Issues | 발생한 에러 + stack trace + 영향 받은 사용자 |
| Upstash | console.upstash.com → Data Browser | 현재 rate limit 키 + 차단 횟수 |
| PostHog | us.posthog.com → Insights | 페이지뷰·funnel·세션 리플레이 |
