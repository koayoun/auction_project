import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #000000;
  color: white;
  padding: 0;
  border-bottom: 1px solid #333333;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;

  a {
    color: white;
    text-decoration: none;
    font-size: 14px;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Header = () => {
  return (
    <HeaderContainer>
      <Container>
        <Logo>경매 플랫폼</Logo>
        <Nav>
          <a href="#home">홈</a>
          <a href="#auctions">경매 목록</a>
          <a href="#about">소개</a>
          <a href="#contact">문의</a>
        </Nav>
      </Container>
    </HeaderContainer>
  );
};

