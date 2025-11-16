/**
 * 위험 요소 분석 관련 상수 및 타입 정의
 */

/**
 * 물건 상태 타입
 */
export type PropertyStatus = '관리 양호' | '일부 노후' | '심한 노후' | '폐가';

/**
 * 권리 분석 결과 타입
 */
export type RightAnalysisResult = '양호' | '보통' | '주의' | '위험';

export interface RiskAnalysisData {
  failedBidCount: number; // 유찰 횟수
  claimAmount: number; // 청구 금액
  claimAmountRatio: number; // 청구 금액 비율 (%)
  rightAnalysisResult: RightAnalysisResult; // 권리 분석 결과
  propertyStatus: PropertyStatus; // 물건 상태
  dividendDeadline: string; // 배당요구종기
}

/**
 * 청구 금액 비율 계산
 * @param claimAmount 청구 금액
 * @param minSalePrice 최저가
 * @returns 청구 금액 비율 (%)
 */
export const calculateClaimAmountRatio = (claimAmount: number, minSalePrice: number): number => {
  return Math.round((claimAmount / minSalePrice) * 100);
};

/**
 * 물건 상태가 양호한지 확인
 * @param status 물건 상태
 * @returns 양호 여부
 */
export const isPropertyStatusGood = (status: PropertyStatus): boolean => {
  return status === '관리 양호';
};

/**
 * 권리 분석 결과가 양호한지 확인
 * @param result 권리 분석 결과
 * @returns 양호 여부
 */
export const isRightAnalysisGood = (result: RightAnalysisResult): boolean => {
  return result === '양호';
};

