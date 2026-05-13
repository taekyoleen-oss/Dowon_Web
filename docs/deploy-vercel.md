# Vercel 배포 가이드

> 대상: `https://github.com/taekyoleen-oss/Dowon_Web.git`
> 작성: 2026-05-13

## 1. Vercel에서 프로젝트 Import

1. https://vercel.com 로그인 후 **Add New → Project**
2. **Import Git Repository** → `taekyoleen-oss/Dowon_Web` 선택
3. **Framework Preset**: Next.js (자동 감지)
4. **Root Directory**: `./` (기본)
5. **Build & Output Settings**: 그대로 (Next.js 기본)

## 2. Environment Variables 입력

`Project Settings → Environment Variables`에서 아래를 모두 추가하세요.
각 변수는 **Production / Preview / Development** 셋 다 체크해도 되고, 운영용만 Production에 두어도 됩니다.

| 키 | 값 출처 | 비고 |
|---|---|---|
| `ANTHROPIC_API_KEY` | `.env.local` 의 동일 키 복사 | 필수 |
| `OPENAI_API_KEY` | 동일 | 필수 |
| `NEXT_PUBLIC_SUPABASE_URL` | 동일 | 필수 (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 동일 | 필수 (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | 동일 | 필수 (server only — Vercel에서는 자동으로 서버에만 노출) |
| `NEXT_PUBLIC_SITE_URL` | `https://www.dowonlaw.com` (또는 vercel.app 임시 URL) | 도메인 연결 후 갱신 |
| `ADMIN_EMAIL_WHITELIST` | `taekyoleen@gmail.com` (필요시 ‘,’로 추가) | 어드민 접근 |
| `CRON_SECRET` | `.env.local`의 동일 값 | Vercel Cron 인증 |
| `RESEND_API_KEY` | resend.com에서 발급 | 비워두면 stub (콘솔 로그만) |
| `SLACK_WEBHOOK_URL` | Slack 앱에서 발급 | 비워두면 stub |
| `NOTIFY_EMAIL` | `dowonlaw@dowonlaw.com` | 상담 알림 수신자 |
| `NOTIFY_FROM` | `법무법인 도원 웹 <noreply@dowonlaw.com>` | Resend 발송자 (인증된 도메인 필요) |
| `DOWON_DISABLE_EXTERNAL_AI` | `false` (운영 시작 시) → `true` (의료 데이터 처리 시) | |

> **주의** — Anthropic / OpenAI / Supabase 키는 절대 클립보드에 오래 두지 말고 입력 직후 클립보드를 비우세요. 키를 보여주는 자리에 한 번이라도 화면 공유가 있었으면 즉시 회전(rotate)하세요.

## 3. Deploy

`Deploy` 버튼 → 첫 빌드 약 2-3분.

빌드 성공 후:
- 임시 URL: `https://dowon-web.vercel.app` 형태
- 80개 라우트가 정적/동적으로 컴파일됨

## 4. Cron 검증

`Project → Settings → Cron Jobs` 에 자동으로 두 작업이 보입니다:

| 경로 | 스케줄 (UTC) | 한국시간 | 용도 |
|---|---|---|---|
| `/api/cron/harvest-cases` | `0 17 * * *` | 매일 02:00 KST | 신규 판례 수집 (AI #6) |
| `/api/cron/newsletter` | `0 0 * * 1` | 월요일 09:00 KST | 주간 뉴스레터 (AI #8) |

Vercel은 `CRON_SECRET` env 변수가 있으면 `Authorization: Bearer <CRON_SECRET>` 헤더를 자동으로 부착해 호출합니다. 수동 검증:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://dowon-web.vercel.app/api/cron/harvest-cases
```

## 5. 도메인 연결 (선택)

1. `Project → Settings → Domains`
2. `dowonlaw.com` 또는 `www.dowonlaw.com` 추가
3. 안내된 A 레코드 / CNAME 을 도메인 등록처(예: 가비아)에 등록
4. SSL 자동 발급 (Vercel이 Let's Encrypt 자동 처리)
5. `NEXT_PUBLIC_SITE_URL` env를 새 도메인으로 갱신 후 재배포

## 6. 운영 중 점검

| 항목 | 위치 |
|---|---|
| 빌드 로그 | Vercel Deployments |
| 런타임 로그 | Vercel Functions → Logs |
| Cron 실행 기록 | Vercel Cron Jobs → 각 작업 클릭 |
| 상담 신청 | `/admin/consultations` (DB 직접 확인 가능) |
| AI 감사 로그 | Supabase `ai_audit_logs` 테이블 |

## 7. 배포 후 체크리스트

- [ ] `/` 정상 렌더링
- [ ] `/people/lawyers` 13명 카드 표시
- [ ] `/library` 카드 9개 (cases 3, columns 4, media 2)
- [ ] `/library/search` 에 "약관 면책" 입력 → 시맨틱 결과
- [ ] `/tools/triage` 챗봇 한국어 응답
- [ ] `/contact/personal` 폼 제출 → Supabase `consultation_requests` row 생성
- [ ] `/admin` → 화이트리스트 외 이메일 차단 / 화이트리스트 이메일 진입
- [ ] Cron 첫 야간 실행 후 `/admin/ai-queue` 채워짐 (또는 Supabase에서 직접 확인)
