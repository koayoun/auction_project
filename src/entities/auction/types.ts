// 경매 물건 엔티티
export interface AuctionItem {
  id: string;                    // 고유 ID
  caseNumber: string;            // 사건번호 (예: 2024타경12345)
  court: string;                 // 법원
  department?: string;           // 담당계
  address: string;               // 소재지
  appraisalPrice: number;        // 감정평가액 (원)
  minSalePrice: number;          // 최저매각가격 (원)
  deposit: number;               // 매수신청 보증금 (원)
  detailedAddress?: string;      // 목록2 소재지
  dividendDeadline?: string;     // 배당요구종기 (YYYY-MM-DD)
  claimAmount?: number;          // 청구금액 (원)
  failedBidCount?: number;       // 유찰 횟수
  note?: string;                 // 비고
  area?: number;                 // 면적 (m²)
  bidStartDate?: string;         // 입찰 시작일 (YYYY-MM-DD)
  bidEndDate?: string;           // 입찰 종료일 (YYYY-MM-DD)
  status: AuctionStatus;         // 경매 상태
}

// 경매 상태
export type AuctionStatus = 'active' | 'completed' | 'cancelled';

// 위치 정보
export interface LocationInfo {
  city: string;                  // 시/도
  district?: string;             // 시/군/구
  town?: string;                 // 읍/면/동
}

// 필터 파라미터
export interface FilterParams {
  court?: string;
  department?: string;
  location?: LocationInfo;
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
}

