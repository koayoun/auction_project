import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Header } from '../widgets/layout';
import { Footer } from '../widgets/layout';
import { AuctionFilters } from '../widgets/auction-filters';
import { AuctionList } from '../widgets/auction-list';
import { Spinner, Pagination } from '../shared/ui';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { fetchAuctions, updateFilters } from '../features/auctions';
import type { FilterParams } from '../entities/auction';

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
  const [showResults, setShowResults] = useState(false);

  const dispatch = useAppDispatch();
  const { items, loading, error, totalElements, currentPage, filters } = useAppSelector((state) => state.auctions);

  // 컴포넌트 마운트 시 이전 검색 결과가 있으면 표시
  useEffect(() => {
    if (items.length > 0) {
      setShowResults(true);
    }
  }, [items.length]);

  const handleSearch = async (filters: FilterParams) => {
    setShowResults(false);

    // Redux에 필터 저장
    dispatch(updateFilters(filters));

    // 필터에서 받은 데이터로 Big API 호출 (첫 페이지)
    const result = await dispatch(fetchAuctions({
      page: 1,
      filters: filters
    }));

    // API 호출 성공 시 결과 표시 및 맨 위로 스크롤
    if (fetchAuctions.fulfilled.match(result)) {
      setShowResults(true);
      // 검색 시에만 맨 위로 스크롤
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageChange = async (page: number) => {
    // 서버에서 해당 페이지 데이터 가져오기
    await dispatch(fetchAuctions({
      page,
      filters: filters
    }));

    // 페이지 변경 시에는 스크롤하지 않음 (현재 위치 유지)
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

          {loading && (
            <SpinnerWrapper>
              <Spinner text="Big API에서 경매 정보를 가져오는 중..." />
            </SpinnerWrapper>
          )}
        </HeroSection>

        <ContentSection>
          <Container>
            {error && (
              <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>
                오류 발생: {error}
                <br />
                <small>API 서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.</small>
              </div>
            )}
            {showResults && !error && (
              <>
                <AuctionList items={items} totalCount={totalElements} />
                <Pagination
                  currentPage={currentPage}
                  totalItems={totalElements}
                  itemsPerPage={20}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </Container>
        </ContentSection>
      </Main>
      <Footer />
    </>
  );
}

export default Home;
