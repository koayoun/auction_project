import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #1a1a1a;
  padding: 2rem 0;
  margin-top: 4rem;
  border-top: 1px solid #333333;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const Copyright = styled.p`
  margin: 0;
  color: #999999;
  font-size: 14px;
`;

export const Footer = () => {
  return (
    <FooterContainer>
      <Container>
        <Copyright>&copy; 2025 경매 플랫폼. All rights reserved.</Copyright>
      </Container>
    </FooterContainer>
  );
};

