# 도원 웹사이트 AI 기능 일람

> 작성: 2026-05-13 · 최신 빌드 기준
> PRD: `dowon-website-prd.md` §6 (AI 기능 명세)

| # | 기능 | 페르소나 | 진입점 | API | 모델 | 가드레일 |
|---|---|---|---|---|---|---|
| **1** | 사건 유형 진단 챗봇 (Triage) | 전 페르소나 (입문) | `/tools/triage` | `/api/ai/triage` | Claude Sonnet 4.6 | SYSTEM_FOOTER · 단정 금지 · 응급 119/1577-0199 |
| **2** | 시맨틱 라이브러리 검색 | 전 페르소나 | `/library/search` | `/api/ai/library-search` | OpenAI `text-embedding-3-small` + Claude rerank | RAG 인용 기반 |
| **3** | 약관 분석 (PDF) | 보험사 · 도원 내부 | `/tools/policy-reader` | `/api/ai/policy-analyze` | Claude (PDF 직접) | 어드민 인증 · 24h 자동 삭제 |
| **4** | 의무기록 사전 분석 | 도원 내부 | `/admin/medical-analysis` | `/api/ai/medical-analyze` | Claude (PDF 직접) | 어드민 인증 · `DOWON_DISABLE_EXTERNAL_AI` 가드 |
| **5** | 구상 가능성 자가진단 | 보험사 · 손해사정사 | `/tools/subrogation-check` | `/api/ai/subrogation-check` | Claude | 단정 금지 · "가능성" 표현 강제 |
| **6** | 판결 자동 요약 cron | 내부 운영 | (백그라운드) | `/api/cron/harvest-cases` | Claude | 변호사 검수 큐 통과해야 발행 |
| **7** | 변호사 매칭 추천 | 전 페르소나 (보조) | (다른 도구에 통합) | `/api/ai/lawyer-match` | 가중치 휴리스틱 | — |
| **8** | 주간 뉴스레터 cron | 보험사·기업·일반 구독자 | (백그라운드) | `/api/cron/newsletter` | Resend (콘텐츠는 #6 결과) | 검수된 콘텐츠만 발송 |
| **10** | 사건 정보 정리 챗봇 (Intake) ⭐ | 개인 의뢰자 | `/tools/intake` | `/api/ai/intake` + `/api/ai/intake/confirm` | Claude Sonnet 4.6 | 사용자 확정 게이트 · 9-슬롯 사실 수집만 |

> ⭐ AI #10 (Intake)는 PRD 원본 #9(음성 상담)가 Phase IV 검토 항목으로 미뤄진 자리에 추가된 신규 도구입니다. 변호사법 §23 위험이 낮은 사실 수집·확인 기반.

---

## AI 도구 간 사용자 흐름

```
방문자 진입
  ↓
[Persona Gateway] /  ←  홈 페이지 4분할 게이트
  ↓
[Triage 챗봇] /tools/triage
  ├ "교통사고·자동차" 등 사건 유형 분류 (AI #1)
  ├ 적합 변호사 추천 (AI #7)
  └ CTA: ┌─ "AI와 더 자세히 정리하기" → /tools/intake (AI #10) ⭐
         └─ "바로 상담 신청"          → /contact/{persona}
  ↓
[Intake 챗봇] /tools/intake  ⭐ NEW
  ├ 9-슬롯 자동 채움 (5~10턴 자연어 대화)
  ├ 변호사 매칭 (AI #7)을 확정 모달에서 미리보기
  ├ 사용자 확정 게이트 ─ 동의·연락처 입력
  ↓
[consultation_requests] DB row 생성
  ↓
Slack + Resend 알림 → 도원 변호사 응대
  ↓
/admin/consultations/[id] 상세 ─ Intake 슬롯 카드 + 전체 대화 로그
```

병렬로:
- **보험사** → `/tools/subrogation-check` (AI #5) → `/contact/insurer`
- **약관 검토 필요** → 인증 어드민/보험사 → `/tools/policy-reader` (AI #3)
- **의료 사건 내부 검토** → `/admin/medical-analysis` (AI #4)
- **콘텐츠 자동 보충** → 매일 02:00 KST `/api/cron/harvest-cases` (AI #6) → 검수 → `/library`
- **뉴스레터** → 매주 월 09:00 KST `/api/cron/newsletter` (AI #8)

---

## Intake (AI #10) 상세

### 9개 슬롯

| 슬롯 | 형식 | 예시 |
|---|---|---|
| `matter_type` | enum (10종) | `auto` / `medical` / `insurance` / `contract` / `employment` / `consumer` / `criminal` / `real_estate` / `other` |
| `when` | `{ date, time_of_day, ongoing, notes }` | "2026-03-05 / 오후 6시경" |
| `where` | `{ location, notes }` | "강남역 근처" |
| `parties` | `{ user_role, other_parties[], notes }` | user_role = `victim`, others = 신호 위반 운전자 |
| `narrative` | text (자유 서술 + 사용자 추가 편집) | — |
| `damages` | `{ physical, property, financial, psychological, notes }` | property = 차량 수리비 800만원 |
| `evidence` | `{ items[], missing[], notes }` | items = [진단서, 블랙박스 영상] |
| `desired_outcome` | `{ options[], notes }` | options = [compensation, settlement] |
| `prior_actions` | `{ police_report, insurance_claim, settlement_attempt, other_lawyer, notes }` | insurance_claim = true |

### 변호사법 위험이 낮은 이유

1. **사실만 수집** — 승소 가능성·청구액·법률 해석 의견 제공 금지 (시스템 프롬프트에 명시)
2. **사용자 확정 게이트** — 모달에서 검토 후 동의 체크해야만 변호사에게 전달
3. **변호사 검수 게이트** — 도착 후 `/admin/consultations`에서 변호사가 응대 결정
4. **감사 로그** — 모든 호출이 `ai_audit_logs`에 자동 기록 (1년 이상 보관)
5. **재제출 방지** — `/api/ai/intake/confirm`은 동일 세션의 두 번째 호출을 멱등 처리 (중복 row 방지)

### 데이터 흐름 (확정 시점)

```sql
-- 1) consultation_requests INSERT (case_summary는 사람이 읽을 수 있는 텍스트로)
INSERT INTO consultation_requests (persona, contact_info, case_summary, intake_session_id, status)
VALUES ('personal', {...}, '[AI 인테이크 요약] ...', $sessionId, 'new');

-- 2) ai_conversations UPDATE (대화 + 슬롯 + 확정 요약 저장)
UPDATE ai_conversations
SET confirmed_summary = {...}, confirmed_at = now(), converted = true,
    consultation_request_id = $newId
WHERE session_id = $sessionId;
```

이후 변호사가 `/admin/consultations/[id]` 에서:
- 좌측: 확정 요약 카드 (9개 섹션)
- 우측: 연락처 + 세션 정보 + completeness
- 하단 collapsed: 전체 대화 로그 (사용자 원문 그대로)

---

## 운영 점검

| 항목 | 위치 |
|---|---|
| AI 호출 감사 로그 | Supabase `ai_audit_logs` 테이블 |
| Intake 세션 영구 보관 | Supabase `ai_conversations` (per-session unique) |
| 상담 알림 (Slack) | `SLACK_WEBHOOK_URL` 설정 후 자동 |
| 상담 알림 (이메일) | `RESEND_API_KEY` + `NOTIFY_EMAIL` 설정 후 자동 |
| Cron 실행 기록 | Vercel `Project → Cron Jobs` |
| 에러 모니터링 | Vercel `Functions → Logs` |

## 변경 관리

신규 AI 기능을 추가할 때:
1. PRD §6.1 우선순위 매트릭스에 한 줄 추가
2. 본 문서 표에 한 줄 추가
3. `components/ai/legal-disclaimer.tsx` 푸터 포함 여부 확인
4. `lib/ai/audit.ts` `withAudit()` 래퍼로 호출 감싸기
5. 변호사법 §23 표현 검토
