import styled from '@emotion/styled';
import React from 'react';
import { BodyMedium, H2 } from '../Styles/Typography';
import { Primary, Secondery } from '../Styles/Colors';

const NavigationContainer = styled.nav`
  background: white;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 54px;
  position: fixed;
  z-index: 999;
`;

const NavigationContent = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: space-between;
  margin: 0 10px 0 10px;
  width: 1200px;
`;

const Title = styled.button`
  ${H2};
  background-color: transparent;
  border-width: 0px;
  color: ${Primary};
  cursor: pointer;
  padding: 0;
`;

const Items = styled.div`
  display: flex;
`;

const Item = styled.button`
  ${BodyMedium};
  background-color: transparent;
  border-width: 0px;
  color: ${Secondery};
  cursor: pointer;
  padding: 10px;
  @media (max-width: 1200px) {
    &:last-child {
      padding-right: 0;
    }
  }
`;

const Navigation = () => {
  return (
    <NavigationContainer>
      <NavigationContent>
        <Title>台北一日遊</Title>
        <Items>
          <Item>預定行程</Item>
          <Item>登入/註冊</Item>
        </Items>
      </NavigationContent>
    </NavigationContainer>
  );
};

export default Navigation;
