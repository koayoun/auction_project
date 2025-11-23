// Big API 응답 타입 정의

// Big API에서 반환하는 경매 아이템 타입
export interface BigAuctionItem {
  사건번호: string;
  법원: string;
  매각기일: string;
  소재지: string;
  물건기본내역: string;
  물건종류: string;
  감정가: string;
  최저가: string;
  유찰횟수: string;
  배당요구종기: string;
  청구금액: string;
  비고: string;
}

// Big API 스크래핑 응답
export interface BigScrapeResponse {
  success: boolean;
  page: number;
  court_name: string;
  court_code: string;
  count: number;
  total_count?: number; // 백엔드에서 아직 구현 안 된 경우 optional
  elapsed_time: string;
  search_params: {
    sno: string;
    tno: string;
    ipdate1: string;
    ipdate2: string;
    address: {
      sido: string;
      gu: string;
      dong: string;
    };
    eprice_range: [string, string];
    mprice_range: [string, string];
  };
  data: BigAuctionItem[];
}

// Big API 배치 스크래핑 응답
export interface BigBatchScrapeResponse {
  success: boolean;
  court_name: string;
  pages_scraped: string;
  total_count: number;  // ← total_count 사용
  data: BigAuctionItem[];
}

// Big API 법원 목록 응답
export interface BigCourtsResponse {
  count: number;
  courts: string[];
}

// Big API 시/도 목록 응답
export interface BigSidoResponse {
  count: number;
  sido_list: string[];
}

// Big API 구/군 목록 응답
export interface BigGuResponse {
  count: number;
  gu_list: string[];
  filtered_by: string;
}

// Big API 요청 파라미터
export interface BigScrapeParams {
  page?: number;  // 페이지 번호 (간편한 사용을 위해 추가)
  court?: string;  // 법원명 (간편한 사용을 위해 추가)
  sido?: string;   // 시/도 (간편한 사용을 위해 추가)
  gu?: string;     // 구/군 (간편한 사용을 위해 추가)
  search_court_name?: string;
  target_page?: number;
  search_sno?: string;
  search_tno?: string;
  search_ipdate1?: string;
  search_ipdate2?: string;
  search_address1_01?: string;
  search_address1_02?: string;
  search_address1_03?: string;
  search_eprice1?: string;
  search_eprice2?: string;
  search_mprice1?: string;
  search_mprice2?: string;
}

// Big API 배치 스크래핑 파라미터
export interface BigBatchScrapeParams {
  search_court_name?: string;
  start_page?: number;
  end_page?: number;
  search_ipdate1?: string;
  search_ipdate2?: string;
  delay?: number;
}

// Analysis API 요청 타입
export interface AnalysisRequest {
  감정가: number;
  최저가: number;
  평: number;
  청구금액: number;
  유찰횟수: number;
  소재지: string;
  배당요구종기: string;
  물건비고: string;
  물건상태: string;
}

// Analysis API 응답 타입
export interface AnalysisResult {
  '감정가대비_할인율(%)': number;
  '감정가대비_할인율_점수': number;
  '추정시세_원': number | null;
  '시세대비_할인율(%)': number | null;
  '시세대비_할인율_점수': number;
  '소재지_점수': number;
  '배당요구종기_점수': number;
  '물건비고_점수': number;
  '물건상태_점수': number;
  '총점': number;
  '등급': string;
  '누락항목': string[];
  error: boolean;
}

// Detail API 감정평가요항표 타입
export interface AppraisalSummary {
  location_and_surroundings: string;    // 위치 및 주위환경
  traffic_conditions: string;            // 교통상황
  building_structure: string;            // 건물의 구조
  usage_status: string;                  // 이용상태
  equipment_details: string;             // 설비내역
  land_shape_and_usage: string;          // 토지의 형상 및 이용상태
  adjacent_road_conditions: string;      // 인접 도로상태등
  land_use_plan_and_restrictions: string; // 토지이용계획 및 제한상태
  difference_from_public_records: string; // 공부와의 차이
  other_reference_matters: string;       // 기타참고사항
}

// Detail API 응답 데이터 타입
export interface DetailData {
  case_no: string;
  event_no1: string;
  event_no2: string;
  si: string;
  gu: string;
  region_code1: string;
  region_code2: string;
  court_no: string;
  obj_no: string;
  dividend_claim_deadline: string;  // 배당요구종기 (YYYYMMDD)
  dividend_claim_date: string;      // 배당요구종기 (YYYY-MM-DD)
  appraisal_summary: AppraisalSummary;
  raw_text: string;
  raw_html: string;
}

// Detail API 응답 타입
export interface DetailResponse {
  success: boolean;
  data?: DetailData;
  error?: string;
}

// Detail API 요청 파라미터
export interface DetailParams {
  case_no: string;
  si?: string;
  gu?: string;
  court_no?: string;
  obj_no?: string;
}
