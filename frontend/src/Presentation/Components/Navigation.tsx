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
`;

const Title = styled(H2)`
  ${Primary};
  cursor: pointer;
`;

const Items = styled.div`
  display: flex;
`;

const Item = styled.button`
  ${BodyMedium};
  ${Secondery};
  
  background-color: white;
  border-width: 0px;
  cursor: pointer;
  padding: 10px;
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
