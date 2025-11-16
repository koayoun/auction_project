/**
 * 가격 분석 관련 상수 및 타입 정의
 */

export interface PriceAnalysisData {
  appraisalPrice: number; // 감정가
  minSalePrice: number; // 최저가
  estimatedMarketPrice: number; // 추정 시세
  locationImportance: '높음' | '보통' | '낮음'; // 소재지 중요도
}

/**
 * 가격 포맷팅 함수
 * @param price 가격 (원 단위)
 * @returns 포맷팅된 가격 문자열
 */
export const formatPriceDetail = (price: number): string => {
  const billion = Math.floor(price / 100000000);
  const million = Math.floor((price % 100000000) / 10000);
  if (million === 0) {
    return `${billion}억원`;
  }
  return `${billion}억 ${million}만원`;
};

/**
 * 감정가 대비 비율 계산
 * @param minSalePrice 최저가
 * @param appraisalPrice 감정가
 * @returns 감정가 대비 비율 (%)
 */
export const calculateAppraisalRatio = (minSalePrice: number, appraisalPrice: number): number => {
  return Math.round((minSalePrice / appraisalPrice) * 100);
};

/**
 * 시세차익 계산
 * @param estimatedMarketPrice 추정 시세
 * @param minSalePrice 최저가
 * @returns 시세차익
 */
export const calculatePriceDifference = (estimatedMarketPrice: number, minSalePrice: number): number => {
  return estimatedMarketPrice - minSalePrice;
};

