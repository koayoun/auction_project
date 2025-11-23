import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Header } from '../widgets/layout';
import { Footer } from '../widgets/layout';
import { PropertyDetail } from '../widgets/property-detail';
import { AnalysisDashboard } from '../widgets/analysis-dashboard';
import { Spinner } from '../shared/ui';
import { useAppSelector } from '../app/hooks';
import { fetchAuctionDetail, appraisalSummaryToNote, appraisalSummaryToCondition } from '../shared/api/auctionApi';
import type { AuctionItem } from '../entities/auction';

const Main = styled.main`
  min-height: calc(100vh - 200px);
  background-color: #000000;
  padding: 3rem 0;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: transparent;
  color: #ffffff;
  border: 1px solid #333333;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: all 0.2s;

  &:hover {
    border-color: #ffffff;
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 3rem 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:first-of-type {
    margin-top: 0;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #333333;
  margin: 3rem 0;
`;

const AnalysisSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const AnalyzeButton = styled.button`
  padding: 1.5rem 3rem;
  background-color: #ffffff;
  color: #000000;
  border: 2px solid #ffffff;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);

  &:hover:not(:disabled) {
    background-color: transparent;
    color: #ffffff;
    box-shadow: 0 6px 20px rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #666666;
    border-color: #666666;
    color: #999999;
    cursor: not-allowed;
  }
`;

const AnalysisPlaceholder = styled.div`
  background: #1a1a1a;
  border: 2px dashed #333333;
  border-radius: 12px;
  padding: 4rem 2rem;
  text-align: center;
  color: #666666;

  p {
    margin: 0;
    font-size: 16px;
    line-height: 1.6;
  }
`;

// 주소에서 시/도, 구/군 추출
function extractAddressParts(address: string): { si: string; gu: string } {
  if (!address) return { si: '', gu: '' };

  const parts = address.split(' ');
  let si = '';
  let gu = '';

  // 첫 번째 부분이 시/도
  if (parts.length > 0) {
    si = parts[0]; // 예: "서울특별시", "경기도"
  }

  // 두 번째 부분이 구/군/시
  if (parts.length > 1) {
    gu = parts[1]; // 예: "강남구", "수원시"
  }

  return { si, gu };
}

function Dashboard() {
  const navigate = useNavigate();
  const { selectedItem } = useAppSelector((state) => state.auctions);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [enhancedItem, setEnhancedItem] = useState<AuctionItem | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // 상세 정보 조회 (배당요구종기, 감정평가요항표)
  useEffect(() => {
    const fetchDetail = async () => {
      if (!selectedItem) return;

      setIsLoadingDetail(true);

      try {
        // 사건번호에서 숫자만 추출 (예: "2024타경12345" -> "202412345")
        const caseNoMatch = selectedItem.caseNumber.match(/(\d+)/g);
        const caseNo = caseNoMatch ? caseNoMatch.join('') : selectedItem.caseNumber;

        // 주소에서 시/도, 구/군 추출
        const { si, gu } = extractAddressParts(selectedItem.address);

        console.log('📋 Detail API 호출:', { caseNo, si, gu });

        const response = await fetchAuctionDetail({
          case_no: caseNo,
          si,
          gu,
        });

        console.log('📋 Detail API 응답:', response);

        if (response.success && response.data) {
          // 감정평가요항표를 물건비고와 물건상태로 각각 변환
          const noteFromAppraisal = appraisalSummaryToNote(response.data.appraisal_summary);
          const conditionFromAppraisal = appraisalSummaryToCondition(response.data.appraisal_summary);

          // 배당요구종기 포맷 변환 (YYYY.MM.DD)
          let dividendDeadline = selectedItem.dividendDeadline;
          if (response.data.dividend_claim_date) {
            dividendDeadline = response.data.dividend_claim_date.replace(/-/g, '.');
          }

          // 기존 아이템에 상세 정보 추가
          const updated: AuctionItem = {
            ...selectedItem,
            dividendDeadline: dividendDeadline || selectedItem.dividendDeadline,
            note: noteFromAppraisal || selectedItem.note,
            propertyCondition: conditionFromAppraisal,
          };

          console.log('✅ Enhanced Item:', {
            dividendDeadline: updated.dividendDeadline,
            note: updated.note?.substring(0, 100) + '...',
            propertyCondition: updated.propertyCondition?.substring(0, 100) + '...',
          });

          setEnhancedItem(updated);
        } else {
          // 실패 시 원본 사용
          setEnhancedItem(selectedItem);
        }
      } catch (error) {
        console.error('Detail API 호출 실패:', error);
        // 에러 시 원본 사용
        setEnhancedItem(selectedItem);
      } finally {
        setIsLoadingDetail(false);
      }
    };

    fetchDetail();
  }, [selectedItem]);

  const handleAnalyze = () => {
    setIsAnalyzing(true);

    // 2초 후 분석 결과 표시
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAnalysis(true);
    }, 2000);
  };

  // 분석에 사용할 아이템 (상세 정보가 있으면 enhancedItem, 없으면 selectedItem)
  const itemForAnalysis = enhancedItem || selectedItem;

  return (
    <>
      <Header />
      <Main>
        <Container>
          <BackButton onClick={() => navigate('/')}>
            ← 목록으로 돌아가기
          </BackButton>

          {/* 상단: 물건 상세 정보 */}
          <SectionTitle>물건 상세 정보</SectionTitle>
          {isLoadingDetail ? (
            <Spinner text="상세 정보를 불러오는 중..." />
          ) : (
            <PropertyDetail item={itemForAnalysis} />
          )}

          <Divider />

          {/* 하단: 분석 대시보드 */}
          <SectionTitle>AI 분석 대시보드</SectionTitle>

          {!showAnalysis && !isAnalyzing && (
            <AnalysisSection>
              <AnalysisPlaceholder>
                <p>AI를 활용한 상세 분석을 시작하세요</p>
                <p>실거래가, 위치, 투자수익률, 권리분석 등을 자동으로 분석합니다</p>
              </AnalysisPlaceholder>
              <AnalyzeButton onClick={handleAnalyze} disabled={isLoadingDetail}>
                {isLoadingDetail ? '상세 정보 로딩 중...' : 'AI 분석 시작하기'}
              </AnalyzeButton>
            </AnalysisSection>
          )}

          {isAnalyzing && (
            <AnalysisSection>
              <Spinner text="AI가 물건을 분석하고 있습니다..." />
            </AnalysisSection>
          )}

          {showAnalysis && itemForAnalysis && <AnalysisDashboard item={itemForAnalysis} />}
        </Container>
      </Main>
      <Footer />
    </>
  );
}

export default Dashboard;
