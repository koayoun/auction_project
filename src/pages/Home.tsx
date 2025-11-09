import { useState } from 'react';
import styled from 'styled-components';
import { Header } from '../widgets/layout';
import { Footer } from '../widgets/layout';
import { AuctionFilters } from '../widgets/auction-filters';
import { AuctionList } from '../widgets/auction-list';
import { Spinner } from '../shared/ui';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { fetchAuctionsSuccess } from '../features/auctions';
import type { AuctionItem } from '../entities/auction';

const Main = styled.main`
  min-height: calc(100vh - 200px);
  background-color: #000000;
`;

const HeroSection = styled.section`
  background-color: #000000;
  padding: 4rem 0 2rem 0;
  position: relative;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-align: center;
  color: white;
`;

const Subtitle = styled.p`
  font-size: 16px;
  margin: 0 0 2rem 0;
  text-align: center;
  color: white;
  opacity: 0.9;
`;

const SpinnerWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 2rem;
`;

const ContentSection = styled.section`
  padding: 1.5rem 0 3rem 0;
  background-color: #000000;
  min-height: 200px;
`;

function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.auctions);

  const handleSearch = () => {
    setIsAnalyzing(true);
    setShowResults(false);

    // 임시 데이터 (실제로는 API 호출)
    setTimeout(() => {
      const mockData: AuctionItem[] = [
        {
          id: '1',
          caseNumber: '2024타경12345',
          court: '서울중앙지방법원',
          address: '서울특별시 강남구 테헤란로 123',
          appraisalPrice: 850000000,
          minSalePrice: 680000000,
          deposit: 68000000,
          detailedAddress: '서울특별시 강남구 테헤란로 123 (역삼동, 강남빌딩) 101호',
          dividendDeadline: '2025-11-10',
          claimAmount: 500000000,
          failedBidCount: 0,
          note: '현황조사 시 임차인 1명 거주 중',
          status: 'active',
        },
        {
          id: '2',
          caseNumber: '2024타경12346',
          court: '서울중앙지방법원',
          address: '서울특별시 서초구 반포대로 234',
          appraisalPrice: 920000000,
          minSalePrice: 736000000,
          deposit: 73600000,
          detailedAddress: '서울특별시 서초구 반포대로 234 (반포동) 301호',
          dividendDeadline: '2025-11-11',
          claimAmount: 600000000,
          failedBidCount: 0,
          status: 'active',
        },
        {
          id: '3',
          caseNumber: '2024타경12347',
          court: '서울중앙지방법원',
          address: '서울특별시 송파구 올림픽로 345',
          appraisalPrice: 750000000,
          minSalePrice: 600000000,
          deposit: 60000000,
          detailedAddress: '서울특별시 송파구 올림픽로 345 (잠실동) 1502호',
          dividendDeadline: '2025-11-05',
          claimAmount: 450000000,
          failedBidCount: 1,
          note: '선순위 전세권 설정',
          status: 'completed',
        },
        {
          id: '4',
          caseNumber: '2024타경12348',
          court: '서울중앙지방법원',
          address: '서울특별시 강남구 역삼동 456',
          appraisalPrice: 1200000000,
          minSalePrice: 960000000,
          deposit: 96000000,
          detailedAddress: '서울특별시 강남구 역삼동 456 (역삼빌딩) 전층',
          dividendDeadline: '2025-11-13',
          claimAmount: 800000000,
          failedBidCount: 0,
          status: 'active',
        },
      ];

      dispatch(fetchAuctionsSuccess({ items: mockData, total: mockData.length }));
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <>
      <Header />
      <Main>
        <HeroSection>
          <Container>
            <Title>경매 물건 자동 분석 시스템</Title>
            <Subtitle>대법원 경매정보, 실거래가, 위치분석을 한번에!</Subtitle>
            
            <AuctionFilters onSearch={handleSearch} />
          </Container>
          
          {isAnalyzing && (
            <SpinnerWrapper>
              <Spinner text="검색중..." />
            </SpinnerWrapper>
          )}
        </HeroSection>

        <ContentSection>
          <Container>
            {showResults && <AuctionList items={items} />}
          </Container>
        </ContentSection>
      </Main>
      <Footer />
    </>
  );
}

export default Home;
