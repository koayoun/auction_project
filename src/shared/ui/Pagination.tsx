import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 1rem;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${(props) => (props.$active ? '#1890ff' : '#333333')};
  background-color: ${(props) => (props.$active ? '#1890ff' : 'transparent')};
  color: ${(props) => (props.$active ? '#000000' : '#ffffff')};
  border-radius: 4px;
  font-size: 14px;
  font-weight: ${(props) => (props.$active ? '600' : '400')};
  cursor: pointer;
  min-width: 40px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: #1890ff;
    background-color: ${(props) => (props.$active ? '#1890ff' : 'rgba(24, 144, 255, 0.1)')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  color: #999999;
  font-size: 14px;
  margin: 0 1rem;
`;

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  maxPageButtons?: number;
}

export const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage = 20,
  onPageChange,
  maxPageButtons = 5,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    return null; // 페이지가 1개 이하면 페이지네이션 표시 안 함
  }

  // 표시할 페이지 번호 범위 계산
  const getPageNumbers = () => {
    const pages: number[] = [];
    const halfRange = Math.floor(maxPageButtons / 2);

    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, currentPage + halfRange);

    // 시작 페이지 조정
    if (endPage - startPage + 1 < maxPageButtons) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <PaginationContainer>
      <PageButton
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        title="첫 페이지"
      >
        ««
      </PageButton>

      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="이전 페이지"
      >
        «
      </PageButton>

      {pageNumbers[0] > 1 && (
        <>
          <PageButton onClick={() => onPageChange(1)}>1</PageButton>
          {pageNumbers[0] > 2 && <PageInfo>...</PageInfo>}
        </>
      )}

      {pageNumbers.map((page) => (
        <PageButton
          key={page}
          $active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </PageButton>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <PageInfo>...</PageInfo>}
          <PageButton onClick={() => onPageChange(totalPages)}>{totalPages}</PageButton>
        </>
      )}

      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="다음 페이지"
      >
        »
      </PageButton>

      <PageButton
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        title="마지막 페이지"
      >
        »»
      </PageButton>

      <PageInfo>
        {currentPage} / {totalPages} 페이지 (총 {totalItems}건)
      </PageInfo>
    </PaginationContainer>
  );
};
