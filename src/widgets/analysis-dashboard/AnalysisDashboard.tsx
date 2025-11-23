import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { marked } from 'marked';
import {
  getScoreGradeAndComment,
  formatPriceDetail,
  calculateAppraisalRatio,
  calculatePriceDifference,
  isPropertyStatusGood,
  isRightAnalysisGood,
  type PropertyStatus,
  type RightAnalysisResult
} from '../../shared/constants';
import { OpenAiService } from '../../shared/api/claudeApi';
import { analyzeAuction } from '../../shared/api/analysisApi';
import type { AnalysisResult } from '../../shared/api/types';
import type { AuctionItem } from '../../entities/auction';

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

const EvaluationChip = styled.span<{ $type: '안전' | '주의' | '위험' }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    if (props.$type === '안전') return '#52c41a22';
    if (props.$type === '주의') return '#faad1422';
    return '#f5222d22';
  }};
  color: ${props => {
    if (props.$type === '안전') return '#52c41a';
    if (props.$type === '주의') return '#faad14';
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

type TabType = '종합' | '가격분석' | '위험분석';

interface AnalysisDashboardProps {
  item: AuctionItem;
}

interface AIAnalysisResult {
  investmentValue: string;
  riskAnalysis: string;
  locationAnalysis: string;
  overallOpinion: string;
  investmentRating: string;
}

export const AnalysisDashboard = ({ item }: AnalysisDashboardProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('종합');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Analysis API 상태
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // 마크다운을 HTML로 변환하는 함수
  const markdownToHtml = (markdown: string): string => {
    if (!markdown) return '';
    try {
      // marked는 동기적으로도 사용 가능하지만, 타입 안정성을 위해 명시적으로 처리
      const html = marked.parse(markdown, { breaks: true });
      return typeof html === 'string' ? html : String(html);
    } catch (error) {
      console.error('마크다운 변환 실패:', error);
      return markdown;
    }
  };

  // Analysis API 호출 (점수 계산)
  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoadingAnalysis(true);
      setAnalysisError(null);

      try {
        const result = await analyzeAuction(item);
        console.log('📊 Analysis API 응답:', result);
        setAnalysisData(result);
      } catch (error) {
        console.error('Analysis API 호출 실패:', error);
        setAnalysisError(error instanceof Error ? error.message : '분석 데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoadingAnalysis(false);
      }
    };

    if (item) {
      fetchAnalysis();
    }
  }, [item]);

  // Claude API 호출
  useEffect(() => {
    const fetchAIAnalysis = async () => {
      setIsLoadingAI(true);
      setAiError(null);

      try {
        // Analysis API에서 받은 점수 사용, 없으면 기본값
        const priceActualScore = analysisData
          ? analysisData['감정가대비_할인율_점수'] + analysisData['시세대비_할인율_점수'] + analysisData['소재지_점수']
          : 34;
        const riskActualScore = analysisData
          ? analysisData['배당요구종기_점수'] + analysisData['물건비고_점수'] + analysisData['물건상태_점수']
          : 49;
        const totalScore = analysisData ? analysisData['총점'] : priceActualScore + riskActualScore;

        // 가격 데이터
        const appraisalPrice = item.appraisalPrice;
        const minSalePrice = item.minSalePrice;
        const estimatedMarketPrice = analysisData?.['추정시세_원'] || Math.round(appraisalPrice * 1.1);
        // 소재지 점수에 따른 중요도 결정
        const locationScore = analysisData?.['소재지_점수'] || 0;
        const locationImportance: '높음' | '보통' | '낮음' = locationScore >= 20 ? '높음' : locationScore >= 10 ? '보통' : '낮음';
        
        // 가격 분석 계산
        const appraisalRatio = calculateAppraisalRatio(minSalePrice, appraisalPrice);
        const priceDifference = calculatePriceDifference(estimatedMarketPrice, minSalePrice);

        // 위험 요소 데이터 (임시)
        const rightAnalysisResult: RightAnalysisResult = '양호';
        const propertyStatus: PropertyStatus = '관리 양호';

        const claudeInputData = {
          priceScore: priceActualScore,
          riskScore: riskActualScore,
          totalScore,
          appraisalPrice,
          minSalePrice,
          estimatedMarketPrice,
          appraisalRatio,
          priceDifference,
          locationImportance,
          propertyStatus,
          rightAnalysisResult,
          dividendDeadline: item.dividendDeadline,
        };

        const result = await OpenAiService.analyzeAuctionItem(item, claudeInputData);
        setAiAnalysis(result);
      } catch (error) {
        console.error('AI 분석 실패:', error);
        setAiError(error instanceof Error ? error.message : 'AI 분석을 불러오는데 실패했습니다.');
      } finally {
        setIsLoadingAI(false);
      }
    };

    if (item && analysisData) {
      fetchAIAnalysis();
    }
  }, [item, analysisData]);

  const renderOverview = () => {
    // 로딩 중일 때
    if (isLoadingAnalysis || !analysisData) {
      return (
        <TabContent>
          <div style={{ textAlign: 'center', padding: '4rem', color: '#999999' }}>
            분석 데이터를 불러오는 중...
          </div>
        </TabContent>
      );
    }

    // 에러 발생 시
    if (analysisError) {
      return (
        <TabContent>
          <div style={{ textAlign: 'center', padding: '4rem', color: '#f5222d' }}>
            {analysisError}
          </div>
        </TabContent>
      );
    }

    // 점수 계산 (Analysis API 데이터 사용)
    const PRICE_MAX_SCORE = 65; // 가격 매력도 만점 (감정가대비 10 + 시세대비 30 + 소재지 25)
    const RISK_MAX_SCORE = 35; // 권리 위험도 만점 (물건비고 20 + 물건상태 10 + 배당요구종기 5)

    // API에서 받은 점수 사용
    const priceActualScore = analysisData
      ? analysisData['감정가대비_할인율_점수'] + analysisData['시세대비_할인율_점수'] + analysisData['소재지_점수']
      : 0;
    const riskActualScore = analysisData
      ? analysisData['배당요구종기_점수'] + analysisData['물건비고_점수'] + analysisData['물건상태_점수']
      : 0;

    // 100점 기준으로 환산된 점수
    const priceConvertedScore = Math.round((priceActualScore / PRICE_MAX_SCORE) * 100);
    const riskConvertedScore = Math.round((riskActualScore / RISK_MAX_SCORE) * 100);

    // 종합 투자 점수
    const totalScore = analysisData?.['총점'] || 0;

    // 가격 데이터 (실제 데이터 사용)
    const appraisalPrice = item.appraisalPrice;
    const minSalePrice = item.minSalePrice;
    const estimatedMarketPrice = analysisData?.['추정시세_원'] || Math.round(appraisalPrice * 1.1);
    // 소재지 점수에 따른 중요도 결정
    const locationScore = analysisData?.['소재지_점수'] || 0;
    const locationImportance: '높음' | '보통' | '낮음' = locationScore >= 20 ? '높음' : locationScore >= 10 ? '보통' : '낮음';

    // 가격 분석 계산
    const appraisalRatio = analysisData?.['감정가대비_할인율(%)'] || calculateAppraisalRatio(minSalePrice, appraisalPrice);
    const priceDifference = calculatePriceDifference(estimatedMarketPrice, minSalePrice);

    // 위험 요소 데이터
    const rightAnalysisResult: RightAnalysisResult = analysisData?.['물건비고_점수'] && analysisData['물건비고_점수'] >= 8 ? '양호' : '주의';
    const propertyStatus: PropertyStatus = analysisData?.['물건상태_점수'] && analysisData['물건상태_점수'] >= 8 ? '관리 양호' : '일부 노후';
    const dividendDeadline = item.dividendDeadline || undefined;

    // 등급과 코멘트 계산 (API에서 받은 등급 사용)
    const apiGrade = analysisData?.['등급'] || '';
    const { grade, comment } = apiGrade ? { grade: apiGrade, comment: '' } : getScoreGradeAndComment(totalScore);

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
              <SummaryTitle>가격 매력 (65점)</SummaryTitle>
            <SummaryValue>
                <ScoreBadge $score={priceConvertedScore}>{priceConvertedScore}점</ScoreBadge>
            </SummaryValue>
              <SummarySubtext>({priceActualScore}/{PRICE_MAX_SCORE})</SummarySubtext>
          </SummaryCard>

          <SummaryCard>
              <SummaryTitle>권리 위험도 (35점)</SummaryTitle>
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
          {isLoadingAI && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#999999' }}>
              AI가 분석 중입니다...
            </div>
          )}
          {aiError && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#f5222d' }}>
              {aiError}
            </div>
          )}
          {!isLoadingAI && !aiError && aiAnalysis && (
            <>
              <AISection>
                <AISectionTitle>📊 투자 가치 평가</AISectionTitle>
                <AIText dangerouslySetInnerHTML={{ __html: markdownToHtml(aiAnalysis.investmentValue) }} />
              </AISection>

              <AISection>
                <AISectionTitle>⚠️ 리스크 분석</AISectionTitle>
                <AIText dangerouslySetInnerHTML={{ __html: markdownToHtml(aiAnalysis.riskAnalysis) }} />
              </AISection>

              <AISection>
                <AISectionTitle>📍 입지 분석</AISectionTitle>
                <AIText dangerouslySetInnerHTML={{ __html: markdownToHtml(aiAnalysis.locationAnalysis) }} />
              </AISection>

              <AISection>
                <AISectionTitle>✅ 종합 의견</AISectionTitle>
                <AIText style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
                  투자 매력도: <HighlightValue $positive={true}>{aiAnalysis.investmentRating}</HighlightValue>
                </AIText>
                <AIText dangerouslySetInnerHTML={{ __html: markdownToHtml(aiAnalysis.overallOpinion) }} />
              </AISection>
            </>
          )}
        </AIContent>
      </AIAnalysisSection>
      </TabContent>
    );
  };

  const renderPriceAnalysis = () => {
    // 로딩/에러 처리
    if (isLoadingAnalysis) {
      return (
        <TabContent>
          <div style={{ textAlign: 'center', padding: '4rem', color: '#999999' }}>
            분석 데이터를 불러오는 중...
          </div>
        </TabContent>
      );
    }

    // 가격 데이터 (API 데이터 사용)
    const appraisalPrice = item.appraisalPrice;
    const minSalePrice = item.minSalePrice;

    // API에서 받은 점수 사용
    const appraisalDiscountScore = analysisData?.['감정가대비_할인율_점수'] || 0;
    const marketDiscountScore = analysisData?.['시세대비_할인율_점수'] || 0;
    const locationScore = analysisData?.['소재지_점수'] || 0;
    const priceActualScore = appraisalDiscountScore + marketDiscountScore + locationScore;

    return (
      <TabContent>
        <SectionTitle>세부 가격분석(점수 : {priceActualScore}/65)</SectionTitle>

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
              <DataRow>
                <DataLabel>감정가대비 할인율</DataLabel>
                <DataValue>{analysisData?.['감정가대비_할인율(%)'] || '-'}%</DataValue>
              </DataRow>
              {analysisData?.['추정시세_원'] && (
                <DataRow>
                  <DataLabel>추정 시세</DataLabel>
                  <DataValue>{formatPriceDetail(analysisData['추정시세_원'])}</DataValue>
                </DataRow>
              )}
              {analysisData?.['시세대비_할인율(%)'] && (
                <DataRow>
                  <DataLabel>시세대비 할인율</DataLabel>
                  <DataValue>{analysisData['시세대비_할인율(%)']}%</DataValue>
                </DataRow>
              )}
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
                  <span style={{ textAlign: 'center', flex: '0 0 60px' }}>10</span>
                  <span style={{ textAlign: 'center', flex: '0 0 60px' }}>{appraisalDiscountScore}</span>
                </DataValue>
              </DataRow>
              <DataRow>
                <DataLabel>시세대비할인율</DataLabel>
                <DataValue style={{ display: 'flex', gap: '4rem', minWidth: '200px', justifyContent: 'flex-end' }}>
                  <span style={{ textAlign: 'center', flex: '0 0 60px' }}>30</span>
                  <span style={{ textAlign: 'center', flex: '0 0 60px' }}>{marketDiscountScore}</span>
                </DataValue>
              </DataRow>
              <DataRow>
                <DataLabel>소재지 중요도</DataLabel>
                <DataValue style={{ display: 'flex', gap: '4rem', minWidth: '200px', justifyContent: 'flex-end' }}>
                  <span style={{ textAlign: 'center', flex: '0 0 60px' }}>25</span>
                  <span style={{ textAlign: 'center', flex: '0 0 60px' }}>{locationScore}</span>
                </DataValue>
              </DataRow>
              <DataRow>
                <DataLabel style={{ fontWeight: '700', color: '#ffffff' }}>합계</DataLabel>
                <DataValue style={{ display: 'flex', gap: '4rem', minWidth: '200px', justifyContent: 'flex-end', fontWeight: '700', color: '#1890ff' }}>
                  <span style={{ textAlign: 'center', flex: '0 0 60px' }}>65</span>
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
    // 로딩/에러 처리
    if (isLoadingAnalysis) {
      return (
        <TabContent>
          <div style={{ textAlign: 'center', padding: '4rem', color: '#999999' }}>
            분석 데이터를 불러오는 중...
          </div>
        </TabContent>
      );
    }

    // API에서 받은 점수 사용
    const propertyNoteScore = analysisData?.['물건비고_점수'] || 0;
    const propertyStatusScore = analysisData?.['물건상태_점수'] || 0;
    const dividendScore = analysisData?.['배당요구종기_점수'] || 0;

    // 위험 분석 점수 합계
    const riskActualScore = propertyNoteScore + propertyStatusScore + dividendScore;

    // 물건 상태 텍스트 결정
    const propertyStatus: PropertyStatus = propertyStatusScore >= 8 ? '관리 양호' : propertyStatusScore >= 5 ? '일부 노후' : '심한 노후';
    const dividendDeadline = item.dividendDeadline || undefined;

    // 점수에 따른 평가 결정 함수 (점수가 높을수록 안전)
    const getEvaluation = (score: number, maxScore: number): '안전' | '주의' | '위험' => {
      const ratio = (score / maxScore) * 100;
      if (ratio >= 70) return '안전';
      if (ratio >= 40) return '주의';
      return '위험';
    };

    // 각 항목의 배점
    const propertyNoteMaxScore = 20; // 물건비고 스코어링 배점 (관리 위험도)
    const propertyStatusMaxScore = 10; // 물건 상태 배점
    const dividendMaxScore = 5; // 배당요구종기 배점

    return (
      <TabContent>
        <SectionTitle>세부 위험분석 (점수: {riskActualScore}/35)</SectionTitle>
        
        <CardTitle style={{ marginBottom: '1rem' }}>권리 및 상태 상세 정보</CardTitle>
        
        <div>
          {/* 헤더 */}
          <DataRow style={{ paddingBottom: '0.5rem', fontWeight: '600', color: '#ffffff' }}>
            <DataLabel style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', flex: '0 0 50px' }}>항목</DataLabel>
            <DataValue style={{ display: 'flex', gap: '2rem', minWidth: '400px', justifyContent: 'flex-start', textAlign: 'left' }}>
              <span style={{ flex: '0 0 100px' }}>데이터</span>
              <span style={{ flex: '0 0 80px' }}>평가</span>
              <span style={{ flex: '0 0 100px', textAlign: 'center' }}>점수(배점)</span>
              <span style={{ flex: '1' }}>분석</span>
            </DataValue>
          </DataRow>

          {/* 물건비고 스코어링 */}
          <DataRow>
            <DataLabel style={{ flex: '0 0 50px', fontSize: '13px' }}>물건비고 스코어링</DataLabel>
            <DataValue style={{ display: 'flex', gap: '2rem', minWidth: '400px', justifyContent: 'flex-start', textAlign: 'left', alignItems: 'center' }}>
              <span style={{ flex: '0 0 100px' }}>{propertyNoteScore}점</span>
              <span style={{ flex: '0 0 80px' }}>
                <EvaluationChip $type={getEvaluation(propertyNoteScore, propertyNoteMaxScore)}>
                  {getEvaluation(propertyNoteScore, propertyNoteMaxScore)}
                </EvaluationChip>
              </span>
              <span style={{ flex: '0 0 100px', textAlign: 'center' }}>
                {propertyNoteScore}/{propertyNoteMaxScore}
              </span>
              <span style={{ flex: '1' }}>-</span>
            </DataValue>
          </DataRow>

          {/* 물건 상태 */}
          <DataRow>
            <DataLabel style={{ flex: '0 0 50px', fontSize: '13px' }}>물건 상태</DataLabel>
            <DataValue style={{ display: 'flex', gap: '2rem', minWidth: '400px', justifyContent: 'flex-start', textAlign: 'left', alignItems: 'center' }}>
              <span style={{ flex: '0 0 100px' }}>{propertyStatus}</span>
              <span style={{ flex: '0 0 80px' }}>
                <EvaluationChip $type={getEvaluation(propertyStatusScore, propertyStatusMaxScore)}>
                  {getEvaluation(propertyStatusScore, propertyStatusMaxScore)}
                </EvaluationChip>
              </span>
              <span style={{ flex: '0 0 100px', textAlign: 'center' }}>
                {propertyStatusScore}/{propertyStatusMaxScore}
              </span>
              <span style={{ flex: '1' }}>-</span>
            </DataValue>
          </DataRow>

          {/* 배당요구종기 */}
          <DataRow>
            <DataLabel style={{ flex: '0 0 50px', fontSize: '13px' }}>배당요구종기</DataLabel>
            <DataValue style={{ display: 'flex', gap: '2rem', minWidth: '400px', justifyContent: 'flex-start', textAlign: 'left', alignItems: 'center' }}>
              <span style={{ flex: '0 0 100px' }}>{dividendDeadline}</span>
              <span style={{ flex: '0 0 80px' }}>
                <EvaluationChip $type={getEvaluation(dividendScore, dividendMaxScore)}>
                  {getEvaluation(dividendScore, dividendMaxScore)}
                </EvaluationChip>
              </span>
              <span style={{ flex: '0 0 100px', textAlign: 'center' }}>
                {dividendScore}/{dividendMaxScore}
              </span>
              <span style={{ flex: '1' }}>-</span>
            </DataValue>
          </DataRow>
            </div>

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

