# 법무법인 도원 — 홈페이지 리뉴얼 PRD

> Claude Code 작업 지시서 (Product Requirements Document)
> 버전: v1.0 · 작성일: 2026.05
> 대상 사이트: https://www.dowonlaw.com

---

## 0. 이 문서를 읽는 방법

이 문서는 Claude Code가 **그대로 작업에 착수할 수 있는 수준**으로 작성되었습니다.

- **Section 1~2**: 프로젝트 컨텍스트 — 무엇을 왜 만드는지
- **Section 3**: 정보 구조(IA) — 페이지·라우트 명세
- **Section 4**: 디자인 시스템 — 색상·타이포·간격·컴포넌트
- **Section 5**: 페이지별 상세 명세
- **Section 6**: AI 기능 명세 — 각 기능별 인터페이스
- **Section 7**: 기술 스택 및 데이터 구조
- **Section 8**: 작업 순서 (Phase별 체크리스트)
- **Section 9**: 법적 준수 사항 (변호사법 등)

작업 시 **Section 8의 Phase 1부터 순차적으로** 진행할 것.

---

## 1. 프로젝트 개요

### 1.1 클라이언트
**법무법인 도원** — 서울 서초구 소재. 보험 분쟁(자동차/장기/화재/배상책임/생명) 특화 로펌. 의료분쟁지원센터·민간조사센터·채권회수팀을 부설 운영.

### 1.2 핵심 비즈니스 가치 (사이트 전체가 일관되게 전달해야 할 메시지)

> **"조사 → 소송 → 구상 → 추심을 한 팀에서 끝내는 통합 모델"**

대부분의 경쟁 로펌은 '소송 전문'에 그치지만, 도원은 부설기관(민간조사·의료분쟁) + 채권회수팀까지 보유. 이 통합 모델이 사이트 첫 화면부터 일관되게 드러나야 함.

### 1.3 페르소나 (4가지)

| 페르소나 | 동기 | 주요 관심 콘텐츠 |
|---------|------|----------------|
| **보험사·손해사정사** | 자문 계약, SIU 협업, 구상 위임 | 구상 회수율, 자문 사례, 약관 해석 칼럼 |
| **기업 고객** | 법률자문 계약 | 산업별 자문 사례, 자문 구조, 비용 |
| **의료분쟁 피해자** | 의료사고 상담 | 의료분쟁지원센터, 윤은희 변호사(의사), 초기 상담 절차 |
| **개인 피해자** | 보험 분쟁, 교통사고 등 | 사건 유형 셀프체크, 무료 1차 상담 |

### 1.4 비즈니스 목표

1. **B2B 신뢰도 확립** — 보험사·기업이 자문 의뢰 시 1차로 신뢰할 수 있는 디지털 인프라
2. **검색 유입 확장** — 라이브러리 콘텐츠를 SEO 자산으로 전환
3. **상담 전환율 개선** — 페르소나별 분리된 동선으로 적합 클라이언트만 통과
4. **운영 효율** — AI 도입으로 1차 상담·자료 분석 시간 단축

---

## 2. 현재 사이트 진단 (As-Is)

### 2.1 강점 (그러나 사이트에서 드러나지 못함)

- **One-Stop 통합 처리 모델**: 메뉴 한 줄로만 표시됨
- **변호사 + 의사 이중 자격(윤은희 변호사)**: '비상임' 한 줄로 가려짐
- **부설 민간조사센터·의료분쟁지원센터**: 사이드 메뉴에만 노출
- **풍부한 판례·칼럼 자료**: 검색·필터 없음, 사실상 묻혀 있음

### 2.2 약점

- **레거시 IA**: .asp 기반 정적 페이지, 모바일 `user-scalable=0`으로 확대 차단
- **단일 진입 동선**: 4개 페르소나가 같은 입구·같은 화면
- **구성원 페이지가 사진+이름 나열**: 전문분야·사례·관련 콘텐츠 없음
- **B2B 신뢰 시그널 부재**: 수임 실적·승소율·자문 기업 수 등 정량 지표 없음
- **검색·필터 부재**: 콘텐츠 자산이 활용되지 않음

---

## 3. 정보 구조 (IA)

### 3.1 사이트맵

```
/                                    메인 (통합 모델 헤로 + 페르소나 게이트)
├── /about                            도원 소개
│   ├── /about/philosophy             철학·인사말
│   ├── /about/capability             통합 모델 상세 (조사→소송→구상→추심)
│   ├── /about/history                연혁
│   └── /about/contact                오시는 길·문의
│
├── /practice                         업무분야
│   ├── /practice/insurance           손해보험·생명보험
│   │   ├── /auto                     자동차보험
│   │   ├── /long-term                장기보험
│   │   ├── /fire                     화재보험
│   │   ├── /liability                배상책임보험
│   │   └── /life                     생명보험
│   ├── /practice/medical             의료분쟁
│   ├── /practice/advisory            법률자문
│   ├── /practice/investigation       민간조사·형사소송
│   └── /practice/subrogation         구상·고액보상·합의절충
│
├── /people                           구성원
│   ├── /people/lawyers               변호사
│   ├── /people/lawyers/[slug]        변호사 상세 (재구성)
│   ├── /people/fellows               고문·전문위원
│   ├── /people/recovery              채권회수팀
│   └── /people/management            경영관리팀
│
├── /centers                          부설기관 (신설 — 강조)
│   ├── /centers/investigation        민간조사센터
│   └── /centers/medical              의료분쟁지원센터
│
├── /library                          라이브러리 (검색·필터 강화)
│   ├── /library/cases                판례
│   ├── /library/cases/[slug]         판례 상세
│   ├── /library/columns              칼럼
│   ├── /library/columns/[slug]       칼럼 상세
│   ├── /library/media                강의·컨설팅
│   └── /library/search               통합 검색
│
├── /clients                          고객사·협력사
│
├── /contact                          상담 신청 (페르소나별 분기)
│   ├── /contact/insurer              보험사 전용
│   ├── /contact/enterprise           기업 전용
│   ├── /contact/medical              의료분쟁
│   └── /contact/personal             개인
│
└── /tools                            AI 도구 (페르소나별)
    ├── /tools/triage                 사건 유형 진단 챗봇 (개인용)
    ├── /tools/subrogation-check      구상 가능성 자가진단 (보험사용)
    └── /tools/policy-reader          약관 분석 (보험사용 · 로그인)
```

### 3.2 글로벌 네비게이션

상단 고정 네비게이션 (데스크탑):

```
[로고 도원]   소개    업무분야    구성원    부설기관    라이브러리    [상담신청 CTA]
```

모바일은 햄버거 메뉴 + 우측 상단 [상담신청] CTA 고정.

### 3.3 페르소나 게이트 (메인 페이지 핵심 컴포넌트)

스크롤 진입 직후 등장하는 4분할 게이트:

```
┌──────────────┬──────────────┐
│  보험사·     │  기업         │
│  손해사정사   │  법률자문      │
├──────────────┼──────────────┤
│  의료분쟁     │  개인         │
│  피해자       │  사건의뢰     │
└──────────────┴──────────────┘
```

- 클릭 시 해당 페르소나에 맞춤화된 콘텐츠 페이지로 이동
- 쿠키에 `persona` 저장 → 재방문 시 해당 영역 우선 노출

---

## 4. 디자인 시스템

### 4.1 디자인 컨셉

**"Modern Editorial Law" — 현대적 사설(社說)의 무게감**

| 키워드 | 의도 |
|--------|------|
| Paper & Ink | 법조의 본질인 '문서'의 질감 (아이보리 + 잉크 블랙) |
| Gold Accent | 신뢰·전통·격조 (난색 골드, 차가운 금속이 아님) |
| Generous Negative Space | 충분한 여백 = 차분함·고급감 |
| Editorial Typography | 본격적인 세리프 한글 + 라틴 세리프 디스플레이 |
| Subtle Motion | 과한 애니메이션 금지. 등장·전환 위주 |

**피해야 할 것**: 차가운 블루 일변, 검은 배경 + 황금 일변(중후함 강박), 보라색 그라데이션, 흔한 코퍼레이트 산세리프(Inter, Roboto 등).

### 4.2 컬러 시스템 (CSS 변수)

```css
:root {
  /* 베이스 — 페이퍼/잉크 */
  --color-paper:        #F5EFE4;    /* 메인 배경 (아이보리) */
  --color-paper-2:      #EBE3D3;    /* 카드·섹션 분리용 */
  --color-paper-3:      #DFD6C2;    /* 보더·분할선 */
  --color-ink:          #1A1814;    /* 본문·헤딩 */
  --color-ink-soft:     #3D3830;    /* 보조 텍스트 */
  --color-ink-mute:     #6B6258;    /* 캡션·메타 */

  /* 액센트 — 골드 */
  --color-gold:         #B8924A;    /* 메인 액센트 */
  --color-gold-bright:  #D4B06A;    /* 호버·강조 */
  --color-gold-deep:    #8C6E38;    /* 진한 액센트 (CTA) */

  /* 시그널 컬러 (최소 사용) */
  --color-rust:         #8A3A25;    /* 중요 액션·경고 */
  --color-forest:       #2F4A3A;    /* 성공·완료 */

  /* 다크 영역 (Footer·일부 섹션) */
  --color-night:        #0F0E0C;    /* 다크 배경 */
  --color-night-2:      #161410;    /* 다크 카드 */

  /* 시맨틱 — UI */
  --bg:                 var(--color-paper);
  --bg-elevated:        var(--color-paper-2);
  --border:             var(--color-paper-3);
  --text:               var(--color-ink);
  --text-soft:          var(--color-ink-soft);
  --text-mute:          var(--color-ink-mute);
  --accent:             var(--color-gold);
  --accent-hover:       var(--color-gold-bright);
  --cta:                var(--color-gold-deep);
}
```

**사용 비율 (룰)**:
- 베이스 색(paper/ink): 80%
- 보조 색(paper-2, ink-soft): 15%
- 액센트(gold 계열): 5% 미만
- rust/forest: 1% 미만 (정말 시그널이 필요할 때만)

### 4.3 타이포그래피

```css
:root {
  /* 폰트 패밀리 */
  --font-display:  "Cormorant Garamond", "Noto Serif KR", serif;   /* 디스플레이 영문 */
  --font-serif-ko: "Noto Serif KR", "Cormorant Garamond", serif;   /* 한글 본문·헤딩 */
  --font-sans-ko:  "Pretendard Variable", "Pretendard", system-ui; /* UI·캡션 */
  --font-mono:     "JetBrains Mono", monospace;                    /* 라벨·메타 */

  /* 타입 스케일 (모바일 기준 → 데스크탑 미디어 쿼리로 증감) */
  --text-display:   clamp(40px, 9vw, 88px);   /* Hero 타이틀 */
  --text-h1:        clamp(28px, 5vw, 44px);   /* 페이지 타이틀 */
  --text-h2:        clamp(22px, 3.5vw, 32px); /* 섹션 헤딩 */
  --text-h3:        clamp(18px, 2.5vw, 22px); /* 서브 헤딩 */
  --text-body-lg:   17px;                      /* 본문 강조 */
  --text-body:      15.5px;                    /* 본문 기본 */
  --text-sm:        13.5px;                    /* 메타·캡션 */
  --text-xs:        11px;                      /* 라벨·태그 */

  /* 행간 */
  --leading-tight:  1.2;
  --leading-base:   1.75;
  --leading-loose:  1.9;

  /* 자간 */
  --tracking-tight:  -0.02em;
  --tracking-normal: 0;
  --tracking-label:  0.18em;  /* 라벨 전용 */
}
```

**타이포 룰**:
- 디스플레이 영문(Cormorant Garamond)은 *italic* 형태로 호흡 부여 — "Dowon *Law*"
- 한글 본문은 Noto Serif KR — 산세리프(Pretendard)는 UI·캡션·버튼에만
- 본문 단락 최대 폭: 32em (영문은 62ch)
- 라벨/메타는 JetBrains Mono + uppercase + tracking 0.18em

### 4.4 간격 시스템

```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  24px;
  --space-6:  32px;
  --space-7:  48px;
  --space-8:  64px;
  --space-9:  96px;
  --space-10: 128px;

  /* 섹션 패딩 */
  --section-y-mobile:  64px;
  --section-y-tablet:  96px;
  --section-y-desktop: 128px;

  /* 컨테이너 */
  --container-narrow: 720px;   /* 본문 단일 컬럼 */
  --container-base:   1080px;  /* 기본 페이지 */
  --container-wide:   1280px;  /* 와이드 (구성원, 라이브러리) */
}
```

### 4.5 보더·라운드·그림자

```css
:root {
  --radius-none:  0;
  --radius-sm:    2px;        /* 거의 직각 — 격조 */
  --radius-md:    4px;        /* 카드 기본 */
  --radius-pill:  9999px;     /* 태그·필 */

  /* 보더 */
  --border-hairline: 1px solid var(--border);
  --border-strong:   1px solid var(--color-ink);
  --border-accent:   1px solid var(--color-gold);

  /* 그림자 (절제) */
  --shadow-1: 0 1px 2px rgba(26,24,20,0.06);
  --shadow-2: 0 4px 12px rgba(26,24,20,0.08);
  --shadow-paper: 0 20px 40px -20px rgba(26,24,20,0.18);  /* 종이가 떠 있는 느낌 */
}
```

라운드는 **2~4px이 기본**, 8px 이상 금지 (격조 유지). 그림자도 절제.

### 4.6 모션

```css
:root {
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);   /* 등장 */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);  /* 전환 */
  --duration-fast:  180ms;
  --duration-base:  320ms;
  --duration-slow:  600ms;
  --duration-reveal: 900ms;   /* 스크롤 reveal */
}
```

**룰**:
- 스크롤 진입 시 reveal은 staggered (60~80ms 간격)
- 호버는 180ms 이내
- 페이지 전환은 fade + 위로 8px 이동
- **공중제비·바운스·과한 패럴럭스 금지**

### 4.7 핵심 컴포넌트 명세

#### 4.7.1 Button

```
Variants:
- primary    : 골드 딥 배경 + 페이퍼 텍스트
- secondary  : 잉크 보더 + 잉크 텍스트
- ghost      : 보더 없음 + 잉크 텍스트 + 호버 시 밑줄
- on-dark    : 페이퍼 텍스트 + 골드 밑줄 (다크 섹션용)

Sizes:
- sm: padding 8px 16px,  font 13px
- md: padding 12px 24px, font 14.5px
- lg: padding 16px 32px, font 15.5px

Border radius: 2px (직각에 가깝게)
Letter-spacing: 0.05em
Font-weight: 500
```

#### 4.7.2 Card

```
Default card:
- Background: paper-2
- Border: 1px solid border
- Padding: 24px (mobile) / 32px (desktop)
- Radius: 4px
- Top accent: 30px gold line (decorative)

Lawyer card:
- Photo: 4:5 ratio, grayscale by default, full color on hover
- Name in Noto Serif KR weight 600
- Role tag (mono, uppercase, tracking 0.15em)
- Expertise tags row

Case card (판례):
- Number badge (mono, gold)
- Title (serif, 600)
- Issue · Result 2-column
- Linked lawyer + linked column
```

#### 4.7.3 Tag

```
Default:
- Padding: 4px 10px
- Font: mono 11px uppercase tracking 0.15em
- Background: transparent
- Border: 1px solid border
- Color: ink-soft

Variants:
- accent: gold border + gold text
- filled: ink background + paper text
- removable: with × icon
```

#### 4.7.4 Section Header

```
구조:
[01] / EYEBROW LABEL (mono, gold)
[02] 영문 디스플레이 타이틀 (Cormorant italic, 큼)
[03] 한글 헤딩 (Noto Serif KR, 중간)
[04] 본문 리드 (serif, 본문 크기)

예시:
— 01
PRACTICE AREAS
업무분야
손해보험·생명보험에서 의료분쟁까지, 도원의 5대 영역
```

### 4.8 그리드 시스템

- 12-column grid (데스크탑), 4-column (모바일)
- gutter: 24px (모바일) / 32px (데스크탑)
- 컨테이너 좌우 패딩: 24px (모바일) / 60px (데스크탑)

### 4.9 아이콘

- **Lucide Icons** 사용 (lightweight, 1.5px stroke)
- 크기: 16, 20, 24, 32px 4단계
- 색: 텍스트 색을 따라감 (currentColor)
- 장식적 아이콘 금지 — 기능적 표현에만 사용

---

## 5. 페이지별 상세 명세

### 5.1 메인 페이지 (`/`)

```
┌─────────────────────────────────────────┐
│  [Header — sticky]                       │
├─────────────────────────────────────────┤
│                                          │
│  HERO                                    │
│  ─────                                   │
│  "Dowon Law"  ← 큰 영문 디스플레이        │
│  법무법인 도원                            │
│                                          │
│  "조사 → 소송 → 구상 → 추심,             │
│   한 팀으로 끝냅니다"                     │
│                                          │
│  [상담 신청] [통합 모델 보기]              │
├─────────────────────────────────────────┤
│                                          │
│  INTEGRATED MODEL DIAGRAM                │
│  ───────────────────────                 │
│  통합 모델 인터랙티브 다이어그램          │
│  [조사] → [소송] → [구상] → [추심]        │
│  각 단계 클릭 시 해당 팀·사례 expand      │
├─────────────────────────────────────────┤
│                                          │
│  PERSONA GATEWAY                         │
│  ───────────                             │
│  "어떤 사건으로 오셨나요?"                │
│  ┌──────┬──────┬──────┬──────┐           │
│  │보험사│ 기업 │ 의료 │ 개인 │           │
│  └──────┴──────┴──────┴──────┘           │
├─────────────────────────────────────────┤
│                                          │
│  PROOF POINTS (정량 신뢰 지표)            │
│  ──────────                              │
│  누적 수임  |  자문 기업  |  보유 자격     │
│  XX,XXX건   |  XXX개사    |  변호사·의사  │
├─────────────────────────────────────────┤
│                                          │
│  RECENT INSIGHTS                         │
│  ───────────────                         │
│  라이브러리에서 최신 판례·칼럼 3개         │
├─────────────────────────────────────────┤
│                                          │
│  CTA STRIP                               │
│  ──────                                  │
│  "1차 상담은 무료입니다"                  │
│  [상담 신청] [도원 소개 다운로드]          │
├─────────────────────────────────────────┤
│  [Footer — dark]                         │
└─────────────────────────────────────────┘
```

**상호작용 디테일**:
- Hero 영문 타이틀: 페이지 진입 시 letter-by-letter fade-in (총 900ms)
- 통합 모델 다이어그램: 4단계가 순차적으로 stroke-draw 애니메이션
- 페르소나 카드: 호버 시 골드 라인이 카드 상단에 슬라이드 진입
- 정량 지표: 스크롤 진입 시 숫자 카운트 업

### 5.2 통합 모델 페이지 (`/about/capability`)

**도원이 가장 강조해야 할 페이지**. 4단계 프로세스를 풀스크린 스토리텔링으로.

```
구조:
1. Intro: "왜 도원만 가능한가" — 1문장 + 다이어그램
2. Stage 1 — 조사 (민간조사센터)
   - 무엇을 하는가
   - 어떤 사건에 필요한가
   - 어떤 인력이 있는가
   - 실제 사례 1~2건 (비식별)
3. Stage 2 — 소송
4. Stage 3 — 구상·합의
5. Stage 4 — 추심 (채권회수팀)
6. 통합 효과 비교 표
   - 일반 로펌: 외주 4곳 거쳐야 함
   - 도원: 한 팀에서 종결
7. CTA: 보험사 자문 상담 / 기업 자문 상담
```

### 5.3 구성원 페이지 (`/people/lawyers`)

**현재의 가장 큰 약점 페이지를 신뢰의 무기로 전환**.

목록 페이지:
- 좌측: 필터 사이드바
  - 전문분야: 자동차/장기/화재/배상책임/생명/의료/구상/형사/자문
  - 직책: 대표/파트너/변호사/고문
  - 특수자격: 의사/세무사/회계사 등
- 우측: 변호사 카드 그리드 (3열, 모바일 1열)
- 검색 입력창: 변호사명 자유 검색

변호사 상세 페이지(`/people/lawyers/[slug]`):

```
┌───────────────────────────────┐
│  [큰 인물 사진 — 좌측]          │
│                                │
│  홍명호 대표변호사              │
│  Hong, Myung-Ho                │
│                                │
│  [전문분야 태그 5개]            │
│                                │
│  [이메일] [예약상담]            │
├───────────────────────────────┤
│  학력 / 경력                    │
├───────────────────────────────┤
│  대표 처리 사건 (3건, 비식별)    │
│  - 쟁점 · 결과 · 시사점          │
├───────────────────────────────┤
│  이 변호사의 칼럼 (자동 연결)    │
├───────────────────────────────┤
│  관련 판례 (자동 연결)          │
└───────────────────────────────┘
```

**특수 자격 강조 예시 (윤은희 변호사)**:
- 카드 상단에 "변호사 · 의사" 배지를 골드로
- 상세 페이지 인트로에 "의료분쟁에서 의학적 판단과 법률적 판단을 동시에 수행하는 국내 소수 인력 중 1인" 같은 설명

### 5.4 라이브러리 페이지 (`/library`)

```
┌─────────────────────────────────┐
│  검색바 + AI 추천 토글           │
│  [자연어로 검색해보세요]         │
├─────────────────────────────────┤
│  Tab: 전체 | 판례 | 칼럼 | 강의   │
├─────────────────────────────────┤
│  좌: 필터       우: 결과 카드     │
│                                  │
│  분야:          판례 카드 1       │
│  □ 자동차       판례 카드 2       │
│  □ 장기보험     칼럼 카드 1       │
│  □ 의료         ...              │
│                                  │
│  연도:                           │
│  □ 2026                          │
│  □ 2025                          │
│                                  │
│  변호사:                         │
│  □ 홍명호                        │
│  □ 윤은희                        │
└─────────────────────────────────┘
```

**판례 카드 구조**:

```
┌─────────────────────────────────┐
│ [판례 #2025-001]  자동차보험      │
│                                  │
│ 무보험차상해 약관조항의 효력      │
│ 대법원 2025다XXXXX                │
│                                  │
│ 쟁점: 약관 면책조항의 명시·설명   │
│       의무 이행 여부              │
│                                  │
│ 결론: 원고 일부 승소              │
│ 시사점: 약관 교부·설명 의무 강화  │
│                                  │
│ 담당: 홍명호 변호사               │
│ 관련 칼럼 →                       │
└─────────────────────────────────┘
```

### 5.5 부설기관 페이지 (`/centers/...`) — 신설

기존엔 사이드바에만 있던 두 센터를 독립 섹션으로 격상:

#### 5.5.1 민간조사센터 (`/centers/investigation`)

- 무엇을 조사하는가 (보험사기, 위장사고, 추적 등)
- 조사 인력 (전직 수사관·조사관)
- 조사 → 소송 연계 프로세스
- 보험사 SIU 협업 사례
- 의뢰 방법 (보험사 전용 / 일반 의뢰 분리)

#### 5.5.2 의료분쟁지원센터 (`/centers/medical`)

- 의료분쟁의 특수성
- 의사 자격 보유 변호사 소개 (윤은희)
- 의무기록 분석 → 의학적 검토 → 법률 검토 프로세스
- 사례 (비식별)
- 상담 신청 (의료분쟁 전용 폼)

### 5.6 상담 신청 페이지 (`/contact/*`)

페르소나별 4개 폼:

#### 보험사 (`/contact/insurer`)
```
필드:
- 회사명, 부서, 담당자명, 연락처, 이메일
- 의뢰 유형: 자문계약 / 개별 사건 / SIU 협업 / 구상 위임
- 사건 개요 (긴 텍스트)
- 첨부파일 (선택)
- 보안 안내 체크박스
```

#### 의료분쟁 (`/contact/medical`)
```
필드:
- 성함, 연락처, 이메일
- 진료 기관 / 진료 시점
- 사건 개요
- 의무기록 보유 여부 (Y/N)
- 1차 상담 희망 일시
- 개인정보 동의 (별도 안내)
```

#### 개인 (`/contact/personal`)
```
필드:
- 사건 유형 (드롭다운: 자동차/생명보험금/배상책임/기타)
- 성함, 연락처
- 사건 개요
- 희망 상담 방식 (전화/방문/온라인)
- → AI 진단 챗봇 우선 안내 (선택)
```

---

## 6. AI 기능 명세

### 6.1 우선순위 매트릭스

| # | 기능 | 대상 | ROI | 난이도 | Phase |
|---|------|------|-----|--------|-------|
| 1 | 사건 유형 진단 챗봇 | 외부 (개인·일반 방문자) | 높음 | 중 | II |
| 2 | 판례·칼럼 시맨틱 검색 | 외부 (모든 페르소나) | 높음 | 중 | II |
| 3 | 약관 분석 자동화 | 내부 (변호사) → SaaS화 가능 | 높음 | 높 | III |
| 4 | 의무기록 사전 분석 | 내부 (의료팀) | 중 | 높 | III |
| 5 | 구상 가능성 자가진단 | 외부 (보험사) | 중 | 중 | III |
| 6 | 판결 자동 요약 파이프라인 | 내부 콘텐츠 운영 | 중 | 중 | III |
| **추가 7** | 변호사 매칭 추천 | 외부 (모든 페르소나) | 중 | 낮 | II |
| **추가 8** | 칼럼·뉴스레터 자동 발행 | 외부 (B2B) | 중 | 중 | III |
| **추가 9** | 음성 1차 상담 (전화 AI) | 외부 (개인) | 높음(잠재) | 매우 높 | IV(검토) |

### 6.2 기능별 인터페이스 명세

#### AI #1 — 사건 유형 진단 챗봇 (`/tools/triage`)

```typescript
// API 인터페이스
POST /api/ai/triage
Request:
{
  message: string,           // 사용자 자연어 입력
  conversationId?: string,   // 이어지는 대화
  context?: {
    referrer?: string,       // 어디서 왔는지
    persona?: 'personal' | 'enterprise' | 'medical' | 'insurer'
  }
}
Response:
{
  reply: string,             // AI 답변
  conversationId: string,
  classification: {
    matter_type: string,     // '자동차보험' | '의료분쟁' | ...
    confidence: number,      // 0-1
    suggested_lawyers: Array<{
      id: string,
      name: string,
      match_reason: string
    }>,
    needed_documents: string[],
    estimated_timeline: string
  },
  cta: {
    type: 'consultation' | 'library' | 'lawyer_profile',
    target: string
  }
}
```

**대화 흐름 (시스템 프롬프트 핵심)**:
1. 인사 + "법률 자문이 아닌 정보 안내" 명시
2. 사건 개요 청취 (1~3회 캐치업 질문)
3. 사건 유형 분류
4. 필요 자료·예상 기간·관련 변호사 안내
5. 상담 신청 폼으로 연결

**가드레일**:
- 구체적 법률 자문 제공 금지
- 승소 가능성 단정 금지
- 변호사법 23조(광고) 준수 — 과장 표현 차단
- 응급 상황(자살·폭력 위협) 감지 시 즉시 인간 응대 연결 안내

#### AI #2 — 판례·칼럼 시맨틱 검색 (`/library/search`)

```typescript
// API
POST /api/ai/library-search
Request:
{
  query: string,           // 자연어 질문
  filters?: {
    type?: 'case' | 'column' | 'media',
    practice_area?: string[],
    lawyer?: string[],
    year_from?: number,
    year_to?: number
  },
  top_k?: number          // default 10
}
Response:
{
  results: Array<{
    id: string,
    type: 'case' | 'column' | 'media',
    title: string,
    snippet: string,         // 매칭된 부분 발췌
    relevance_score: number,
    practice_area: string[],
    lawyer: { id, name },
    published_at: string,
    url: string
  }>,
  related_queries: string[],   // 추천 후속 질문
  related_lawyers: Array<{...}>
}
```

**구현 디테일**:
- 임베딩: `text-embedding-3-small` (OpenAI) or `bge-m3` (한국어 강함)
- 벡터 DB: pgvector (Supabase) 또는 Qdrant
- 청크 전략: 문단 단위 (300~500토큰) + 50토큰 overlap
- 재순위(rerank): Claude로 top-20 → top-10 재순위
- 캐시: Redis로 동일 쿼리 1시간 캐시

#### AI #3 — 약관 분석 자동화 (`/tools/policy-reader` · 로그인 필요)

```typescript
POST /api/ai/policy-analyze
Request: multipart/form-data
{
  file: PDF,                 // 보험 약관·증권
  analysis_type: 'coverage' | 'exclusion' | 'comparison',
  user_question?: string     // 특정 쟁점 질의
}
Response:
{
  document_summary: string,
  coverage: Array<{
    item: string,
    limit: string,
    conditions: string[],
    source_page: number
  }>,
  exclusions: Array<{
    clause: string,
    interpretation: string,
    related_cases: string[],
    source_page: number
  }>,
  highlighted_pdf_url?: string,   // 주요 조항 하이라이트된 PDF
  user_question_answer?: string
}
```

**보안**:
- 업로드 PDF는 24시간 후 자동 삭제
- 사용자 단위 접근 제한 (로펌 내부 + 인증된 보험사 고객만)
- 감사 로그 (누가 언제 무엇을 업로드/조회했는지)

#### AI #4 — 의무기록 사전 분석 (내부 전용)

```typescript
POST /api/ai/medical-record-analyze
Request: multipart/form-data
{
  files: PDF[],              // 의무기록·검사결과
  case_id: string,           // 도원 내부 사건 ID
  patient_id_hash: string    // 환자 비식별 해시
}
Response:
{
  timeline: Array<{
    date: string,
    event: string,
    source: { file: string, page: number }
  }>,
  potential_issues: Array<{
    issue: string,
    severity: 'low' | 'medium' | 'high',
    relevant_guidelines: string[],   // 대한의학회 가이드라인 매핑
    requires_expert_review: boolean
  }>,
  diagnostic_summary: string,
  missing_records: string[]   // 추가 확보 필요 자료
}
```

**준수**:
- 모든 분석은 *초안*이며 의료 자격자 검수 필수 표시
- 의료기록 데이터는 사내 폐쇄망에서만 처리 (외부 API 호출 금지 옵션 — 온프레미스 모델 검토)

#### AI #5 — 구상 가능성 자가진단 (`/tools/subrogation-check`)

```typescript
POST /api/ai/subrogation-check
Request:
{
  accident_type: string,
  parties: Array<{ role: string, info: string }>,
  damages: { amount: number, type: string[] },
  insurance_paid: number,
  fault_ratio?: string,
  additional_facts: string
}
Response:
{
  recovery_possibility: 'high' | 'medium' | 'low' | 'none',
  recovery_rate_estimate: { min: number, max: number },   // %
  key_factors: string[],
  recommended_actions: string[],
  similar_cases: Array<{
    summary: string,
    result: string
  }>,
  contact_lawyer?: { id, name, reason }
}
```

**비즈니스 효과**: 도구 사용 자체가 리드 생성. 결과 페이지에서 자연스럽게 자문 의뢰로 연결.

#### AI #6 — 판결 자동 요약 파이프라인 (내부 운영)

```
워크플로우:
1. [Cron] 매일 02:00 — 국가법령정보 API/대법원 종합법률정보에서 신규 판례 수집
2. 보험·의료·구상 키워드 필터
3. Claude로 요약 생성 (쟁점·결론·시사점 4단 구조)
4. 변호사 검수 큐에 적재 (관리자 페이지)
5. 변호사 승인 → 라이브러리 자동 발행
6. 발행 후 보험사 구독자에게 뉴스레터 발송
```

**관리자 페이지 필요**:
- 검수 대기 큐
- 초안 편집 인터페이스
- 발행 일정 관리
- 뉴스레터 구독자 관리

#### AI #7 (추가) — 변호사 매칭 추천

방문자가 라이브러리 글을 읽거나 챗봇과 대화한 결과를 기반으로 *그 사건에 가장 적합한 변호사* 1~3명을 추천.

```typescript
POST /api/ai/lawyer-match
Request:
{
  case_context: string,          // 사건 개요
  practice_area?: string[],
  preferred_location?: string,
  preferences?: string[]         // 예: "의료 자격 보유"
}
Response:
{
  matches: Array<{
    lawyer_id: string,
    name: string,
    match_score: number,
    match_reasons: string[],     // 왜 매칭됐는지
    relevant_cases: Array<{id, title}>,
    available_slots?: Array<{date, time}>
  }>
}
```

#### AI #8 (추가) — 칼럼·뉴스레터 자동 발행

```
파이프라인:
1. AI #6에서 발행된 신규 판례 수집
2. 주간 단위로 묶어서 뉴스레터 초안 생성
3. 도원 칼럼니스트 변호사의 코멘트 자동 요청 (이메일)
4. 코멘트 수집 후 최종 발행

대상:
- 보험사 실무진 (B2B 메인 채널)
- 기업 법무팀
- 일반 구독자
```

#### AI #9 (추가, 장기 검토) — 음성 1차 상담

전화 응대 AI. 야간·주말 1차 상담을 받아 사건 유형 분류 + 인간 변호사 콜백 예약.
*구현 난이도 매우 높음, 변호사법 검토 필수, Phase IV 이후 검토.*

### 6.3 AI 운영 공통 원칙

1. **'법률 자문이 아님' 명시** — 모든 AI 응답에 일관된 문구
2. **할루시네이션 방어** — RAG 기반 응답만, 인용 표시 의무화
3. **인간 검수 게이트** — 외부 발행 콘텐츠는 반드시 변호사 승인
4. **감사 로그** — 모든 AI 호출 기록 (입력/출력/시간/사용자)
5. **개인정보 처리** — 의료·민감정보는 별도 격리 환경

---

## 7. 기술 스택 및 데이터 구조

### 7.1 권장 스택

| 영역 | 선택 | 이유 |
|------|------|------|
| **프레임워크** | Next.js 14 (App Router) | SSR/ISR로 SEO 강력, 한국 시장 성숙 |
| **언어** | TypeScript | 타입 안정성, 협업 용이 |
| **스타일** | Tailwind CSS + CSS Variables | 디자인 토큰 시스템과 정합 |
| **컴포넌트** | shadcn/ui 베이스 + 커스텀 | 다듬어진 베이스, 커스터마이즈 자유 |
| **DB·인증** | Supabase | PostgreSQL + pgvector + Auth 일체 |
| **AI** | Claude API (Anthropic) + OpenAI (임베딩) | 한국어 추론 강함 (Claude), 임베딩 가성비 |
| **배포** | Vercel | Next.js 친화, ISR 지원 |
| **CMS** | Sanity 또는 Payload CMS | 변호사·판례·칼럼 콘텐츠 관리 |
| **분석** | PostHog | 페르소나별 행동 추적 |
| **검색** | pgvector + Postgres FTS | 의미 검색 + 키워드 검색 하이브리드 |

### 7.2 데이터베이스 스키마 (핵심 테이블)

```sql
-- 변호사
CREATE TABLE lawyers (
  id            uuid PRIMARY KEY,
  slug          text UNIQUE NOT NULL,
  name_ko       text NOT NULL,
  name_en       text,
  role          text,                -- '대표변호사', '파트너변호사', ...
  photo_url     text,
  bio_short     text,
  bio_long      text,
  email         text,
  practice_areas text[],             -- ['auto', 'medical', ...]
  special_qualifications text[],     -- ['의사', '세무사', ...]
  education     jsonb,
  career        jsonb,
  is_active     boolean DEFAULT true,
  display_order int,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- 업무분야
CREATE TABLE practice_areas (
  id            uuid PRIMARY KEY,
  slug          text UNIQUE NOT NULL,
  category      text,                -- 'insurance', 'medical', ...
  name_ko       text NOT NULL,
  name_en       text,
  description   text,
  content_md    text,                -- 마크다운 본문
  hero_image    text,
  parent_id     uuid REFERENCES practice_areas(id)
);

-- 판례
CREATE TABLE cases (
  id            uuid PRIMARY KEY,
  slug          text UNIQUE NOT NULL,
  case_number   text,                -- '대법원 2025다XXXXX'
  title         text NOT NULL,
  practice_areas text[],
  issue         text,
  conclusion    text,
  insight       text,
  content_md    text,
  lawyer_ids    uuid[],
  published_at  date,
  is_published  boolean DEFAULT false,
  ai_generated  boolean DEFAULT false,    -- AI 초안 여부
  reviewer_id   uuid REFERENCES lawyers(id),
  embedding     vector(1536)              -- pgvector
);

-- 칼럼
CREATE TABLE columns (
  id            uuid PRIMARY KEY,
  slug          text UNIQUE NOT NULL,
  title         text NOT NULL,
  practice_areas text[],
  excerpt       text,
  content_md    text,
  author_id     uuid REFERENCES lawyers(id),
  published_at  date,
  is_published  boolean DEFAULT false,
  embedding     vector(1536)
);

-- 상담 신청
CREATE TABLE consultation_requests (
  id            uuid PRIMARY KEY,
  persona       text NOT NULL,            -- 'insurer' | 'enterprise' | 'medical' | 'personal'
  contact_info  jsonb,
  case_summary  text,
  attachments   jsonb,
  ai_triage_id  uuid,                     -- AI 챗봇 대화 ID
  status        text DEFAULT 'new',
  assigned_lawyer_id uuid REFERENCES lawyers(id),
  created_at    timestamptz DEFAULT now()
);

-- AI 챗봇 대화
CREATE TABLE ai_conversations (
  id            uuid PRIMARY KEY,
  session_id    text,
  persona       text,
  messages      jsonb,                    -- 대화 전체
  classification jsonb,                   -- 분류 결과
  converted     boolean DEFAULT false,    -- 상담 전환 여부
  created_at    timestamptz DEFAULT now()
);

-- 뉴스레터 구독자
CREATE TABLE newsletter_subscribers (
  id            uuid PRIMARY KEY,
  email         text UNIQUE NOT NULL,
  name          text,
  company       text,
  segment       text,                     -- 'insurer' | 'enterprise' | 'general'
  topics        text[],                   -- 관심 분야
  is_verified   boolean DEFAULT false,
  unsubscribed_at timestamptz
);

-- AI 호출 감사 로그
CREATE TABLE ai_audit_logs (
  id            uuid PRIMARY KEY,
  tool_name     text,                     -- 'triage', 'library-search', ...
  user_id       uuid,
  input         jsonb,
  output        jsonb,
  tokens_used   int,
  duration_ms   int,
  created_at    timestamptz DEFAULT now()
);
```

### 7.3 폴더 구조 (Next.js App Router)

```
/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                메인
│   │   ├── about/
│   │   ├── practice/
│   │   ├── people/
│   │   ├── centers/
│   │   ├── library/
│   │   ├── clients/
│   │   └── contact/
│   ├── (tools)/
│   │   └── tools/
│   │       ├── triage/
│   │       ├── subrogation-check/
│   │       └── policy-reader/
│   ├── (admin)/
│   │   └── admin/
│   │       ├── cases/
│   │       ├── columns/
│   │       ├── lawyers/
│   │       ├── consultations/
│   │       └── ai-queue/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── triage/
│   │   │   ├── library-search/
│   │   │   ├── policy-analyze/
│   │   │   ├── medical-analyze/
│   │   │   ├── subrogation-check/
│   │   │   └── lawyer-match/
│   │   └── ...
│   └── layout.tsx
├── components/
│   ├── ui/                 shadcn 베이스
│   ├── layout/             Header, Footer, Container
│   ├── home/               메인 페이지 섹션
│   ├── library/            라이브러리 카드·필터
│   ├── lawyer/             변호사 카드·상세
│   ├── tools/              AI 도구 컴포넌트
│   └── shared/             공통
├── lib/
│   ├── supabase/
│   ├── ai/                 Claude·OpenAI 래퍼
│   ├── search/             벡터 검색
│   └── utils/
├── styles/
│   └── globals.css         CSS 변수·기본 스타일
├── content/                MDX (정적 콘텐츠)
└── public/
```

### 7.4 환경 변수

```
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
SANITY_PROJECT_ID=
SANITY_DATASET=
POSTHOG_KEY=
NEXT_PUBLIC_SITE_URL=
ADMIN_EMAIL_WHITELIST=
```

---

## 8. 작업 순서 (Claude Code 실행 체크리스트)

> 이 순서를 그대로 따라 작업할 것. 각 Phase 완료 후 검토.

### Phase 0 — 프로젝트 셋업 (1~2일)

- [ ] Next.js 14 App Router 프로젝트 초기화 (TypeScript)
- [ ] Tailwind CSS + CSS 변수 시스템 (Section 4 그대로 적용)
- [ ] shadcn/ui 베이스 설치
- [ ] Supabase 프로젝트 생성 + 스키마 마이그레이션 (Section 7.2)
- [ ] pgvector extension 활성화
- [ ] 폰트 로딩 (Cormorant Garamond, Noto Serif KR, Pretendard, JetBrains Mono)
- [ ] 기본 레이아웃: Header / Footer / Container
- [ ] 라우트 골격 (Section 3.1) — 빈 페이지로 생성

### Phase 1 — 정적 사이트 (3~4주)

#### Week 1: 디자인 시스템 + 메인
- [ ] CSS 변수 + Tailwind config 완성
- [ ] 컴포넌트 라이브러리: Button, Card, Tag, SectionHeader, Tab, Filter
- [ ] 메인 페이지 — Hero, 통합 모델 다이어그램, 페르소나 게이트
- [ ] 정량 지표 카운트업 컴포넌트

#### Week 2: 소개·업무분야·부설기관
- [ ] /about/* 페이지 (인사말, 통합 모델, 연혁, 오시는 길)
- [ ] /practice/* 페이지 (5개 영역)
- [ ] /centers/* 페이지 (민간조사센터, 의료분쟁지원센터) **— 신설 강조**

#### Week 3: 구성원
- [ ] /people/lawyers 목록 + 필터
- [ ] /people/lawyers/[slug] 상세 (사진·태그·사례·관련 칼럼)
- [ ] /people/fellows, /people/recovery, /people/management
- [ ] 변호사 데이터 시드 (현재 구성원 13명 등록)

#### Week 4: 라이브러리 + 상담 신청
- [ ] /library 메인 + 검색 (키워드 우선)
- [ ] /library/cases, /library/columns, /library/media
- [ ] 판례 카드·칼럼 카드 컴포넌트
- [ ] /contact/* 페르소나별 4개 폼
- [ ] 상담 신청 → Supabase 저장 → 슬랙·이메일 알림

### Phase 2 — AI 외부 기능 (3~4주)

#### Week 5: 데이터 + 검색
- [ ] 라이브러리 콘텐츠 임베딩 파이프라인 구축
- [ ] 기존 판례·칼럼 데이터 이관 + 임베딩 인덱싱
- [ ] /library/search — 시맨틱 검색 페이지 (AI #2)

#### Week 6: 챗봇
- [ ] /tools/triage — 사건 유형 진단 챗봇 (AI #1)
- [ ] 챗봇 → 상담 신청 폼 자동 채움 연동
- [ ] 변호사 매칭 추천 (AI #7) 통합

#### Week 7: B2B 도구
- [ ] /tools/subrogation-check — 구상 가능성 진단 (AI #5)
- [ ] 결과 페이지에서 자문 의뢰 연결
- [ ] B2B 리드 자동 분류 → 보험사 담당자 알림

#### Week 8: 통합·테스트
- [ ] 전체 페르소나 동선 테스트
- [ ] 변호사법 가드레일 점검 (Section 9)
- [ ] 성능 최적화 (이미지·코드 분할)
- [ ] SEO 점검 (메타·구조화 데이터·sitemap·robots)
- [ ] 배포 (Vercel)

### Phase 3 — 내부 자동화 (4~6주)

#### Week 9~10: 관리자 페이지
- [ ] /admin — 인증 (변호사 화이트리스트)
- [ ] /admin/cases, /admin/columns — 콘텐츠 관리 CMS
- [ ] /admin/consultations — 상담 신청 처리 대시보드
- [ ] /admin/ai-queue — AI 초안 검수 대기열

#### Week 11~12: 약관 분석
- [ ] /tools/policy-reader — 약관 분석 (AI #3) 베타
- [ ] 인증된 보험사 사용자만 접근
- [ ] PDF 업로드·하이라이트·결과 다운로드

#### Week 13~14: 의무기록 + 자동 발행
- [ ] /admin/medical-analysis — 의무기록 사전 분석 (AI #4)
- [ ] 폐쇄망 모드 (외부 API 호출 금지 옵션)
- [ ] 판결 자동 요약 파이프라인 (AI #6) — Cron 작업
- [ ] 뉴스레터 자동 발행 (AI #8)

### Phase 4 — 운영·확장 (지속)

- [ ] PostHog로 페르소나별 전환 추적
- [ ] A/B 테스트 (Hero 메시지, CTA 위치)
- [ ] 1년차 성과 측정 및 우선순위 재조정
- [ ] (검토) 음성 1차 상담 AI (AI #9)
- [ ] (검토) 약관 분석 도구 보험사 SaaS화

---

## 9. 법적 준수 사항

### 9.1 변호사법 (반드시 준수)

| 조항 | 의무 | 사이트 적용 |
|------|------|------------|
| 제23조 (광고) | 과장·허위 광고 금지 | "최고", "1위", "보장" 등 단정 표현 금지 |
| 제23조 (광고) | 승소 가능성 단정 금지 | AI 챗봇·도구의 답변 가드레일 |
| 제34조 (수임 제한) | 알선·소개 대가 금지 | 외부 플랫폼 연계 금지 |
| 변호사 윤리장전 | 비밀유지 의무 | 상담 데이터 암호화·접근 통제 |

**AI 응답 표준 푸터 (모든 AI 도구)**:
> 본 도구가 제공하는 정보는 일반적인 안내이며, 구체적 사건에 대한 법률 자문이 아닙니다. 실제 사건은 변호사와의 상담을 통해 진행하시기 바랍니다.

### 9.2 개인정보보호법

- 상담 신청 시 개인정보 수집·이용 동의 (목적/항목/기간/거부 권리)
- 의료기록 처리 시 별도 동의 + 민감정보 분리 저장
- AI 처리 시 외부 API 전송 여부 명시 (의료기록은 사전 동의 필수)
- 24시간 후 임시 업로드 자동 삭제 (약관 분석 도구)

### 9.3 접근성 (KWCAG 2.2 AA)

- 모든 이미지 alt 텍스트
- 명도 대비 4.5:1 이상 (본문)
- 키보드 네비게이션 완전 지원
- 스크린리더 호환 (ARIA)
- 모바일 `user-scalable=0` **제거** (현재 사이트 위반 사항)
- 폰트 크기 사용자 조정 지원

### 9.4 보안

- HTTPS 강제, HSTS 적용
- CSP 헤더 설정
- 관리자 페이지 2FA
- 로그인 시도 Rate limiting
- 정기 의존성 보안 업데이트 (Dependabot)
- 감사 로그 1년 이상 보관

---

## 10. 성공 지표 (KPI)

### 10.1 비즈니스 KPI

| 지표 | 베이스라인 | 6개월 목표 | 1년 목표 |
|------|-----------|----------|---------|
| 월간 방문자 | 측정 필요 | +50% | +150% |
| 상담 신청 전환율 | 측정 필요 | 1.5% | 3% |
| B2B 자문 의뢰 (분기) | 측정 필요 | +30% | +80% |
| 뉴스레터 구독자 | 0 | 300명 | 1,500명 |
| 라이브러리 페이지뷰 | 측정 필요 | +200% | +500% |

### 10.2 사이트 KPI

- LCP < 2.5s, INP < 200ms, CLS < 0.1 (모바일)
- 모바일 트래픽 비율 모니터링
- 페르소나별 진입·전환 깔때기

### 10.3 AI KPI

- 챗봇 → 상담 신청 전환율
- 시맨틱 검색 → 변호사 프로필 클릭률
- 약관 분석 도구 사용자당 월간 호출 수
- AI 초안 → 발행 통과율 (콘텐츠 자동화)

---

## 부록 A — 도원 기존 자산 인벤토리 (이관 대상)

### 변호사 (현재 13명, 2026.05 기준)

| 이름 | 직책 | 비고 |
|------|------|------|
| 홍명호 | 대표변호사 | |
| 방정숙 | 파트너변호사 | |
| 임웅찬 | 파트너변호사 | |
| 윤은희 | 변호사/의사 (비상임) | **의사 자격 강조 필요** |
| 정애리나 | 파트너변호사 | |
| 임원균 | 변호사 | |
| 서소현 | 파트너변호사 | |
| 김근요 | 변호사 | |
| 최규성 | 변호사 | |
| 김용준 | 변호사 | |
| 이효정 | 변호사 | |
| 강민주 | 변호사 | |
| 정찬익 | 변호사 | |

### 업무분야

- 손해보험 및 생명보험 (자동차/장기/화재/배상책임/생명)
- 의료분쟁
- 법률자문
- 민간조사·형사소송
- 구상 및 고액보상, 합의절충

### 부설기관

- 민간조사센터
- 의료분쟁지원센터

### 조직

- 변호사
- 고문·전문위원
- 채권회수팀
- 경영관리팀

### 연락처

- 서울사무소: 서울특별시 서초구 서초대로55길 3, 애니빌딩 4-5층
- TEL: 02-3481-6540 / 02-6415-0071
- FAX: 02-3481-6541 / 02-6415-0072
- EMAIL: dowonlaw@dowonlaw.com

---

## 부록 B — 작업 시 Claude Code 지침

### B.1 작업 원칙

1. **이 문서의 디자인 토큰을 그대로 사용** — 임의로 색·간격 변경 금지
2. **타이포 위계 엄수** — display/h1/h2/h3 단계별 폰트·크기 명세 따를 것
3. **각 페이지 작성 시 페르소나 의식** — 메인은 모두, 부설기관은 보험사+의료, 구성원은 B2B 신뢰 시그널
4. **AI 기능 구현 시 반드시 가드레일 코드 포함** — Section 6.3, Section 9.1
5. **데이터는 시드 스크립트로** — 현재 도원 사이트의 13명 변호사 정보로 초기 데이터 채울 것

### B.2 우선순위

작업 시작 시 다음 순서를 절대 우선:

1. **CSS 변수·디자인 시스템 (Section 4)** — 다른 모든 컴포넌트의 기반
2. **메인 페이지 Hero + 통합 모델 다이어그램** — 가장 강력한 차별 포인트
3. **구성원 페이지 재설계** — 가장 약한 기존 페이지를 가장 강한 페이지로
4. **라이브러리 검색** — 자산을 살리는 핵심

### B.3 확인 사항 (작업 전 체크)

- [ ] Section 4의 디자인 토큰을 모두 CSS 변수로 옮겼는가
- [ ] Cormorant Garamond + Noto Serif KR + Pretendard + JetBrains Mono 4종 폰트 로드 확인
- [ ] 모바일 viewport `user-scalable=0` 제거 (접근성)
- [ ] 페르소나 게이트가 메인 페이지 첫 스크롤 영역에 있는가
- [ ] 모든 AI 도구에 "법률 자문이 아님" 푸터가 포함되었는가

### B.4 변경 시 문서 갱신

이 PRD는 살아있는 문서임. 작업 중 다음과 같은 변경이 발생하면 본 문서를 함께 업데이트:

- 디자인 토큰 변경 → Section 4
- API 스키마 변경 → Section 6.2
- DB 스키마 변경 → Section 7.2
- 새 AI 기능 추가 → Section 6.1 표 + 명세 추가

---

## 끝.

이 PRD는 법무법인 도원의 통합 모델을 디지털 위에서 다시 말하기 위한 청사진입니다. 도원이 이미 가진 강점 — 부설기관, 의사 자격 변호사, 축적된 판례 — 을 디지털 자산으로 전환하는 것이 목적이며, AI는 그 자산을 증폭하는 레버리지입니다.

작업 중 의사결정이 필요한 지점에서는 항상 다음 질문으로 돌아갈 것:

> **"이 결정이 '조사→소송→구상→추심을 한 팀에서 끝낸다'는 메시지를 강화하는가, 약화하는가?"**

— END
