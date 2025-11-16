export interface ScoreGradeInfo {
  grade: string;
  comment: string;
}

/**
 * 종합 투자 점수에 따른 등급과 코멘트를 반환합니다.
 * @param score 종합 투자 점수 (0-100)
 * @returns 등급과 코멘트 정보
 */
export const getScoreGradeAndComment = (score: number): ScoreGradeInfo => {
  if (score >= 90) {
    return {
      grade: '(최우량물건)',
      comment: '안정성과 수익성이 모두 뛰어남'
    };
  } else if (score >= 80) {
    return {
      grade: '(우량물건)',
      comment: '안정적이며 메리트 충분'
    };
  } else if (score >= 70) {
    return {
      grade: '(입찰검토가치 있음)',
      comment: '메리트 있으나 주의 필요'
    };
  } else if (score >= 60) {
    return {
      grade: '(조건부 검토물건)',
      comment: '일부 조건 괜찮지만 리스크 동반'
    };
  } else {
    return {
      grade: '(고위험/비추천 물건)',
      comment: '낙찰 후 분쟁·손실 위험 높음'
    };
  }
};

