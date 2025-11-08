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
  padding: 4rem 0;
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

const SearchBox = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 1px solid #333333;
  border-radius: 8px;
  font-size: 14px;
  background-color: #2a2a2a;
  color: #ffffff;

  &:focus {
    outline: none;
    border-color: #1890ff;
  }

  &:disabled {
    background-color: #1a1a1a;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #666666;
  }
`;

const SearchButton = styled.button`
  padding: 1rem 2rem;
  background-color: #ffffff;
  color: #000000;
  border: 2px solid #ffffff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: transparent;
    color: #ffffff;
  }

  &:disabled {
    background-color: #333333;
    border-color: #333333;
    color: #666666;
    cursor: not-allowed;
  }
`;

const ContentSection = styled.section`
  padding: 3rem 0;
  background-color: #000000;
`;

function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
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
          minBidPrice: 680000000,
          area: 84.5,
          bidStartDate: '2025-11-15',
          bidEndDate: '2025-11-22',
          status: 'active',
        },
        {
          id: '2',
          caseNumber: '2024타경12346',
          court: '서울중앙지방법원',
          address: '서울특별시 서초구 반포대로 234',
          appraisalPrice: 920000000,
          minBidPrice: 736000000,
          area: 99.2,
          bidStartDate: '2025-11-16',
          bidEndDate: '2025-11-23',
          status: 'active',
        },
        {
          id: '3',
          caseNumber: '2024타경12347',
          court: '서울중앙지방법원',
          address: '서울특별시 송파구 올림픽로 345',
          appraisalPrice: 750000000,
          minBidPrice: 600000000,
          area: 76.8,
          bidStartDate: '2025-11-10',
          bidEndDate: '2025-11-17',
          status: 'completed',
        },
        {
          id: '4',
          caseNumber: '2024타경12348',
          court: '서울중앙지방법원',
          address: '서울특별시 강남구 역삼동 456',
          appraisalPrice: 1200000000,
          minBidPrice: 960000000,
          area: 115.3,
          bidStartDate: '2025-11-18',
          bidEndDate: '2025-11-25',
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
            
            <AuctionFilters />
            
            <SearchBox>
              <SearchInput
                type="text"
                placeholder="사건 번호 또는 주소를 입력하세요"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <SearchButton onClick={handleSearch}>
                검색
              </SearchButton>
            </SearchBox>

            {isAnalyzing && <Spinner text="분석중..." />}
          </Container>
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
