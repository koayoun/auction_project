import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Header } from '../widgets/layout';
import { Footer } from '../widgets/layout';
import { PropertyDetail } from '../widgets/property-detail';
import { AnalysisDashboard } from '../widgets/analysis-dashboard';
import { Spinner } from '../shared/ui';
import { useAppSelector } from '../app/hooks';

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

  &:hover {
    background-color: transparent;
    color: #ffffff;
    box-shadow: 0 6px 20px rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
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

function Dashboard() {
  const navigate = useNavigate();
  const { selectedItem } = useAppSelector((state) => state.auctions);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // 2초 후 분석 결과 표시
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAnalysis(true);
    }, 2000);
  };

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
          <PropertyDetail item={selectedItem} />

          <Divider />

          {/* 하단: 분석 대시보드 */}
          <SectionTitle>AI 분석 대시보드</SectionTitle>
          
          {!showAnalysis && !isAnalyzing && (
            <AnalysisSection>
              <AnalysisPlaceholder>
                <p>AI를 활용한 상세 분석을 시작하세요</p>
                <p>실거래가, 위치, 투자수익률, 권리분석 등을 자동으로 분석합니다</p>
              </AnalysisPlaceholder>
              <AnalyzeButton onClick={handleAnalyze}>
                AI 분석 시작하기
              </AnalyzeButton>
            </AnalysisSection>
          )}

          {isAnalyzing && (
            <AnalysisSection>
              <Spinner text="AI가 물건을 분석하고 있습니다..." />
            </AnalysisSection>
          )}

          {showAnalysis && <AnalysisDashboard />}
        </Container>
      </Main>
      <Footer />
    </>
  );
}

export default Dashboard;
