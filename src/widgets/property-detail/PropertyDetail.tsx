import styled from 'styled-components';
import type { AuctionItem } from '../../entities/auction';
import { formatPrice, formatArea, formatDateRange } from '../../shared/lib';

const Container = styled.div`
  background: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #333333;
`;

const CaseNumber = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  background-color: ${(props) => {
    switch (props.$status) {
      case 'active':
        return '#e6f7ff';
      case 'completed':
        return '#fff7e6';
      case 'cancelled':
        return '#fff1f0';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case 'active':
        return '#1890ff';
      case 'completed':
        return '#faad14';
      case 'cancelled':
        return '#f5222d';
      default:
        return '#8c8c8c';
    }
  }};
`;

const Address = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 2rem 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const InfoCard = styled.div`
  background: #2a2a2a;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #333333;
`;

const InfoLabel = styled.div`
  font-size: 14px;
  color: #999999;
  margin-bottom: 0.5rem;
`;

const InfoValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
`;

interface PropertyDetailProps {
  item: AuctionItem | null;
}

const statusLabels = {
  active: '진행중',
  completed: '유찰',
  cancelled: '취소',
};

export const PropertyDetail = ({ item }: PropertyDetailProps) => {
  if (!item) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999999' }}>
          경매 물건 정보를 불러올 수 없습니다.
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <CaseNumber>{item.caseNumber}</CaseNumber>
        <StatusBadge $status={item.status}>{statusLabels[item.status]}</StatusBadge>
      </Header>

      <Address>📍 {item.address}</Address>

      <InfoGrid>
        <InfoCard>
          <InfoLabel>감정평가액</InfoLabel>
          <InfoValue>{formatPrice(item.appraisalPrice)}</InfoValue>
        </InfoCard>

        <InfoCard>
          <InfoLabel>최저매각가격</InfoLabel>
          <InfoValue>{formatPrice(item.minSalePrice)}</InfoValue>
        </InfoCard>

        <InfoCard>
          <InfoLabel>매수신청 보증금</InfoLabel>
          <InfoValue>{formatPrice(item.deposit)}</InfoValue>
        </InfoCard>

        {item.detailedAddress && (
          <InfoCard>
            <InfoLabel>목록2 소재지</InfoLabel>
            <InfoValue>{item.detailedAddress}</InfoValue>
          </InfoCard>
        )}

        {item.dividendDeadline && (
          <InfoCard>
            <InfoLabel>배당요구종기</InfoLabel>
            <InfoValue>{item.dividendDeadline}</InfoValue>
          </InfoCard>
        )}

        {item.claimAmount && (
          <InfoCard>
            <InfoLabel>청구금액</InfoLabel>
            <InfoValue>{formatPrice(item.claimAmount)}</InfoValue>
          </InfoCard>
        )}

        {item.courtSchedule && (
          <InfoCard>
            <InfoLabel>기일내역</InfoLabel>
            <InfoValue>{item.courtSchedule}</InfoValue>
          </InfoCard>
        )}

        {item.itemNote && (
          <InfoCard>
            <InfoLabel>물건비고</InfoLabel>
            <InfoValue style={{ fontSize: '14px', lineHeight: '1.5' }}>{item.itemNote}</InfoValue>
          </InfoCard>
        )}
      </InfoGrid>
    </Container>
  );
};

