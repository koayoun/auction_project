// 숫자를 천단위 콤마로 포맷팅
export const formatNumber = (num: number): string => {
  return num.toLocaleString('ko-KR');
};

// 금액 포맷팅 (원 단위)
export const formatPrice = (price: number): string => {
  return `${formatNumber(price)}원`;
};

// 면적 포맷팅
export const formatArea = (area: number): string => {
  return `${area.toFixed(1)}m²`;
};

// 날짜 포맷팅 (YYYY-MM-DD)
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

// 날짜 범위 포맷팅
export const formatDateRange = (start: string, end: string): string => {
  return `${formatDate(start)} ~ ${formatDate(end)}`;
};

