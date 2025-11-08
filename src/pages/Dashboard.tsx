import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Header } from '../widgets/layout';
import { Footer } from '../widgets/layout';
import { PropertyDetail } from '../widgets/property-detail';
import { AnalysisDashboard } from '../widgets/analysis-dashboard';
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

function Dashboard() {
  const navigate = useNavigate();
  const { selectedItem } = useAppSelector((state) => state.auctions);

  return (
    <>
      <Header />
      <Main>
        <Container>
          <BackButton onClick={() => navigate('/')}>
            ← 목록으로 돌아가기
          </BackButton>

          {/* 상단: 물건 상세 정보 */}
          <SectionTitle>📋 물건 상세 정보</SectionTitle>
          <PropertyDetail item={selectedItem} />

          <Divider />

          {/* 하단: 분석 대시보드 */}
          <SectionTitle>📊 AI 분석 대시보드</SectionTitle>
          <AnalysisDashboard />
        </Container>
      </Main>
      <Footer />
    </>
  );
}

export default Dashboard;
