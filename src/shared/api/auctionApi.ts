import type { AuctionItem } from '../../entities/auction';
import type {
  BigScrapeResponse,
  BigBatchScrapeResponse,
  BigCourtsResponse,
  BigSidoResponse,
  BigGuResponse,
  BigScrapeParams,
  BigBatchScrapeParams,
  BigAuctionItem,
  DetailResponse,
  DetailParams,
  AppraisalSummary,
} from './types';

//const API_BASE_URL = import.meta.env.VITE_BIG_API_URL || 'http://127.0.0.1:8000';
//const API_BASE_URL = import.meta.env.VITE_BIG_API_URL || 'http://backend-app-service.bdc105.svc.cluster.local:8000';
 const API_BASE_URL = import.meta.env.VITE_BIG_API_URL || 'https://backend.bdc105.kro.kr';

// Detail API URL (법원경매 세부정보 API) - 메인 백엔드와 동일
const DETAIL_API_URL = import.meta.env.VITE_DETAIL_API_URL || 'https://backend.bdc105.kro.kr';

// 에러 처리 유틸리티
class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// HTTP 요청 유틸리티
async function fetchApi<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(endpoint, API_BASE_URL);

  // 파라미터가 있으면 쿼리스트링 추가
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, `API 요청 실패: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `네트워크 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
}

// Big API 응답을 프론트엔드 AuctionItem 타입으로 변환
export function convertBigItemToAuctionItem(bigItem: BigAuctionItem, index: number): AuctionItem {
  // 첫 번째 아이템만 로깅 (너무 많은 로그 방지)
  if (index === 0) {
    console.log('🔍 API 원본 데이터 샘플:', {
      청구금액: bigItem.청구금액,
      배당요구종기: bigItem.배당요구종기,
      유찰횟수: bigItem.유찰횟수,
      비고: bigItem.비고,
    });
  }

  // 가격 문자열에서 숫자만 추출 (예: "1억 2,000만원" -> 120000000)
  const parsePrice = (priceStr: string): number => {
    // 모든 공백과 특수문자 제거
    const cleaned = priceStr.replace(/[^\d억만원,]/g, '');

    // "억"과 "만" 단위 처리
    let result = 0;

    // "억" 단위 추출
    const eokMatch = cleaned.match(/(\d+)억/);
    if (eokMatch) {
      result += parseInt(eokMatch[1]) * 100000000;
    }

    // "만" 단위 추출
    const manMatch = cleaned.match(/(\d+)만/);
    if (manMatch) {
      result += parseInt(manMatch[1]) * 10000;
    }

    // 숫자만 있는 경우 (콤마 제거)
    if (!eokMatch && !manMatch) {
      const numStr = cleaned.replace(/,/g, '');
      if (numStr) {
        result = parseInt(numStr);
      }
    }

    return result;
  };

  const appraisalPrice = parsePrice(bigItem.감정가);
  const minSalePrice = parsePrice(bigItem.최저가);

  // 보증금은 최저가의 10% (일반적인 기준)
  const deposit = Math.floor(minSalePrice * 0.1);

  // 고유 ID 생성 (사건번호 + 인덱스)
  const id = `${bigItem.사건번호.replace(/\s/g, '')}-${index}`;

  // 유찰횟수 파싱 (숫자만 추출)
  const parseFailedBidCount = (countStr: string): number | undefined => {
    if (!countStr) return undefined;
    const match = countStr.match(/\d+/);
    return match ? parseInt(match[0]) : undefined;
  };

  // 청구금액 파싱 (감정가와 동일한 방식)
  const parseClaimAmount = (amountStr: string): number | undefined => {
    if (!amountStr) return undefined;
    return parsePrice(amountStr);
  };

  const claimAmount = parseClaimAmount(bigItem.청구금액);
  const failedBidCount = parseFailedBidCount(bigItem.유찰횟수);

  // 첫 번째 아이템만 파싱 결과 로깅
  if (index === 0) {
    console.log('✅ 파싱 결과:', {
      청구금액원본: bigItem.청구금액,
      청구금액파싱: claimAmount,
      배당요구종기원본: bigItem.배당요구종기,
      배당요구종기결과: bigItem.배당요구종기 || undefined,
      유찰횟수원본: bigItem.유찰횟수,
      유찰횟수파싱: failedBidCount,
      비고원본: bigItem.비고,
      비고결과: bigItem.비고 || undefined,
    });
  }

  return {
    id,
    caseNumber: bigItem.사건번호,
    court: bigItem.법원,
    address: bigItem.소재지,
    appraisalPrice,
    minSalePrice,
    deposit,
    detailedAddress: bigItem.물건기본내역,
    bidStartDate: bigItem.매각기일, // 매각기일을 입찰 시작일로 사용
    dividendDeadline: bigItem.배당요구종기 || undefined,
    claimAmount: claimAmount,
    failedBidCount: failedBidCount,
    note: bigItem.비고 || undefined,
    status: 'active', // Big API는 진행 중인 물건만 제공
  };
}

// 1. 경매 정보 스크래핑
export async function scrapeAuctions(params: BigScrapeParams = {}): Promise<{
  items: AuctionItem[];
  total: number;
  page: number;
  courtName: string;
}> {
  // 간편한 파라미터를 Big API 형식으로 변환
  const apiParams: Record<string, string | number> = {};

  if (params.page !== undefined) {
    apiParams.target_page = params.page;
  } else if (params.target_page !== undefined) {
    apiParams.target_page = params.target_page;
  }

  if (params.court) {
    apiParams.search_court_name = params.court;
  } else if (params.search_court_name) {
    apiParams.search_court_name = params.search_court_name;
  }

  if (params.sido) {
    apiParams.search_address1_01 = params.sido;
  } else if (params.search_address1_01) {
    apiParams.search_address1_01 = params.search_address1_01;
  }

  if (params.gu) {
    apiParams.search_address1_02 = params.gu;
  } else if (params.search_address1_02) {
    apiParams.search_address1_02 = params.search_address1_02;
  }

  // 다른 파라미터들도 포함
  if (params.search_sno) apiParams.search_sno = params.search_sno;
  if (params.search_tno) apiParams.search_tno = params.search_tno;
  if (params.search_ipdate1) apiParams.search_ipdate1 = params.search_ipdate1;
  if (params.search_ipdate2) apiParams.search_ipdate2 = params.search_ipdate2;
  if (params.search_address1_03) apiParams.search_address1_03 = params.search_address1_03;
  if (params.search_eprice1) apiParams.search_eprice1 = params.search_eprice1;
  if (params.search_eprice2) apiParams.search_eprice2 = params.search_eprice2;
  if (params.search_mprice1) apiParams.search_mprice1 = params.search_mprice1;
  if (params.search_mprice2) apiParams.search_mprice2 = params.search_mprice2;

  const response = await fetchApi<BigScrapeResponse>('/scrape', apiParams);

  console.log('📡 /scrape API 응답:', response);
  console.log('📊 total_count:', response.total_count);
  console.log('📄 page:', response.page);
  console.log('📦 count:', response.count);

  const items = response.data.map((bigItem, index) =>
    convertBigItemToAuctionItem(bigItem, index)
  );

  // total_count가 없으면 추정치 사용 (백엔드 수정 전까지 임시 처리)
  const totalCount = response.total_count !== undefined
    ? response.total_count
    : (response.count === 20 ? response.page * 20 + 100 : (response.page - 1) * 20 + response.count);

  console.log('🎯 사용할 total:', totalCount);

  return {
    items,
    total: totalCount,
    page: response.page,
    courtName: response.court_name,
  };
}

// 2. 배치 스크래핑 (여러 페이지)
export async function scrapeBatchAuctions(params: BigBatchScrapeParams = {}): Promise<{
  items: AuctionItem[];
  total: number;
}> {
  const response = await fetchApi<BigBatchScrapeResponse>('/scrape/batch', params as Record<string, string | number>);

  console.log('🌐 API Raw Response:', response);
  console.log('📦 Raw data count:', response.data?.length);
  console.log('🔢 Total count:', response.total_count);

  const items = response.data.map((bigItem, index) =>
    convertBigItemToAuctionItem(bigItem, index)
  );

  return {
    items,
    total: response.total_count || items.length,  // total_count가 없으면 items 길이 사용
  };
}

// 3. 법원 목록 조회
export async function getCourts(): Promise<string[]> {
  const response = await fetchApi<BigCourtsResponse>('/courts');
  return response.courts;
}

// 4. 시/도 목록 조회
export async function getSidoList(): Promise<string[]> {
  const response = await fetchApi<BigSidoResponse>('/address/sido');
  return response.sido_list;
}

// 5. 구/군 목록 조회
export async function getGuList(sido?: string): Promise<string[]> {
  const params = sido ? { sido } : undefined;
  const response = await fetchApi<BigGuResponse>('/address/gu', params as Record<string, string>);
  return response.gu_list;
}

// 헬스 체크
export async function healthCheck(): Promise<{ status: string; message: string }> {
  return fetchApi('/');
}

// 6. 경매 물건 상세 정보 조회 (배당요구종기, 감정평가요항표)
export async function fetchAuctionDetail(params: DetailParams): Promise<DetailResponse> {
  const url = new URL('/api/detail', DETAIL_API_URL);

  // 파라미터 추가
  url.searchParams.append('case_no', params.case_no);
  if (params.si) url.searchParams.append('si', params.si);
  if (params.gu) url.searchParams.append('gu', params.gu);
  if (params.court_no) url.searchParams.append('court_no', params.court_no);
  if (params.obj_no) url.searchParams.append('obj_no', params.obj_no);

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, `Detail API 요청 실패: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `네트워크 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
}

// 감정평가요항표를 물건비고(note) 문자열로 변환 (권리관계 중심)
// 백엔드 키워드: 임차인, 대항력, 권리, 점유자, 유치권, 법정지상권, 가처분 등
export function appraisalSummaryToNote(summary: AppraisalSummary): string {
  const items: string[] = [];

  // 권리관계 관련 정보 (물건비고 스코어링에 사용)
  if (summary.other_reference_matters) {
    items.push(`[기타참고사항] ${summary.other_reference_matters}`);
  }
  if (summary.difference_from_public_records) {
    items.push(`[공부와의차이] ${summary.difference_from_public_records}`);
  }
  if (summary.land_use_plan_and_restrictions) {
    items.push(`[토지이용계획/제한상태] ${summary.land_use_plan_and_restrictions}`);
  }
  if (summary.usage_status) {
    items.push(`[이용상태] ${summary.usage_status}`);
  }

  return items.join(' | ');
}

// 감정평가요항표를 물건상태(propertyCondition) 문자열로 변환 (건물 상태 중심)
// 백엔드 키워드: 리모델링, 올수리, 신축, 양호, 보통, 누수, 균열, 곰팡이, 파손 등
export function appraisalSummaryToCondition(summary: AppraisalSummary): string {
  const items: string[] = [];

  // 건물 상태 관련 정보 (물건상태 스코어링에 사용)
  if (summary.building_structure) {
    items.push(`[건물구조] ${summary.building_structure}`);
  }
  if (summary.equipment_details) {
    items.push(`[설비내역] ${summary.equipment_details}`);
  }
  if (summary.usage_status) {
    items.push(`[이용상태] ${summary.usage_status}`);
  }
  if (summary.location_and_surroundings) {
    items.push(`[위치/주위환경] ${summary.location_and_surroundings}`);
  }

  return items.join(' | ');
}

export { ApiError };
