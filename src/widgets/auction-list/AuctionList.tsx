import styled from 'styled-components';
import type { AuctionItem } from '../../entities/auction';
import { AuctionCard } from './AuctionCard';

const Container = styled.div`
  margin-top: 2rem;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #ffffff;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #999999;
`;

interface AuctionListProps {
  items: AuctionItem[];
}

export const AuctionList = ({ items }: AuctionListProps) => {
  if (items.length === 0) {
    return (
      <Container>
        <EmptyState>검색 결과가 없습니다.</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>경매 물건 목록 (총 {items.length}건)</Title>
      <Grid>
        {items.map((item) => (
          <AuctionCard key={item.id} item={item} />
        ))}
      </Grid>
    </Container>
  );
};

