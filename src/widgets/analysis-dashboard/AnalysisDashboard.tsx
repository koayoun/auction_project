import { useState } from 'react';
import styled from 'styled-components';

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

const TotalScoreCard = styled.div`
  background: #0a0a0a;
  border: 2px solid #333333;
  border-radius: 12px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const TotalScoreLabel = styled.div`
  font-size: 16px;
  color: #999999;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const TotalScoreValue = styled.div`
  font-size: 64px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
  line-height: 1;
`;

const TotalScoreSubtext = styled.div`
  font-size: 18px;
  color: #52c41a;
  font-weight: 600;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  background: #0a0a0a;
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 1.5rem;
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

type TabType = '종합' | '가격분석' | '위험분석' | '위치정보';

export const AnalysisDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('종합');

  const renderOverview = () => {
    // 점수 계산
    const priceScore = 85;
    const riskScore = 82;
    const locationScore = 92;
    const totalScore = Math.round((priceScore + riskScore + locationScore) / 3);

    return (
      <TabContent>
        {/* 종합 점수 */}
        <TotalScoreCard>
          <TotalScoreLabel>AI 종합 투자 점수</TotalScoreLabel>
          <TotalScoreValue>{totalScore}점</TotalScoreValue>
          <TotalScoreSubtext>
            {totalScore >= 85 ? '매우 우수' : totalScore >= 70 ? '우수' : totalScore >= 60 ? '보통' : '낮음'}
          </TotalScoreSubtext>
        </TotalScoreCard>

        {/* 주요 지표 요약 */}
        <SummaryGrid>
          <SummaryCard>
            <SummaryTitle>가격 경쟁력</SummaryTitle>
            <SummaryValue>
              <ScoreBadge $score={priceScore}>{priceScore}점</ScoreBadge>
            </SummaryValue>
            <SummarySubtext>시세 대비 매우 우수</SummarySubtext>
          </SummaryCard>

          <SummaryCard>
            <SummaryTitle>위험도 점수</SummaryTitle>
            <SummaryValue>
              <ScoreBadge $score={riskScore}>{riskScore}점</ScoreBadge>
            </SummaryValue>
            <SummarySubtext>권리관계 단순</SummarySubtext>
          </SummaryCard>

          <SummaryCard>
            <SummaryTitle>입지 점수</SummaryTitle>
            <SummaryValue>
              <ScoreBadge $score={locationScore}>{locationScore}점</ScoreBadge>
            </SummaryValue>
            <SummarySubtext>교통/편의시설 우수</SummarySubtext>
          </SummaryCard>
        </SummaryGrid>

      {/* 투자 수익성 분석 */}
      <AnalysisCard>
        <CardTitle>투자 수익성</CardTitle>
        <CardContent>
          <DataRow>
            <DataLabel>예상 낙찰가</DataLabel>
            <DataValue>680,000,000원</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>예상 시장가</DataLabel>
            <DataValue>950,000,000원</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>예상 수익률</DataLabel>
            <DataValue>
              <HighlightValue $positive={true}>+39.7%</HighlightValue>
            </DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>예상 수익금</DataLabel>
            <DataValue>
              <HighlightValue $positive={true}>+270,000,000원</HighlightValue>
            </DataValue>
          </DataRow>
        </CardContent>
      </AnalysisCard>

      {/* 주요 위험 요소 */}
      <AnalysisCard>
        <CardTitle>주요 위험 요소</CardTitle>
        <CardContent>
          <DataRow>
            <DataLabel>임차인</DataLabel>
            <DataValue>1명 거주 중</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>보증금</DataLabel>
            <DataValue>50,000,000원</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>근저당/전세권</DataLabel>
            <DataValue>
              <HighlightValue $positive={true}>없음</HighlightValue>
            </DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>권리분석 결과</DataLabel>
            <DataValue>
              <HighlightValue $positive={true}>양호</HighlightValue>
            </DataValue>
          </DataRow>
        </CardContent>
      </AnalysisCard>

      {/* 입지 정보 요약 */}
      <AnalysisCard>
        <CardTitle>입지 정보 요약</CardTitle>
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
            <DataLabel>편의시설</DataLabel>
            <DataValue>이마트 도보 10분</DataValue>
          </DataRow>
          <DataRow>
            <DataLabel>주변 시세</DataLabel>
            <DataValue>평균 이상</DataValue>
          </DataRow>
        </CardContent>
      </AnalysisCard>

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
    const area = 84.5; // 면적 (평수로 계산용)

    // 최대값 기준으로 퍼센트 계산
    const maxPrice = Math.max(appraisalPrice, marketPrice, minSalePrice);
    const appraisalPercent = (appraisalPrice / maxPrice) * 100;
    const marketPercent = (marketPrice / maxPrice) * 100;
    const minSalePercent = (minSalePrice / maxPrice) * 100;

    // 할인율 계산
    const discountRate = ((marketPrice - minSalePrice) / marketPrice * 100).toFixed(1);
    
    // 평당 가격 계산 (1평 = 3.3058㎡)
    const pyeong = area / 3.3058;
    const pricePerPyeong = Math.round(minSalePrice / pyeong);

    const formatPrice = (price: number) => {
      return `${(price / 100000000).toFixed(1)}억원`;
    };

    const formatPriceDetail = (price: number) => {
      const billion = Math.floor(price / 100000000);
      const million = Math.floor((price % 100000000) / 10000);
      if (million === 0) {
        return `${billion}억원`;
      }
      return `${billion}억 ${million}만원`;
    };

    return (
      <TabContent>
        {/* 가격 비교 차트 */}
        <ChartContainer>
          <ChartTitle>가격 비교</ChartTitle>
          <BarChart>
            <BarRow>
              <BarLabel>주변시세</BarLabel>
              <BarTrack>
                <BarFill $width={marketPercent} $color="#52c41a">
                  {formatPrice(marketPrice)}
                </BarFill>
              </BarTrack>
            </BarRow>

            <BarRow>
              <BarLabel>감정가</BarLabel>
              <BarTrack>
                <BarFill $width={appraisalPercent} $color="#1890ff">
                  {formatPrice(appraisalPrice)}
                </BarFill>
              </BarTrack>
            </BarRow>

            <BarRow>
              <BarLabel>최저가</BarLabel>
              <BarTrack>
                <BarFill $width={minSalePercent} $color="#faad14">
                  {formatPrice(minSalePrice)}
                </BarFill>
              </BarTrack>
            </BarRow>
          </BarChart>
        </ChartContainer>

        {/* 기본 가격 정보 */}
        <PriceTable>
          <TableRow>
            <TableCell>주변시세</TableCell>
            <TableCell>{formatPriceDetail(marketPrice)}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>감정가</TableCell>
            <TableCell>{formatPriceDetail(appraisalPrice)}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>최저 매각가</TableCell>
            <TableCell>{formatPriceDetail(minSalePrice)}</TableCell>
          </TableRow>
        </PriceTable>

        {/* 추가 분석 정보 */}
        <PriceTable>
          <TableRow>
            <TableCell>시세 대비 할인율</TableCell>
            <TableCell style={{ color: '#52c41a', fontWeight: '700' }}>
              {discountRate}%
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>평당 가격 (최저가 기준)</TableCell>
            <TableCell style={{ fontWeight: '700' }}>
              {pricePerPyeong.toLocaleString()}만원
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>감정가 대비 최저가</TableCell>
            <TableCell style={{ color: '#1890ff', fontWeight: '700' }}>
              {((minSalePrice / appraisalPrice) * 100).toFixed(1)}%
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>시세 대비 예상 수익</TableCell>
            <TableCell style={{ color: '#52c41a', fontWeight: '700' }}>
              +{formatPriceDetail(marketPrice - minSalePrice)}
            </TableCell>
          </TableRow>
        </PriceTable>

        {/* 가격 분석 설명 */}
        <AnalysisCard>
          <CardTitle>가격 분석</CardTitle>
          <CardContent>
            <AIText style={{ color: '#cccccc', lineHeight: '1.8' }}>
              본 물건의 최저 매각가는 <strong style={{ color: '#faad14' }}>{formatPriceDetail(minSalePrice)}</strong>로,
              주변 시세인 <strong style={{ color: '#52c41a' }}>{formatPriceDetail(marketPrice)}</strong> 대비 
              <strong style={{ color: '#52c41a' }}> {discountRate}% 할인</strong>된 가격입니다.
              <br/><br/>
              감정가 <strong style={{ color: '#1890ff' }}>{formatPriceDetail(appraisalPrice)}</strong>의 
              <strong style={{ color: '#1890ff' }}> 80%</strong> 수준으로 시작하며,
              평당 가격은 <strong style={{ color: '#ffffff' }}>{pricePerPyeong.toLocaleString()}만원</strong>입니다.
              <br/><br/>
              주변 시세 대비 저렴한 가격으로 시작하므로 투자 가치가 높은 것으로 평가됩니다.
            </AIText>
          </CardContent>
        </AnalysisCard>
      </TabContent>
    );
  };

  const renderRiskAnalysis = () => {
    // 위험 분석 데이터
    const riskLevel = '낮음';
    const riskScore = 82;
    const totalRiskAmount = 50000000; // 총 인수 위험 금액
    
    const formatPriceDetail = (price: number) => {
      const billion = Math.floor(price / 100000000);
      const million = Math.floor((price % 100000000) / 10000);
      if (billion === 0) {
        return `${million.toLocaleString()}만원`;
      }
      if (million === 0) {
        return `${billion}억원`;
      }
      return `${billion}억 ${million.toLocaleString()}만원`;
    };

    return (
      <TabContent>
        {/* 위험도 요약 */}
        <SummaryGrid>
          <SummaryCard>
            <SummaryTitle>위험도 레벨</SummaryTitle>
            <SummaryValue>
              <ScoreBadge $score={riskScore}>{riskLevel}</ScoreBadge>
            </SummaryValue>
            <SummarySubtext>Level 2 / 5단계</SummarySubtext>
          </SummaryCard>

          <SummaryCard>
            <SummaryTitle>총 인수 위험 금액</SummaryTitle>
            <SummaryValue style={{ fontSize: '22px' }}>
              {formatPriceDetail(totalRiskAmount)}
            </SummaryValue>
            <SummarySubtext>임차보증금 합계</SummarySubtext>
          </SummaryCard>

          <SummaryCard>
            <SummaryTitle>주요 위험 요소</SummaryTitle>
            <SummaryValue style={{ fontSize: '22px', color: '#faad14' }}>
              임차인 1명
            </SummaryValue>
            <SummarySubtext>권리관계 단순</SummarySubtext>
          </SummaryCard>
        </SummaryGrid>

        {/* 선순위 권리관계 */}
        <ChartContainer>
          <ChartTitle>선순위 권리관계</ChartTitle>
          <PriceTable style={{ marginBottom: 0 }}>
            <TableRow $columns="150px 1fr 200px">
              <TableCell style={{ fontWeight: '600', color: '#999999', borderRight: '1px solid #333333' }}>종류</TableCell>
              <TableCell style={{ fontWeight: '600', color: '#999999', borderRight: '1px solid #333333' }}>권리자</TableCell>
              <TableCell style={{ fontWeight: '600', color: '#999999' }}>금액</TableCell>
            </TableRow>
            <TableRow $columns="150px 1fr 200px">
              <TableCell style={{ borderRight: '1px solid #333333' }}>근저당권</TableCell>
              <TableCell style={{ borderRight: '1px solid #333333' }}>없음</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            <TableRow $columns="150px 1fr 200px">
              <TableCell style={{ borderRight: '1px solid #333333' }}>전세권</TableCell>
              <TableCell style={{ borderRight: '1px solid #333333' }}>없음</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            <TableRow $columns="150px 1fr 200px">
              <TableCell style={{ borderRight: '1px solid #333333' }}>가압류</TableCell>
              <TableCell style={{ borderRight: '1px solid #333333' }}>없음</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            <TableRow $columns="150px 1fr 200px">
              <TableCell style={{ borderRight: '1px solid #333333' }}>가등기</TableCell>
              <TableCell style={{ borderRight: '1px solid #333333' }}>없음</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </PriceTable>
        </ChartContainer>

        {/* 임차인 정보 */}
        <ChartContainer>
          <ChartTitle>임차인 정보</ChartTitle>
          <PriceTable style={{ marginBottom: 0 }}>
            <TableRow $columns="1fr 1fr">
              <TableCell style={{ fontWeight: '600', color: '#999999', borderRight: '1px solid #333333' }}>보증금</TableCell>
              <TableCell style={{ fontWeight: '600', color: '#999999' }}>전입일자</TableCell>
            </TableRow>
            <TableRow $columns="1fr 1fr">
              <TableCell style={{ borderRight: '1px solid #333333', color: '#faad14', fontWeight: '700' }}>
                {formatPriceDetail(50000000)}
              </TableCell>
              <TableCell>2023년 3월 15일</TableCell>
            </TableRow>
          </PriceTable>
        </ChartContainer>

        {/* 위험 분석 설명 */}
        <AnalysisCard>
          <CardTitle>위험 분석</CardTitle>
          <CardContent>
            <AIText style={{ color: '#cccccc', lineHeight: '1.8' }}>
              본 물건은 <strong style={{ color: '#52c41a' }}>선순위 권리관계가 없어</strong> 권리분석이 단순한 편입니다.
              <br/><br/>
              <strong style={{ color: '#faad14' }}>임차인 1명이 거주 중</strong>이며, 보증금은 
              <strong style={{ color: '#faad14' }}> 5천만원</strong>입니다. 
              전입일자는 2023년 3월 15일로, 대항력을 갖춘 상태이므로 낙찰 후 임차보증금을 인수해야 합니다.
              <br/><br/>
              근저당권, 전세권 등 다른 권리가 없어 <strong style={{ color: '#52c41a' }}>비교적 안전한 투자</strong>가 가능하나,
              임차인과의 협의 과정이 필요할 수 있습니다. 예상 소요 기간은 <strong style={{ color: '#ffffff' }}>3~6개월</strong> 정도입니다.
            </AIText>
          </CardContent>
        </AnalysisCard>
      </TabContent>
    );
  };

  const renderLocationInfo = () => {
    const locationScore = 92; // 위치 점수

    return (
      <TabContent>
        {/* 위치 정보 요약 */}
        <SummaryGrid>
          <SummaryCard>
            <SummaryTitle>위치 점수</SummaryTitle>
            <SummaryValue>
              <ScoreBadge $score={locationScore}>{locationScore}점</ScoreBadge>
            </SummaryValue>
            <SummarySubtext>매우 우수한 입지</SummarySubtext>
          </SummaryCard>

          <SummaryCard>
            <SummaryTitle>도로 접근성</SummaryTitle>
            <SummaryValue style={{ fontSize: '22px', color: '#52c41a' }}>
              우수
            </SummaryValue>
            <SummarySubtext>대로변 인접</SummarySubtext>
          </SummaryCard>

          <SummaryCard>
            <SummaryTitle>도로 정보</SummaryTitle>
            <SummaryValue style={{ fontSize: '22px' }}>
              20m
            </SummaryValue>
            <SummarySubtext>도로 폭원</SummarySubtext>
          </SummaryCard>
        </SummaryGrid>

        {/* 주요 시설 정보 */}
        <ChartContainer>
          <ChartTitle>주요 시설 접근성</ChartTitle>
          <PriceTable style={{ marginBottom: 0 }}>
            <TableRow $columns="200px 1fr 150px">
              <TableCell style={{ fontWeight: '600', color: '#999999', borderRight: '1px solid #333333' }}>시설</TableCell>
              <TableCell style={{ fontWeight: '600', color: '#999999', borderRight: '1px solid #333333' }}>명칭</TableCell>
              <TableCell style={{ fontWeight: '600', color: '#999999' }}>거리</TableCell>
            </TableRow>
            <TableRow $columns="200px 1fr 150px">
              <TableCell style={{ borderRight: '1px solid #333333' }}>지하철역</TableCell>
              <TableCell style={{ borderRight: '1px solid #333333' }}>역삼역 (2호선)</TableCell>
              <TableCell style={{ color: '#52c41a', fontWeight: '700' }}>도보 5분</TableCell>
            </TableRow>
            <TableRow $columns="200px 1fr 150px">
              <TableCell style={{ borderRight: '1px solid #333333' }}>버스정류장</TableCell>
              <TableCell style={{ borderRight: '1px solid #333333' }}>역삼역</TableCell>
              <TableCell style={{ color: '#52c41a', fontWeight: '700' }}>도보 3분</TableCell>
            </TableRow>
            <TableRow $columns="200px 1fr 150px">
              <TableCell style={{ borderRight: '1px solid #333333' }}>초등학교</TableCell>
              <TableCell style={{ borderRight: '1px solid #333333' }}>역삼초등학교</TableCell>
              <TableCell style={{ color: '#52c41a', fontWeight: '700' }}>도보 7분</TableCell>
            </TableRow>
            <TableRow $columns="200px 1fr 150px">
              <TableCell style={{ borderRight: '1px solid #333333' }}>중학교</TableCell>
              <TableCell style={{ borderRight: '1px solid #333333' }}>역삼중학교</TableCell>
              <TableCell style={{ fontWeight: '700' }}>도보 12분</TableCell>
            </TableRow>
            <TableRow $columns="200px 1fr 150px">
              <TableCell style={{ borderRight: '1px solid #333333' }}>대형마트</TableCell>
              <TableCell style={{ borderRight: '1px solid #333333' }}>이마트 역삼점</TableCell>
              <TableCell style={{ fontWeight: '700' }}>도보 10분</TableCell>
            </TableRow>
            <TableRow $columns="200px 1fr 150px">
              <TableCell style={{ borderRight: '1px solid #333333' }}>편의점</TableCell>
              <TableCell style={{ borderRight: '1px solid #333333' }}>CU, GS25</TableCell>
              <TableCell style={{ color: '#52c41a', fontWeight: '700' }}>도보 2분</TableCell>
            </TableRow>
            <TableRow $columns="200px 1fr 150px">
              <TableCell style={{ borderRight: '1px solid #333333' }}>병원</TableCell>
              <TableCell style={{ borderRight: '1px solid #333333' }}>강남세브란스병원</TableCell>
              <TableCell style={{ fontWeight: '700' }}>차량 10분</TableCell>
            </TableRow>
          </PriceTable>
        </ChartContainer>

        {/* 지도 */}
        <ChartContainer>
          <ChartTitle>위치 지도</ChartTitle>
          <div style={{ 
            width: '100%', 
            height: '400px', 
            background: '#1a1a1a',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1rem',
            border: '1px solid #333333'
          }}>
            <div style={{ fontSize: '48px' }}>🗺️</div>
            <div style={{ color: '#666666', fontSize: '16px' }}>
              서울특별시 강남구 테헤란로 123
            </div>
            <div style={{ color: '#999999', fontSize: '14px' }}>
              지도 API 연동 예정
            </div>
          </div>
        </ChartContainer>

        {/* 위치 분석 설명 */}
        <AnalysisCard>
          <CardTitle>위치 분석</CardTitle>
          <CardContent>
            <AIText style={{ color: '#cccccc', lineHeight: '1.8' }}>
              본 물건은 <strong style={{ color: '#52c41a' }}>강남구 테헤란로</strong>에 위치하여 
              <strong style={{ color: '#52c41a' }}> 업무/상업 지역</strong>의 중심지입니다.
              <br/><br/>
              지하철 <strong style={{ color: '#52c41a' }}>2호선 역삼역</strong>까지 도보 5분 거리로 
              <strong style={{ color: '#52c41a' }}> 대중교통 접근성이 매우 우수</strong>하며,
              버스 정류장도 도보 3분 거리에 있어 출퇴근이 편리합니다.
              <br/><br/>
              주변에 <strong style={{ color: '#ffffff' }}>초중학교, 대형마트, 병원</strong> 등 생활 편의시설이 잘 갖춰져 있으며,
              도로 폭원 <strong style={{ color: '#ffffff' }}>20m의 대로변</strong>에 위치하여 차량 접근성도 양호합니다.
              <br/><br/>
              강남구의 핵심 업무지구로 <strong style={{ color: '#52c41a' }}>실거주 및 임대 수요가 높은 지역</strong>이며,
              향후 부동산 가치 상승이 기대되는 입지입니다.
            </AIText>
          </CardContent>
        </AnalysisCard>
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
        <Tab 
          $active={activeTab === '위치정보'} 
          onClick={() => setActiveTab('위치정보')}
        >
          위치정보
        </Tab>
      </TabContainer>

      {activeTab === '종합' && renderOverview()}
      {activeTab === '가격분석' && renderPriceAnalysis()}
      {activeTab === '위험분석' && renderRiskAnalysis()}
      {activeTab === '위치정보' && renderLocationInfo()}
    </Container>
  );
};

