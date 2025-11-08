# Auction Project Architecture

## FSD (Feature-Sliced Design) 구조

auction_project는 FSD(Feature-Sliced Design) 아키텍처를 기반으로 구성되어 있습니다.

## 레이어 구조

### 1. Shared Layer
**위치:** `src/shared/`

**역할:** 프로젝트 전체에서 재사용되는 공통 컴포넌트와 유틸리티

**특징:**
- 다른 레이어에 의존하지 않음
- UI 컴포넌트, 헬퍼 함수, 상수 등

**예시:**
- `ui/` - 공통 UI 컴포넌트
  - `CustomDropdown.tsx` - 커스텀 드롭다운 컴포넌트
  - `CustomInput.tsx` - 입력 컴포넌트
  - `DateRangePicker.tsx` - 날짜 범위 선택 컴포넌트
  - `Spinner.tsx` - 로딩 스피너
- `lib/` - 유틸리티 함수
  - `formatters.ts` - 금액, 면적 포맷팅
  - `validators.ts` - 입력값 검증
- `constants/` - 상수 정의
  - `courts.ts` - 법원 목록, 담당계 매핑
  - `regions.ts` - 지역 데이터 (시/도, 시/군/구)
- `api/` - API 클라이언트 설정
  - `client.ts` - Axios 인스턴스, 인터셉터

---

### 2. Entities (Model) Layer
**위치:** `src/entities/`

**역할:** 비즈니스 엔티티 정의

**특징:**
- 도메인 모델 타입 정의
- Redux와 독립적인 순수 타입

**예시:**
- `auction/` - 경매 엔티티
  - `types.ts` - Auction, AuctionItem 타입
  ```typescript
  interface AuctionItem {
    caseNumber: string;      // 사건번호
    court: string;           // 법원
    department?: string;     // 담당계
    address: string;         // 소재지
    appraisalPrice: number;  // 감정가
    minBidPrice: number;     // 최저입찰가
    area: number;            // 면적
    bidStartDate: string;    // 입찰 시작일
    bidEndDate: string;      // 입찰 종료일
    status: 'active' | 'completed' | 'cancelled'; // 상태
  }
  ```
- `property/` - 물건 정보 엔티티
  - `types.ts` - 물건 상세 정보, 권리분석
- `analysis/` - 분석 데이터 엔티티
  - `types.ts` - 실거래가, 위치분석, 투자수익률

---

### 3. Features Layer
**위치:** `src/features/`

**역할:** 사용자 기능 단위로 비즈니스 로직 구성

**구조:**
```
features/
  ├── auctions/
  │   ├── api.ts          # API 호출 함수
  │   ├── service.ts      # 비즈니스 로직
  │   ├── types.ts        # Feature 내부 타입
  │   ├── model/          # Redux 상태 관리
  │   │   ├── auctionSlice.ts
  │   │   └── index.ts
  │   └── index.ts        # Feature 통합 export
  ├── analysis/
  │   ├── api.ts          # 분석 데이터 API
  │   ├── service.ts      # 분석 로직
  │   └── model/
  │       └── analysisSlice.ts
  └── filters/
      ├── service.ts      # 필터링 로직
      └── types.ts        # 필터 파라미터 타입
```

**예시: auctions Feature**
- **API** (`api.ts`): 
  - `getAuctions()` - 경매 목록 조회 (대법원 API)
  - `getAuctionDetail()` - 단일 경매 상세 조회
  - `searchByCaseNumber()` - 사건번호로 검색
  - `searchByLocation()` - 소재지로 검색

- **Service** (`service.ts`):
  - `fetchAuctions()` - 경매 목록 fetch 로직
  - `applyClientFilters()` - 클라이언트 사이드 필터링
  - `filterByPriceRange()` - 감정가/최저입찰가 범위 필터링
  - `filterByAreaRange()` - 면적 범위 필터링
  - `filterByDateRange()` - 입찰 기간 필터링

- **Model** (`model/auctionSlice.ts`):
  ```typescript
  interface AuctionState {
    items: AuctionItem[];           // 경매 목록
    selectedItem: AuctionItem | null; // 선택된 경매
    totalElements: number;          // 총 개수
    loading: boolean;
    error: string | null;
    lastFetchTime: number | null;
    // 필터 상태
    filters: {
      court?: string;
      department?: string;
      location?: {
        city?: string;
        district?: string;
        town?: string;
      };
      dateRange?: {
        start: string;
        end: string;
      };
      priceRange?: {
        min: number;
        max: number;
      };
      areaRange?: {
        min: number;
        max: number;
      };
    };
  }
  ```
  - Redux store에서 경매 데이터 관리
  - 필터 상태 중앙 관리
  - 경매 목록 캐싱으로 API 호출 최소화

**예시: analysis Feature**
- **API** (`api.ts`):
  - `getRealTransactionPrices()` - 실거래가 조회 (국토교통부 API)
  - `getLocationAnalysis()` - 위치 분석 (주변 시설, 교통)
  - `calculateROI()` - 투자수익률 계산

- **Service** (`service.ts`):
  - `analyzeAuctionItem()` - 통합 분석 수행
  - `compareWithMarketPrice()` - 시세 비교
  - `assessRisk()` - 리스크 평가

---

### 4. Widgets Layer
**위치:** `src/widgets/`

**역할:** 재사용 가능한 독립적인 UI 블록

**특징:**
- Feature와 Entity를 조합
- 비즈니스 로직 포함 가능
- 여러 페이지에서 재사용

**예시:**

#### `auction-filters/`
```
auction-filters/
  ├── AuctionFilters.tsx  # 필터 UI 컨테이너
  ├── CourtFilter.tsx     # 법원/담당계 필터
  ├── LocationFilter.tsx  # 소재지 필터
  ├── SearchConditions.tsx # 기간/가격/면적 필터
  └── index.ts
```

**AuctionFilters.tsx 주요 기능:**
- 법원/담당계 선택 UI
- 소재지 선택 UI (시/도 → 시/군/구 → 읍/면/동)
- 입찰 기간 선택
- 감정가 범위 선택
- 면적 범위 선택
- 필터 상태를 Redux로 관리 또는 부모 컴포넌트로 전달

#### `auction-list/`
```
auction-list/
  ├── AuctionList.tsx     # 경매 목록 컨테이너
  ├── AuctionCard.tsx     # 경매 카드 컴포넌트
  ├── AuctionListHeader.tsx # 목록 헤더 (정렬, 개수 표시)
  └── index.ts
```

**AuctionList.tsx 주요 기능:**
- Redux에서 auctions, filters 조회
- 필터링 및 정렬 처리
- 페이지네이션 또는 무한 스크롤
- 로딩/에러 상태 처리

**AuctionCard.tsx 주요 기능:**
- 사건번호, 상태 표시
- 소재지 주소
- 감정가, 최저입찰가 표시 (포맷팅)
- 면적 표시
- 입찰 기간 표시
- 카드 클릭 시 상세 페이지로 이동

#### `analysis-dashboard/`
```
analysis-dashboard/
  ├── AnalysisDashboard.tsx  # 분석 대시보드 컨테이너
  ├── PropertyInfo.tsx       # 물건 기본 정보
  ├── PriceAnalysis.tsx      # 가격 분석 (시세 비교)
  ├── LocationAnalysis.tsx   # 위치 분석
  ├── ROICalculator.tsx      # 투자수익률 계산기
  ├── RiskAssessment.tsx     # 리스크 평가
  └── index.ts
```

**AnalysisDashboard.tsx 주요 기능:**
- 선택된 경매 물건의 상세 정보 표시
- 실거래가 데이터 시각화 (차트)
- 주변 시설 정보 (지도 연동)
- 투자수익률 시뮬레이션
- 권리분석, 입찰 이력 표시

---

### 5. Pages Layer
**위치:** `src/pages/`

**역할:** 라우트별 페이지 컴포지션

**특징:**
- Widgets 조합하여 페이지 구성
- 페이지 레벨 상태 관리
- 라우팅 처리

**예시:**

#### `Home.tsx`
```typescript
const Home = () => {
  // 필터 상태를 로컬에서 관리하거나 Redux 사용
  const [showCourtSelect, setShowCourtSelect] = useState(false);
  const [showLocationSelect, setShowLocationSelect] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // Redux에서 경매 목록 가져오기
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.auctions);

  const handleSearch = () => {
    // 필터 조건에 따라 경매 검색
    dispatch(fetchAuctions({
      court: showCourtSelect ? selectedCourt : undefined,
      location: showLocationSelect ? selectedLocation : undefined,
      searchInput,
    }));
  };

  return (
    <>
      <Header />
      <Container>
        <Title>경매 물건 자동 분석 시스템</Title>
        <Subtitle>대법원 경매정보, 실거래가, 위치분석을 한번에!</Subtitle>
        
        <AuctionFilters
          showCourtSelect={showCourtSelect}
          onCourtSelectChange={setShowCourtSelect}
          showLocationSelect={showLocationSelect}
          onLocationSelectChange={setShowLocationSelect}
        />
        
        <SearchBox
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
        />
        
        {loading && <Spinner />}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {items.length > 0 && <AuctionList items={items} />}
      </Container>
      <Footer />
    </>
  );
};
```

#### `Dashboard.tsx`
```typescript
const Dashboard = () => {
  const { id } = useParams(); // 사건번호 또는 ID
  const dispatch = useDispatch();
  const { selectedItem, loading } = useSelector((state) => state.auctions);
  const analysisData = useSelector((state) => state.analysis.data);

  useEffect(() => {
    // 경매 상세 정보 로드
    dispatch(fetchAuctionDetail(id));
    // 분석 데이터 로드
    dispatch(fetchAnalysisData(id));
  }, [id, dispatch]);

  if (loading) return <Spinner />;
  if (!selectedItem) return <NotFound />;

  return (
    <>
      <Header />
      <Container>
        <BackButton to="/">← 목록으로</BackButton>
        <AnalysisDashboard
          auctionItem={selectedItem}
          analysisData={analysisData}
        />
      </Container>
      <Footer />
    </>
  );
};
```

---

## 데이터 흐름

### 1. 경매 검색 플로우

```
Page (Home)
  │
  ├─> 필터 상태 관리 (법원, 소재지, 기간, 가격, 면적)
  │
  ├─> Widget (AuctionFilters)
  │     └─> 필터 UI 렌더링
  │
  ├─> 검색 버튼 클릭
  │
  └─> Feature (auctions)
        ├─> API 호출 (대법원 경매정보)
        │     └─> service.ts에서 필터링/변환 로직 처리
        │
        └─> Redux Store 업데이트
              └─> Widget (AuctionList)
                    └─> 경매 목록 렌더링
```

### 2. 경매 상세 분석 플로우

```
Page (Dashboard)
  │
  ├─> URL 파라미터에서 ID 추출
  │
  ├─> Feature (auctions)
  │     ├─> API: 경매 상세 정보 조회
  │     └─> Redux Store 업데이트
  │
  ├─> Feature (analysis)
  │     ├─> API: 실거래가 조회 (국토교통부)
  │     ├─> API: 위치분석 (카카오맵 등)
  │     ├─> Service: 투자수익률 계산
  │     └─> Redux Store 업데이트
  │
  └─> Widget (AnalysisDashboard)
        ├─> PropertyInfo (기본 정보)
        ├─> PriceAnalysis (가격 분석)
        ├─> LocationAnalysis (위치 분석)
        └─> ROICalculator (수익률 계산)
```

### 3. Redux State 관리

```typescript
// Global Store
store: {
  auctions: AuctionState {
    items: AuctionItem[],
    selectedItem: AuctionItem | null,
    totalElements: number,
    loading: boolean,
    error: string | null,
    filters: FilterState,
    lastFetchTime: number | null
  },
  analysis: AnalysisState {
    data: {
      [caseNumber: string]: {
        realTransactionPrices: RealPrice[],
        locationInfo: LocationInfo,
        roi: ROIData,
        riskAssessment: RiskData
      }
    },
    loading: boolean,
    error: string | null
  }
}
```

**장점:**
- API 호출 최소화 (캐싱)
- 컴포넌트 간 데이터 공유
- 일관된 상태 관리
- 필터 상태 중앙 관리로 URL과 동기화 가능

---

## 의존성 규칙

### ✅ 허용되는 의존성

```
Page
  ↓
Widget
  ↓
Feature → Entity (Model)
  ↓
Shared
```

### ❌ 금지되는 의존성

```
Entity → Feature (상위 레이어 참조 불가)
Feature A → Feature B (같은 레이어 간 직접 참조 불가)
Shared → 모든 상위 레이어
```

**예외:** Feature 간 통신은 Redux Store를 통해서만 가능

---

## 주요 기능 구현

### 1. 법원/소재지 필터링

**구현 위치:** Widget (AuctionFilters) + Feature (filters)

**방식:** 
- UI에서 상호배타적 선택 (법원 OR 소재지)
- 법원 선택 시: 담당계 목록 동적 로딩
- 소재지 선택 시: 시/도 → 시/군/구 → 읍/면/동 계층 선택

**데이터:**
- `shared/constants/courts.ts`에 법원-담당계 매핑 저장
- `shared/constants/regions.ts`에 지역 계층 데이터 저장

### 2. 검색 조건 복합 필터링

**구현 위치:** Feature (auctions/service.ts)

**방식:** Client-side 필터링 (API 응답 후)
```typescript
const applyClientFilters = (items: AuctionItem[], filters: FilterState) => {
  return items.filter(item => {
    // 기간 필터
    if (filters.dateRange) {
      const inDateRange = isInDateRange(item.bidStartDate, filters.dateRange);
      if (!inDateRange) return false;
    }
    
    // 가격 필터
    if (filters.priceRange) {
      const inPriceRange = isInPriceRange(item.appraisalPrice, filters.priceRange);
      if (!inPriceRange) return false;
    }
    
    // 면적 필터
    if (filters.areaRange) {
      const inAreaRange = isInAreaRange(item.area, filters.areaRange);
      if (!inAreaRange) return false;
    }
    
    return true;
  });
};
```

**이유:**
- 대법원 API 응답 구조가 복잡하고 필터링 옵션 제한적
- Client-side에서 세밀한 필터 제어 가능

### 3. 실거래가 데이터 연동

**구현 위치:** Feature (analysis/api.ts)

**방식:**
1. 경매 물건의 주소 추출
2. 주소 → 좌표 변환 (카카오 지오코딩 API)
3. 좌표 기반 실거래가 조회 (국토교통부 공공데이터 API)
4. 경매 물건과 비교 가능한 데이터 필터링 (면적, 연도 기준)
5. 시각화 (차트 라이브러리)

**API 연동:**
- 카카오맵 API: 주소 검색, 지도 표시
- 국토교통부 실거래가 API: 아파트/오피스텔/단독주택 실거래가
- 필요 시: 네이버/다음 부동산 크롤링 (법적 검토 필요)

### 4. 분석 데이터 캐싱

**구현 위치:** Feature (analysis/model/analysisSlice.ts)

**방식:**
```typescript
// 사건번호를 키로 분석 데이터 캐싱
const analysisSlice = createSlice({
  name: 'analysis',
  initialState: {
    data: {} as { [caseNumber: string]: AnalysisData },
    loading: {},
    error: {}
  },
  reducers: {
    fetchAnalysisStart: (state, action) => {
      const { caseNumber } = action.payload;
      state.loading[caseNumber] = true;
    },
    fetchAnalysisSuccess: (state, action) => {
      const { caseNumber, data } = action.payload;
      state.data[caseNumber] = data;
      state.loading[caseNumber] = false;
    },
    // 이미 캐시된 데이터는 재사용
  }
});
```

**효과:**
- 동일 물건 재방문 시 즉시 표시
- API 호출 비용 절감
- 네트워크 트래픽 감소

---

## 스타일링

### UI 라이브러리
- **CSS Modules** 또는 **styled-components** - CSS-in-JS
- **선택적:** Ant Design, Material-UI (컴포넌트 라이브러리)

### 디자인 시스템
- **폰트:** Pretendard, 나눔고딕
- **컬러 팔레트:**
  - Background: `#f5f5f5`, `#ffffff`
  - Primary: `#1890ff` (파란색)
  - Success: `#52c41a` (진행중)
  - Warning: `#faad14` (유찰)
  - Danger: `#f5222d` (취소)
  - Text: `#000000`, `#595959`, `#8c8c8c`

### 주요 컴포넌트 스타일
- **AuctionCard:**
  - Border: 1px solid #d9d9d9
  - Border radius: 8px
  - Shadow: 0 2px 8px rgba(0,0,0,0.1)
  - Hover: Shadow 강조, Border 색상 변경
  
- **Status Badge:**
  - 진행중: 파란색 배경
  - 유찰: 노란색 배경
  - 취소: 빨간색 배경

- **필터 섹션:**
  - Background: #fafafa
  - Border radius: 4px
  - Checkbox: Custom 디자인

---

## 성능 최적화

### 1. Redux 캐싱
- 경매 목록: 마지막 조회 시간 기록, 일정 시간 내 재사용
- 분석 데이터: 사건번호별 캐싱, 중복 API 호출 방지

### 2. useMemo & useCallback
- 필터링된 경매 목록 메모이제이션
- 정렬된 목록 메모이제이션
- 이벤트 핸들러 useCallback

### 3. 코드 스플리팅
- 페이지별 lazy loading (React.lazy)
- 차트 라이브러리 등 무거운 의존성 동적 import

### 4. API 호출 최적화
- Debounce: 검색 입력 시 일정 시간 후 API 호출
- 배치 요청: 여러 경매 물건의 분석 데이터 한번에 조회
- 무한 스크롤: 초기에는 20개만 로드, 스크롤 시 추가 로드

### 5. 이미지 최적화
- 지도 이미지: 썸네일 사용, lazy loading
- 로고/아이콘: SVG 사용

---

## API 연동 계획

### 1. 대법원 경매정보 API
**엔드포인트:** (실제 API 주소 확인 필요)
- 경매 물건 검색
- 경매 상세 정보 조회
- 입찰 이력 조회

**인증:** API Key 또는 OAuth

### 2. 국토교통부 실거래가 API
**엔드포인트:** 공공데이터포털
- 아파트 실거래가
- 오피스텔 실거래가
- 단독/다가구 실거래가

**인증:** 공공데이터 API Key

### 3. 카카오맵 API
**기능:**
- 주소 → 좌표 변환 (Geocoding)
- 지도 표시
- 주변 시설 검색 (학교, 지하철 등)

**인증:** REST API Key

### 4. 기타 고려사항
- CORS 처리: 백엔드 프록시 또는 서버 설정
- Rate Limiting: API 호출 제한 관리
- 에러 핸들링: 타임아웃, 네트워크 오류 등

---

## 향후 개선 방향

### 1. Feature 확장
- `features/favorites/` - 관심 물건 찜하기
- `features/alerts/` - 조건 알림 설정
- `features/reports/` - 분석 리포트 생성/다운로드

### 2. 사용자 인증
- `features/auth/` - 로그인/회원가입
- `features/users/` - 사용자 프로필 관리

### 3. 고급 분석 기능
- AI 기반 투자 추천
- 경매 낙찰 확률 예측
- 권리분석 자동화

### 4. 모바일 최적화
- 반응형 디자인
- 터치 제스처 지원
- PWA (Progressive Web App) 적용

### 5. 테스트 코드 추가
- Unit tests for Features (Jest)
- Integration tests for Widgets (React Testing Library)
- E2E tests for Pages (Playwright, Cypress)

---

## 기술 스택

### Core
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구

### State Management
- **Redux Toolkit** - 전역 상태 관리
- **React Query** (선택적) - 서버 상태 관리 대안

### Routing
- **React Router v7** - 클라이언트 사이드 라우팅

### Styling
- **styled-components** 또는 **CSS Modules**
- **Ant Design** (선택적) - UI 컴포넌트 라이브러리

### Data Visualization
- **Chart.js** 또는 **Recharts** - 차트
- **Kakao Map API** - 지도

### API
- **Axios** - HTTP 클라이언트
- **SWR** 또는 **React Query** (선택적) - 캐싱

### Development
- **ESLint** - 코드 린팅
- **Prettier** - 코드 포맷팅
- **Jest + React Testing Library** - 테스트

---

## 폴더 구조 (목표)

```
src/
├── app/                    # 앱 초기화
│   ├── App.tsx
│   ├── store.ts           # Redux store 설정
│   └── routes.tsx         # 라우트 설정
│
├── pages/                 # 페이지 레이어
│   ├── home/
│   │   ├── Home.tsx
│   │   └── Home.module.css
│   └── dashboard/
│       ├── Dashboard.tsx
│       └── Dashboard.module.css
│
├── widgets/               # 위젯 레이어
│   ├── auction-filters/
│   ├── auction-list/
│   ├── analysis-dashboard/
│   └── layout/            # 공통 레이아웃
│       ├── Header.tsx
│       └── Footer.tsx
│
├── features/              # 피처 레이어
│   ├── auctions/
│   │   ├── api.ts
│   │   ├── service.ts
│   │   ├── types.ts
│   │   └── model/
│   │       └── auctionSlice.ts
│   ├── analysis/
│   └── filters/
│
├── entities/              # 엔티티 레이어
│   ├── auction/
│   │   └── types.ts
│   ├── property/
│   └── analysis/
│
└── shared/                # 공유 레이어
    ├── ui/                # 공통 UI 컴포넌트
    ├── lib/               # 유틸리티
    ├── constants/         # 상수
    └── api/               # API 클라이언트
```

---

## 참고 자료

- [Feature-Sliced Design 공식 문서](https://feature-sliced.design/)
- [Redux Toolkit 문서](https://redux-toolkit.js.org/)
- [React 공식 문서](https://react.dev/)
- [대법원 경매정보](http://www.courtauction.go.kr/)
- [국토교통부 실거래가 공개시스템](https://rt.molit.go.kr/)
- [카카오맵 API](https://apis.map.kakao.com/)
