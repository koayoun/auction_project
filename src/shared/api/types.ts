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
