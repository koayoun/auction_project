import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const AnalysisCard = styled.div`
  background: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardContent = styled.div`
  color: #cccccc;
  line-height: 1.6;
`;

const DataRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #333333;

  &:last-child {
    border-bottom: none;
  }
`;

const DataLabel = styled.span`
  font-size: 14px;
  color: #999999;
`;

const DataValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
`;

const PlaceholderText = styled.p`
  color: #666666;
  text-align: center;
  padding: 2rem 1rem;
  font-size: 14px;
`;

const HighlightValue = styled.span<{ $positive?: boolean }>`
  color: ${props => props.$positive ? '#52c41a' : '#f5222d'};
  font-weight: 700;
`;

export const AnalysisDashboard = () => {
  return (
    <Container>
      {/* 실거래가 분석 */}
      <AnalysisCard>
        <CardTitle>
          💰 실거래가 분석
        </CardTitle>
        <CardContent>
          <DataRow>
            <DataLabel>평균 실거래가</DataLabel>
            <DataValue>950,000,000원</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>최근 6개월 평균</DataLabel>
            <DataValue>920,000,000원</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>감정가 대비</DataLabel>
            <DataValue>
              <HighlightValue $positive={true}>+11.8%</HighlightValue>
            </DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>거래 건수 (1년)</DataLabel>
            <DataValue>23건</DataValue>
          </DataRow>
        </CardContent>
      </AnalysisCard>

      {/* 위치 분석 */}
      <AnalysisCard>
        <CardTitle>
          📍 위치 분석
        </CardTitle>
        <CardContent>
          <DataRow>
            <DataLabel>지하철역</DataLabel>
            <DataValue>역삼역 도보 5분</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>초등학교</DataLabel>
            <DataValue>역삼초 도보 7분</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>대형마트</DataLabel>
            <DataValue>이마트 도보 10분</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>주변 시세</DataLabel>
            <DataValue>평균 수준</DataValue>
          </DataRow>
        </CardContent>
      </AnalysisCard>

      {/* 투자수익률 분석 */}
      <AnalysisCard>
        <CardTitle>
          📊 투자수익률 분석
        </CardTitle>
        <CardContent>
          <DataRow>
            <DataLabel>예상 매각가</DataLabel>
            <DataValue>950,000,000원</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>투자 수익률</DataLabel>
            <DataValue>
              <HighlightValue $positive={true}>+39.7%</HighlightValue>
            </DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>예상 수익</DataLabel>
            <DataValue>
              <HighlightValue $positive={true}>+270,000,000원</HighlightValue>
            </DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>투자 위험도</DataLabel>
            <DataValue>낮음</DataValue>
          </DataRow>
        </CardContent>
      </AnalysisCard>

      {/* 권리분석 */}
      <AnalysisCard>
        <CardTitle>
          ⚖️ 권리분석
        </CardTitle>
        <CardContent>
          <DataRow>
            <DataLabel>근저당권</DataLabel>
            <DataValue>없음</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>전세권</DataLabel>
            <DataValue>없음</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>임차인</DataLabel>
            <DataValue>1명 (보증금 50,000,000원)</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>유치권</DataLabel>
            <DataValue>없음</DataValue>
          </DataRow>
        </CardContent>
      </AnalysisCard>

      {/* 입찰 이력 */}
      <AnalysisCard>
        <CardTitle>
          📝 입찰 이력
        </CardTitle>
        <CardContent>
          <DataRow>
            <DataLabel>진행 회차</DataLabel>
            <DataValue>1회차</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>이전 유찰 횟수</DataLabel>
            <DataValue>0회</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>예상 경쟁률</DataLabel>
            <DataValue>높음</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>낙찰 확률</DataLabel>
            <DataValue>
              <HighlightValue $positive={false}>중간</HighlightValue>
            </DataValue>
          </DataRow>
        </CardContent>
      </AnalysisCard>

      {/* AI 추천 */}
      <AnalysisCard>
        <CardTitle>
          🤖 AI 종합 평가
        </CardTitle>
        <CardContent>
          <DataRow>
            <DataLabel>투자 매력도</DataLabel>
            <DataValue>
              <HighlightValue $positive={true}>⭐⭐⭐⭐⭐</HighlightValue>
            </DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>리스크 레벨</DataLabel>
            <DataValue>낮음 (Level 2)</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>추천도</DataLabel>
            <DataValue>
              <HighlightValue $positive={true}>적극 추천</HighlightValue>
            </DataValue>
          </DataRow>
          <PlaceholderText>
            💡 입지가 우수하고 권리관계가 단순하여 안전한 투자가 가능합니다.
            최근 실거래가 대비 감정가가 낮아 수익성이 높을 것으로 예상됩니다.
          </PlaceholderText>
        </CardContent>
      </AnalysisCard>
    </Container>
  );
};

