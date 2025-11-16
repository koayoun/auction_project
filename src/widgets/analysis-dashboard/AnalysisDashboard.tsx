import { useState } from 'react';
import styled from 'styled-components';
import { 
  getScoreGradeAndComment,
  formatPriceDetail,
  calculateAppraisalRatio,
  calculatePriceDifference,
  calculateClaimAmountRatio,
  isPropertyStatusGood,
  isRightAnalysisGood,
  type PropertyStatus,
  type RightAnalysisResult
} from '../../shared/constants';

const Container = styled.div`
  background: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 12px;
  overflow: hidden;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #333333;
  background: #0a0a0a;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 1rem 1.5rem;
  background: ${props => props.$active ? '#1a1a1a' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${props => props.$active ? '#1890ff' : 'transparent'};
  color: ${props => props.$active ? '#ffffff' : '#999999'};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    background: #1a1a1a;
  }
`;

const TabContent = styled.div`
  padding: 2rem;
`;

const ScoresRow = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const TotalScoreCard = styled.div`
  background: #0a0a0a;
  border: 2px solid #1890ff;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  flex: 0.5;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
`;

const TotalScoreLabel = styled.div`
  font-size: 18px;
  color: #999999;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const TotalScoreValue = styled.div`
  font-size: 80px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 0.5rem;
  line-height: 1;
`;

const TotalScoreSubtext = styled.div`
  font-size: 20px;
  color: #52c41a;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const TotalScoreComment = styled.div`
  font-size: 14px;
  color: #cccccc;
  font-weight: 400;
  line-height: 1.5;
  margin-top: 0.5rem;
`;

const SummaryGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  flex: 1;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const SummaryCard = styled.div`
  background: #0a0a0a;
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 1.5rem;
  flex: 1;
`;

const SummaryTitle = styled.div`
  font-size: 14px;
  color: #999999;
  margin-bottom: 0.75rem;
`;

const SummaryValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const SummarySubtext = styled.div`
  font-size: 13px;
  color: #666666;
`;

const SummaryBoxesRow = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SummaryBox = styled.div`
  background: #0a0a0a;
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 1.5rem;
  flex: 1;
`;

const SummaryBoxTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 1rem 0;
`;

const SummaryBoxContent = styled.div`
  color: #cccccc;
  font-size: 14px;
  line-height: 1.6;
`;

const AnalysisCard = styled.div`
  background: #0a0a0a;
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
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
  gap: 2rem;

  &:last-child {
    border-bottom: none;
  }
`;

const DataLabel = styled.span`
  font-size: 14px;
  color: #999999;
  flex: 1;
  min-width: 200px;
`;

const DataValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  flex-shrink: 0;
  min-width: 200px;
  text-align: right;
`;

const HighlightValue = styled.span<{ $positive?: boolean }>`
  color: ${props => props.$positive ? '#52c41a' : '#f5222d'};
  font-weight: 700;
`;

const ScoreBadge = styled.div<{ $score: number }>`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 700;
  background: ${props => {
    if (props.$score >= 80) return '#52c41a22';
    if (props.$score >= 60) return '#faad1422';
    return '#f5222d22';
  }};
  color: ${props => {
    if (props.$score >= 80) return '#52c41a';
    if (props.$score >= 60) return '#faad14';
    return '#f5222d';
  }};
`;

const AIAnalysisSection = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 1px solid #0f3460;
  border-radius: 12px;
  padding: 2rem;
`;

const AITitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AIContent = styled.div`
  color: #e0e0e0;
  line-height: 1.8;
  font-size: 15px;
`;

const AISection = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const AISectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #64b5f6;
  margin: 0 0 0.75rem 0;
`;

const AIText = styled.p`
  margin: 0 0 0.5rem 0;
  color: #cccccc;
`;

const ChartContainer = styled.div`
  background: #0a0a0a;
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 2rem 0;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 2rem 0;
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const PriceDetailTable = styled.div`
  background: #0a0a0a;
  border: 1px solid #333333;
  border-radius: 12px;
  overflow: hidden;
`;

const PriceDetailRow = styled.div<{ $header?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border-bottom: 1px solid #333333;
  background: ${props => props.$header ? '#1a1a1a' : 'transparent'};

  &:last-child {
    border-bottom: none;
  }
`;

const PriceDetailCell = styled.div<{ $header?: boolean; $align?: string }>`
  padding: 1rem 1.5rem;
  font-size: ${props => props.$header ? '14px' : '15px'};
  font-weight: ${props => props.$header ? '600' : '500'};
  color: ${props => props.$header ? '#999999' : '#ffffff'};
  border-right: 1px solid #333333;
  text-align: ${props => props.$align || 'left'};

  &:last-child {
    border-right: none;
  }
`;

const BarChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BarLabel = styled.div`
  min-width: 100px;
  font-size: 14px;
  color: #999999;
  font-weight: 500;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 40px;
  background: #1a1a1a;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
`;

const BarFill = styled.div<{ $width: number; $color: string }>`
  height: 100%;
  width: ${props => props.$width}%;
  background: ${props => props.$color};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 1rem;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  transition: width 0.5s ease;
`;

const PriceTable = styled.div`
  background: #0a0a0a;
  border: 1px solid #333333;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2rem;
`;

const TableRow = styled.div<{ $header?: boolean; $columns?: string }>`
  display: grid;
  grid-template-columns: ${props => props.$columns || '200px 1fr'};
  border-bottom: 1px solid #333333;
  
  &:last-child {
    border-bottom: none;
  }

  background: ${props => props.$header ? '#1a1a1a' : 'transparent'};
`;

const TableCell = styled.div<{ $header?: boolean; $align?: string }>`
  padding: 1.25rem 1.5rem;
  font-size: ${props => props.$header ? '14px' : '16px'};
  font-weight: ${props => props.$header ? '600' : '500'};
  color: ${props => props.$header ? '#999999' : '#ffffff'};
  border-right: ${props => props.$header ? 'none' : '1px solid #333333'};
  text-align: ${props => props.$align || 'left'};

  &:last-child {
    border-right: none;
  }
`;

type TabType = '종합' | '가격분석' | '위험분석';

export const AnalysisDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('종합');

  const renderOverview = () => {
    // 점수 계산 (실제 점수)
    const PRICE_MAX_SCORE = 40; // 가격 매력도 만점
    const RISK_MAX_SCORE = 60; // 권리 위험도 만점
    
    const priceActualScore = 34; // 가격 매력도 실제 점수 (40점 만점)
    const riskActualScore = 49; // 권리 위험도 실제 점수 (60점 만점)
    
    // 100점 기준으로 환산된 점수
    const priceConvertedScore = Math.round((priceActualScore / PRICE_MAX_SCORE) * 100);
    const riskConvertedScore = Math.round((riskActualScore / RISK_MAX_SCORE) * 100);
    
    // 종합 투자 점수 (실제 점수 합계)
    const totalScore = priceActualScore + riskActualScore;

    // 가격 데이터
    const appraisalPrice = 850000000; // 감정가
    const minSalePrice = 680000000; // 최저가
    const estimatedMarketPrice = 950000000; // 추정 시세
    const locationImportance: '높음' | '보통' | '낮음' = '높음'; // 소재지 중요도
    
    // 가격 분석 계산
    const appraisalRatio = calculateAppraisalRatio(minSalePrice, appraisalPrice);
    const priceDifference = calculatePriceDifference(estimatedMarketPrice, minSalePrice);

    // 위험 요소 데이터
    const failedBidCount = 0; // 유찰 횟수
    const claimAmount = 120000000; // 청구 금액
    const claimAmountRatio = calculateClaimAmountRatio(claimAmount, minSalePrice);
    const rightAnalysisResult: RightAnalysisResult = '양호'; // 권리 분석 결과
    const propertyStatus: PropertyStatus = '관리 양호'; // 물건 상태
    const dividendDeadline = '2025-03-15'; // 배당요구종기

    // 등급과 코멘트 계산
    const { grade, comment } = getScoreGradeAndComment(totalScore);

    return (
      <TabContent>
        {/* 세 점수 한 줄 배치 */}
        <ScoresRow>
          {/* 종합 점수 */}
          <TotalScoreCard>
            <TotalScoreLabel>AI 종합 투자 점수</TotalScoreLabel>
            <TotalScoreValue>{totalScore}점</TotalScoreValue>
            <TotalScoreSubtext>{grade}</TotalScoreSubtext>
            <TotalScoreComment>{comment}</TotalScoreComment>
          </TotalScoreCard>

          {/* 주요 지표 요약 */}
          <SummaryGrid>
            <SummaryCard>
              <SummaryTitle>가격 매력 (40점)</SummaryTitle>
              <SummaryValue>
                <ScoreBadge $score={priceConvertedScore}>{priceConvertedScore}점</ScoreBadge>
              </SummaryValue>
              <SummarySubtext>({priceActualScore}/{PRICE_MAX_SCORE})</SummarySubtext>
            </SummaryCard>

            <SummaryCard>
              <SummaryTitle>권리 위험도 (60점)</SummaryTitle>
              <SummaryValue>
                <ScoreBadge $score={riskConvertedScore}>{riskConvertedScore}점</ScoreBadge>
              </SummaryValue>
              <SummarySubtext>({riskActualScore}/{RISK_MAX_SCORE})</SummarySubtext>
            </SummaryCard>
          </SummaryGrid>
        </ScoresRow>

        {/* 가격분석요약 및 주요위험요소 */}
        <SummaryBoxesRow>
          <SummaryBox>
            <SummaryBoxTitle>가격분석요약</SummaryBoxTitle>
            <SummaryBoxContent>
              <DataRow>
                <DataLabel>감정가</DataLabel>
                <DataValue>{formatPriceDetail(appraisalPrice)}</DataValue>
              </DataRow>
              <DataRow>
                <DataLabel>최저가</DataLabel>
                <DataValue>{formatPriceDetail(minSalePrice)}</DataValue>
              </DataRow>
              <DataRow>
                <DataLabel>감정가 대비</DataLabel>
                <DataValue>{appraisalRatio}%</DataValue>
              </DataRow>
              <DataRow>
                <DataLabel>추정 시세</DataLabel>
                <DataValue>{formatPriceDetail(estimatedMarketPrice)}</DataValue>
              </DataRow>
              <DataRow>
                <DataLabel>시세차익(예상)</DataLabel>
                <DataValue>
                  <HighlightValue $positive={true}>
                    +{formatPriceDetail(priceDifference)}
                  </HighlightValue>
                </DataValue>
              </DataRow>
              <DataRow>
                <DataLabel>소재지 중요도</DataLabel>
                <DataValue>{locationImportance}</DataValue>
              </DataRow>
            </SummaryBoxContent>
          </SummaryBox>

          <SummaryBox>
            <SummaryBoxTitle>주요위험요소</SummaryBoxTitle>
            <SummaryBoxContent>
              <DataRow>
                <DataLabel>유찰 횟수</DataLabel>
                <DataValue>{failedBidCount}회</DataValue>
              </DataRow>
              <DataRow>
                <DataLabel>청구 금액 비율</DataLabel>
                <DataValue>{claimAmountRatio}%</DataValue>
              </DataRow>
              <DataRow>
                <DataLabel>권리 분석 결과</DataLabel>
                <DataValue>
                  <HighlightValue $positive={isRightAnalysisGood(rightAnalysisResult)}>
                    {rightAnalysisResult}
                  </HighlightValue>
                </DataValue>
              </DataRow>
              <DataRow>
                <DataLabel>물건 상태</DataLabel>
                <DataValue>
                  <HighlightValue $positive={isPropertyStatusGood(propertyStatus)}>
                    {propertyStatus}
                  </HighlightValue>
                </DataValue>
              </DataRow>
              <DataRow>
                <DataLabel>배당요구종기</DataLabel>
                <DataValue>{dividendDeadline}</DataValue>
              </DataRow>
            </SummaryBoxContent>
          </SummaryBox>
        </SummaryBoxesRow>

      {/* AI 종합 분석 */}
      <AIAnalysisSection>
        <AITitle>
          🤖 AI 종합 분석
        </AITitle>
        <AIContent>
          <AISection>
            <AISectionTitle>📊 투자 가치 평가</AISectionTitle>
            <AIText>
              본 물건은 <strong style={{ color: '#52c41a' }}>감정가 대비 20% 낮은 최저 매각가</strong>로 시작하며, 
              주변 실거래가를 분석한 결과 약 <strong style={{ color: '#52c41a' }}>9억 5천만원 수준</strong>의 
              시장가치를 가지고 있는 것으로 평가됩니다. 이는 약 <strong style={{ color: '#52c41a' }}>40%의 잠재 수익률</strong>을 
              의미합니다.
            </AIText>
          </AISection>

          <AISection>
            <AISectionTitle>⚠️ 리스크 분석</AISectionTitle>
            <AIText>
              현재 <strong style={{ color: '#faad14' }}>임차인 1명이 거주 중</strong>이며 보증금은 5천만원입니다. 
              근저당권 및 전세권 설정이 없어 권리관계가 단순한 편입니다. 
              다만 임차인 문제 해결에 <strong style={{ color: '#faad14' }}>3~6개월 정도 소요</strong>될 수 있습니다.
            </AIText>
          </AISection>

          <AISection>
            <AISectionTitle>📍 입지 분석</AISectionTitle>
            <AIText>
              역삼역 도보 5분 거리로 <strong style={{ color: '#52c41a' }}>교통 접근성이 뛰어나며</strong>, 
              강남구 테헤란로에 위치하여 업무/상업 환경이 우수합니다. 
              초등학교 및 편의시설도 가까워 <strong style={{ color: '#52c41a' }}>실거주 및 임대 수요가 높은 지역</strong>입니다.
            </AIText>
          </AISection>

          <AISection>
            <AISectionTitle>✅ 종합 의견</AISectionTitle>
            <AIText style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
              투자 매력도: <HighlightValue $positive={true}>★★★★★ (5/5)</HighlightValue>
            </AIText>
            <AIText>
              입지가 우수하고 가격 경쟁력이 높아 <strong style={{ color: '#52c41a' }}>적극 추천</strong>합니다. 
              임차인 문제만 원만히 해결한다면 안정적인 수익을 기대할 수 있습니다. 
              유찰 이력이 없어 경쟁이 있을 것으로 예상되니 충분한 보증금 준비가 필요합니다.
            </AIText>
          </AISection>
        </AIContent>
      </AIAnalysisSection>
      </TabContent>
    );
  };

  const renderPriceAnalysis = () => {
    // 가격 데이터
    const appraisalPrice = 850000000; // 감정가
    const marketPrice = 950000000; // 주변시세
    const minSalePrice = 680000000; // 최저가
    const priceActualScore = 34; // 가격 매력도 실제 점수 (40점 만점)
    const locationImportance: '높음' | '보통' | '낮음' = '높음'; // 소재지 중요도

    // 할인율 계산
    const appraisalDiscountRate = Math.round(((appraisalPrice - minSalePrice) / appraisalPrice) * 100);
    const marketDiscountRate = Math.round(((marketPrice - minSalePrice) / marketPrice) * 100);

    // 가격 상세정보 점수 계산 (예시)
    const itemScore = 10; // 항목 배점 득점 (예시)

    return (
      <TabContent>
        <SectionTitle>세부 가격분석(점수 : {priceActualScore}/40)</SectionTitle>

        <TwoColumnLayout>
          {/* 왼쪽: 시세 및 최저가 추이 */}
          <div>
            <CardTitle style={{ marginBottom: '1rem' }}>시세 및 최저가 추이</CardTitle>
            {/* 빈 공간 */}
          </div>

          {/* 오른쪽: 가격 상세정보 */}
          <div>
            <CardTitle style={{ marginBottom: '1rem' }}>가격 상세 정보</CardTitle>
            <div style={{ marginBottom: '1rem' }}>
              <DataRow>
                <DataLabel>감정가</DataLabel>
                <DataValue>{formatPriceDetail(appraisalPrice)}</DataValue>
              </DataRow>
              <DataRow>
                <DataLabel>최저가</DataLabel>
                <DataValue>{formatPriceDetail(minSalePrice)}</DataValue>
              </DataRow>
            </div>
            <div>
              <DataRow style={{ paddingBottom: '0.5rem' }}>
                <DataLabel style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>항목</DataLabel>
                <DataValue style={{ display: 'flex', gap: '4rem', minWidth: '200px', justifyContent: 'flex-end' }}>
                  <span style={{ textAlign: 'center', flex: '0 0 60px' }}>배점</span>
                  <span style={{ textAlign: 'center', flex: '0 0 60px' }}>득점</span>
                </DataValue>
              </DataRow>
              <DataRow>
                <DataLabel>감정가대비할인율</DataLabel>
                <DataValue style={{ display: 'flex', gap: '4rem', minWidth: '200px', justifyContent: 'flex-end' }}>
                  <span style={{ textAlign: 'center', flex: '0 0 60px' }}>15</span>
                  <span style={{ textAlign: 'center', flex: '0 0 60px' }}>-</span>
                </DataValue>
              </DataRow>
              <DataRow>
                <DataLabel>시세대비할인율</DataLabel>
                <DataValue style={{ display: 'flex', gap: '4rem', minWidth: '200px', justifyContent: 'flex-end' }}>
                  <span style={{ textAlign: 'center', flex: '0 0 60px' }}>15</span>
                  <span style={{ textAlign: 'center', flex: '0 0 60px' }}>-</span>
                </DataValue>
              </DataRow>
              <DataRow>
                <DataLabel>소재지 중요도</DataLabel>
                <DataValue style={{ display: 'flex', gap: '4rem', minWidth: '200px', justifyContent: 'flex-end' }}>
                  <span style={{ textAlign: 'center', flex: '0 0 60px' }}>10</span>
                  <span style={{ textAlign: 'center', flex: '0 0 60px' }}>-</span>
                </DataValue>
              </DataRow>
              <DataRow>
                <DataLabel style={{ fontWeight: '700', color: '#ffffff' }}>합계</DataLabel>
                <DataValue style={{ display: 'flex', gap: '4rem', minWidth: '200px', justifyContent: 'flex-end', fontWeight: '700', color: '#1890ff' }}>
                  <span style={{ textAlign: 'center', flex: '0 0 60px' }}>40</span>
                  <span style={{ textAlign: 'center', flex: '0 0 60px' }}>{priceActualScore}</span>
                </DataValue>
              </DataRow>
            </div>
          </div>
        </TwoColumnLayout>

        {/* 종합평가 */}
        <AnalysisCard style={{ marginTop: '2rem' }}>
          <CardTitle>종합평가</CardTitle>
          <CardContent>
            {/* 종합평가 내용 */}
          </CardContent>
        </AnalysisCard>
      </TabContent>
    );
  };

  const renderRiskAnalysis = () => {
    // 위험 분석 점수
    const RISK_MAX_SCORE = 60; // 권리 위험도 만점
    const riskActualScore = 49; // 권리 위험도 실제 점수 (60점 만점)

    // 위험 분석 데이터
    const claimAmount = 120000000; // 청구 금액
    const minSalePrice = 680000000; // 최저가
    const claimAmountRatio = calculateClaimAmountRatio(claimAmount, minSalePrice);
    const failedBidCount = 0; // 유찰 횟수
    const propertyNoteScore = 8; // 물건비고 스코어링 (예시)
    const propertyStatus: PropertyStatus = '관리 양호'; // 물건 상태
    const dividendDeadline = '2025-03-15'; // 배당요구종기

    return (
      <TabContent>
        <SectionTitle>세부 위험분석 (점수: {riskActualScore}/60)</SectionTitle>
        
        <CardTitle style={{ marginBottom: '1rem' }}>권리 및 상태 상세 정보</CardTitle>
        
        <div>
          {/* 헤더 */}
          <DataRow style={{ paddingBottom: '0.5rem', fontWeight: '600', color: '#ffffff' }}>
            <DataLabel style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', flex: '0 0 120px' }}>항목</DataLabel>
            <DataValue style={{ display: 'flex', gap: '2rem', minWidth: '400px', justifyContent: 'flex-start', textAlign: 'left' }}>
              <span style={{ flex: '0 0 100px' }}>데이터</span>
              <span style={{ flex: '0 0 80px' }}>평가</span>
              <span style={{ flex: '0 0 100px', textAlign: 'center' }}>점수(배점)</span>
              <span style={{ flex: '1' }}>분석</span>
            </DataValue>
          </DataRow>

          {/* 청구금액 비율 */}
          <DataRow>
            <DataLabel style={{ flex: '0 0 120px' }}>청구금액 비율</DataLabel>
            <DataValue style={{ display: 'flex', gap: '2rem', minWidth: '400px', justifyContent: 'flex-start', textAlign: 'left' }}>
              <span style={{ flex: '0 0 100px' }}>{claimAmountRatio}%</span>
              <span style={{ flex: '0 0 80px' }}>-</span>
              <span style={{ flex: '0 0 100px', textAlign: 'center' }}>-</span>
              <span style={{ flex: '1' }}>-</span>
            </DataValue>
          </DataRow>

          {/* 유찰 횟수 */}
          <DataRow>
            <DataLabel style={{ flex: '0 0 120px' }}>유찰 횟수</DataLabel>
            <DataValue style={{ display: 'flex', gap: '2rem', minWidth: '400px', justifyContent: 'flex-start', textAlign: 'left' }}>
              <span style={{ flex: '0 0 100px' }}>{failedBidCount}회</span>
              <span style={{ flex: '0 0 80px' }}>-</span>
              <span style={{ flex: '0 0 100px', textAlign: 'center' }}>-</span>
              <span style={{ flex: '1' }}>-</span>
            </DataValue>
          </DataRow>

          {/* 물건비고 스코어링 */}
          <DataRow>
            <DataLabel style={{ flex: '0 0 120px' }}>물건비고 스코어링</DataLabel>
            <DataValue style={{ display: 'flex', gap: '2rem', minWidth: '400px', justifyContent: 'flex-start', textAlign: 'left' }}>
              <span style={{ flex: '0 0 100px' }}>{propertyNoteScore}점</span>
              <span style={{ flex: '0 0 80px' }}>-</span>
              <span style={{ flex: '0 0 100px', textAlign: 'center' }}>-</span>
              <span style={{ flex: '1' }}>-</span>
            </DataValue>
          </DataRow>

          {/* 물건 상태 */}
          <DataRow>
            <DataLabel style={{ flex: '0 0 120px' }}>물건 상태</DataLabel>
            <DataValue style={{ display: 'flex', gap: '2rem', minWidth: '400px', justifyContent: 'flex-start', textAlign: 'left' }}>
              <span style={{ flex: '0 0 100px' }}>{propertyStatus}</span>
              <span style={{ flex: '0 0 80px' }}>-</span>
              <span style={{ flex: '0 0 100px', textAlign: 'center' }}>-</span>
              <span style={{ flex: '1' }}>-</span>
            </DataValue>
          </DataRow>

          {/* 배당요구종기 */}
          <DataRow>
            <DataLabel style={{ flex: '0 0 120px' }}>배당요구종기</DataLabel>
            <DataValue style={{ display: 'flex', gap: '2rem', minWidth: '400px', justifyContent: 'flex-start', textAlign: 'left' }}>
              <span style={{ flex: '0 0 100px' }}>{dividendDeadline}</span>
              <span style={{ flex: '0 0 80px' }}>-</span>
              <span style={{ flex: '0 0 100px', textAlign: 'center' }}>-</span>
              <span style={{ flex: '1' }}>-</span>
            </DataValue>
          </DataRow>
        </div>
      </TabContent>
    );
  };

  return (
    <Container>
      <TabContainer>
        <Tab 
          $active={activeTab === '종합'} 
          onClick={() => setActiveTab('종합')}
        >
          종합
        </Tab>
        <Tab 
          $active={activeTab === '가격분석'} 
          onClick={() => setActiveTab('가격분석')}
        >
          가격분석
        </Tab>
        <Tab 
          $active={activeTab === '위험분석'} 
          onClick={() => setActiveTab('위험분석')}
        >
          위험분석
        </Tab>
      </TabContainer>

      {activeTab === '종합' && renderOverview()}
      {activeTab === '가격분석' && renderPriceAnalysis()}
      {activeTab === '위험분석' && renderRiskAnalysis()}
    </Container>
  );
};

