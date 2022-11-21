import styled from '@emotion/styled';
import React from 'react';
import { BodyMedium, H2 } from '../Styles/Typography';
import { Primary, Secondery } from '../Styles/Colors';

const NavigationStyle = styled.div`
  align-items: center;
  display: flex;
  height: 54px;
  justify-content: space-between;
  width: 1200px;
  margin: 0 10px 0 10px;  
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
    <NavigationStyle>
      <Title>台北一日遊</Title>
      <Items>
        <Item>預定行程</Item>
        <Item>登入/註冊</Item>
      </Items>
    </NavigationStyle>
  );
};

export default Navigation;
