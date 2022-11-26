import styled from '@emotion/styled';
import React from 'react';
import { BodyMedium, H2 } from '../Styles/Typography';
import { Primary, Secondery } from '../Styles/Colors';
import { Link, useLocation } from 'react-router-dom';

const Container = styled.nav`
  display: flex;  
  position: fixed;
  justify-content: center;
  z-index: 999;
  width: 100%;
  height: 54px;
  background: white;
`;

const Navbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 1200px;
  height: 100%;
  margin: 0 10px 0 10px;
`;

const NavBrand = styled(Link)`
  ${H2};
  padding: 0;
  background-color: transparent;
  cursor: pointer;
  color: ${Primary};
  border-width: 0px;
  text-decoration: none;
`;

const NavItems = styled.div`
  display: flex;
`;

const NavItem = styled.button`
  ${BodyMedium};
  padding: 10px;
  background-color: transparent;
  cursor: pointer;
  color: ${Secondery};
  border-width: 0px;
  @media (max-width: 1200px) {
    &:last-child {
      padding-right: 0;
    }
  }
`;

const Navigation = () => {
  const location = useLocation();
  
  const handleBrandClicked = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Container>
      <Navbar>
        <NavBrand to="/" onClick={handleBrandClicked}>台北一日遊</NavBrand>
        <NavItems>
          <NavItem>預定行程</NavItem>
          <NavItem>登入/註冊</NavItem>
        </NavItems>
      </Navbar>
    </Container>
  );
};

export default Navigation;
