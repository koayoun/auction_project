import type { AnalysisRequest, AnalysisResult } from './types';
import type { AuctionItem } from '../../entities/auction';

// 개발: Vite 프록시 사용 (/api/analysis -> https://analysis.bdc105.kro.kr)
// 프로덕션: 환경변수로 직접 URL 설정
const ANALYSIS_API_URL = import.meta.env.VITE_ANALYSIS_API_URL || '/api/analysis';

// 에러 처리 유틸리티
class AnalysisApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'AnalysisApiError';
  }
}

// AuctionItem을 AnalysisRequest로 변환
function convertToAnalysisRequest(item: AuctionItem): AnalysisRequest {
  // 평수 계산 (물건기본내역에서 추출 시도, 없으면 0) - 정수로 반올림
  const extractPyeong = (detailedAddress?: string): number => {
    if (!detailedAddress) return 0;
    const match = detailedAddress.match(/(\d+(?:\.\d+)?)\s*평/);
    return match ? Math.round(parseFloat(match[1])) : 0;
  };

  return {
    감정가: item.appraisalPrice,
    최저가: item.minSalePrice,
    평: extractPyeong(item.detailedAddress),
    청구금액: item.claimAmount || 0,
    유찰횟수: item.failedBidCount || 0,
    소재지: item.address,
    배당요구종기: item.dividendDeadline || '',
    물건비고: item.note || '',
    물건상태: '', // 물건상태는 별도로 입력받아야 함
  };
}

// 경매 물건 분석 API 호출
export async function analyzeAuction(item: AuctionItem): Promise<AnalysisResult> {
  const requestData = convertToAnalysisRequest(item);

  try {
    const response = await fetch(`${ANALYSIS_API_URL}/analyze_auction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([requestData]),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new AnalysisApiError(response.status, `Analysis API 요청 실패: ${errorText}`);
    }

    const results: AnalysisResult[] = await response.json();

    if (results.length === 0) {
      throw new AnalysisApiError(500, '분석 결과가 없습니다.');
    }

    if (results[0].error) {
      throw new AnalysisApiError(500, '분석 중 오류가 발생했습니다.');
    }

    return results[0];
  } catch (error) {
    if (error instanceof AnalysisApiError) {
      throw error;
    }
    throw new AnalysisApiError(
      500,
      `네트워크 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
    );
  }
}

// 여러 경매 물건 분석 (배치)
export async function analyzeAuctionBatch(items: AuctionItem[]): Promise<AnalysisResult[]> {
  const requestData = items.map(convertToAnalysisRequest);

  try {
    const response = await fetch(`${ANALYSIS_API_URL}/analyze_auction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new AnalysisApiError(response.status, `Analysis API 요청 실패: ${errorText}`);
    }

    const results: AnalysisResult[] = await response.json();
    return results;
  } catch (error) {
    if (error instanceof AnalysisApiError) {
      throw error;
    }
    throw new AnalysisApiError(
      500,
      `네트워크 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
    );
  }
}

export { AnalysisApiError };
