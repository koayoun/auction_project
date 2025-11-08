import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import type { AuctionItem } from '../../entities/auction';
import { formatPrice, formatArea, formatDateRange } from '../../shared/lib';
import { useAppDispatch } from '../../app/hooks';
import { setSelectedItem } from '../../features/auctions';

const Card = styled.div`
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #1890ff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CaseNumber = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 12px;
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

const Address = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #262626;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.span`
  font-size: 12px;
  color: #8c8c8c;
`;

const InfoValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #262626;
`;

interface AuctionCardProps {
  item: AuctionItem;
}

const statusLabels = {
  active: '진행중',
  completed: '유찰',
  cancelled: '취소',
};

export const AuctionCard = ({ item }: AuctionCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleClick = () => {
    // Redux에 선택된 아이템 저장
    dispatch(setSelectedItem(item));
    // Dashboard 페이지로 이동
    navigate('/dashboard');
  };

  return (
    <Card onClick={handleClick}>
      <CardHeader>
        <CaseNumber>{item.caseNumber}</CaseNumber>
        <StatusBadge $status={item.status}>{statusLabels[item.status]}</StatusBadge>
      </CardHeader>
      <Address>{item.address}</Address>
      <InfoGrid>
        <InfoItem>
          <InfoLabel>감정가</InfoLabel>
          <InfoValue>{formatPrice(item.appraisalPrice)}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>최저매각가격</InfoLabel>
          <InfoValue>{formatPrice(item.minSalePrice)}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>매수신청 보증금</InfoLabel>
          <InfoValue>{formatPrice(item.deposit)}</InfoValue>
        </InfoItem>
        {item.courtSchedule && (
          <InfoItem>
            <InfoLabel>기일내역</InfoLabel>
            <InfoValue>{item.courtSchedule}</InfoValue>
          </InfoItem>
        )}
      </InfoGrid>
    </Card>
  );
};

