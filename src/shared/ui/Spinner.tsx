import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
`;

const SpinnerCircle = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`;

const SpinnerText = styled.p`
  color: #ffffff;
  font-size: 14px;
  margin: 0;
`;

interface SpinnerProps {
  text?: string;
}

export const Spinner = ({ text = '로딩중...' }: SpinnerProps) => {
  return (
    <SpinnerContainer>
      <SpinnerCircle />
      <SpinnerText>{text}</SpinnerText>
    </SpinnerContainer>
  );
};

