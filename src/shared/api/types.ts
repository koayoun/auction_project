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
