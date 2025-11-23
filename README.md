# 🏛️ 경매 물건 분석 플랫폼

AI를 활용한 부동산 경매 물건 검색 및 분석 서비스입니다.

## 📋 프로젝트 소개

이 프로젝트는 법원 경매 물건을 검색하고, AI를 통해 가격 분석, 위험 분석, 위치 정보 등을 종합적으로 분석하여 제공하는 웹 애플리케이션입니다.

### 주요 기능

- 🔍 **경매 물건 검색**: 법원, 지역, 가격, 면적 등 다양한 조건으로 검색
- 📊 **AI 분석**: 선택한 물건에 대한 상세한 투자 분석
  - 종합 점수 및 투자 수익성 분석
  - 가격 분석 (감정가, 시세, 최저가 비교)
  - 위험 분석 (권리관계, 임차인 정보)
  - 위치 분석 (접근성, 주변 시설)
- 📍 **계층적 지역 필터**: 시/도 → 시/군/구 → 읍/면/동
- 💡 **다크 테마 UI**: 깔끔하고 현대적인 사용자 인터페이스

## 🛠️ 기술 스택

- **Frontend Framework**: React 19 + TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **Styling**: Styled-components
- **Build Tool**: Vite
- **AI API**: Google Gemini API
- **Architecture**: Feature-Sliced Design (FSD)

## 📦 설치 방법

### 1. 저장소 클론

```bash
git clone https://github.com/koayoun/auction_project.git
cd auction_project
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.example` 파일을 참고하여 `.env` 파일을 생성하고 API 키를 설정하세요.

```bash
cp .env.example .env
```

`.env` 파일을 열어서 다음 값을 설정하세요:

```env
VITE_GEMINI_API_KEY=your_api_key_here
VITE_GEMINI_MODEL=gemini-2.0-flash
```

**⚠️ 중요**: `.env` 파일은 Git에 커밋되지 않습니다. 각 개발자는 자신의 API 키를 설정해야 합니다.

## 🚀 실행 방법

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 실행되면 브라우저에서 `http://localhost:5173`으로 접속하세요.

### 프로덕션 빌드

```bash
npm run build
```

### 빌드 결과 미리보기

```bash
npm run preview
```

## 📁 프로젝트 구조

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 따릅니다.

```
src/
├── app/                    # 앱 초기화 및 프로바이더
│   └── store.ts           # Redux 스토어 설정
├── pages/                  # 페이지 컴포넌트
│   ├── Home.tsx           # 메인 검색 페이지
│   └── Dashboard.tsx      # 상세 분석 페이지
├── widgets/                # 복합 UI 블록
│   ├── layout/            # 레이아웃 컴포넌트
│   ├── auction-filters/   # 검색 필터
│   ├── auction-list/      # 경매 목록
│   ├── property-detail/   # 물건 상세정보
│   └── analysis-dashboard/ # AI 분석 대시보드
├── features/               # 비즈니스 기능
│   └── auctions/          # 경매 관련 기능
│       └── model/         # Redux 슬라이스
├── entities/               # 비즈니스 엔티티
│   └── auction/           # 경매 도메인 모델
│       └── types.ts       # TypeScript 타입 정의
└── shared/                 # 공유 리소스
    ├── ui/                # 공통 UI 컴포넌트
    ├── constants/         # 상수 데이터
    └── utils/             # 유틸리티 함수
```

## 🎨 주요 화면

### 1. 메인 검색 페이지 (Home)
- 다양한 조건으로 경매 물건 검색
- 검색 결과를 카드 형태로 표시

### 2. 상세 분석 페이지 (Dashboard)
- 선택한 물건의 상세 정보 표시
- AI 분석 대시보드 (4개 탭):
  - **종합**: AI 종합 투자 점수 및 요약
  - **가격분석**: 감정가, 시세, 할인율 등
  - **위험분석**: 권리관계, 임차인 정보
  - **위치정보**: 접근성, 주변 시설, 지도

## 📝 개발 가이드

### FSD 아키텍처 규칙

1. **의존성 방향**: 하위 레이어는 상위 레이어를 import할 수 없습니다
   - `shared` ← `entities` ← `features` ← `widgets` ← `pages`

2. **레이어별 역할**:
   - `shared`: 재사용 가능한 UI 컴포넌트와 유틸리티
   - `entities`: 비즈니스 도메인 모델
   - `features`: 사용자 상호작용 기능
   - `widgets`: 여러 features를 조합한 복합 UI
   - `pages`: 라우트와 연결된 페이지

### 코드 스타일

- TypeScript strict 모드 사용
- Styled-components로 스타일 관리
- Redux Toolkit으로 상태 관리

## 🔜 향후 계획

- [x] 실제 법원 경매 API 연동
- [ ] 실시간 입찰 정보 업데이트
- [ ] 카카오맵/네이버맵 API 연동
- [ ] 사용자 인증 및 관심 물건 저장
- [ ] 모바일 반응형 UI 개선
- [x] AI 모델 통합 (Gemini API)

## 📄 라이선스

MIT License

## 👤 개발자

- GitHub: [@koayoun](https://github.com/koayoun)

## 🤝 기여하기

이슈와 PR은 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
