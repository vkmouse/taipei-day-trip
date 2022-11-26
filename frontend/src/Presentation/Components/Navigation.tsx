import styled from '@emotion/styled';
import React from 'react';
import { BodyMedium, H2 } from '../Styles/Typography';
import { Primary, Secondery } from '../Styles/Colors';

const Container = styled.nav`
  display: flex;  
  position: fixed;
  justify-content: center;
  z-index: 999;
  width: 100%;
  height: 54px;
  background: white;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 1200px;
  height: 100%;
  margin: 0 10px 0 10px;
`;

const Title = styled.button`
  ${H2};
  padding: 0;
  background-color: transparent;
  cursor: pointer;
  color: ${Primary};
  border-width: 0px;
`;

const Items = styled.div`
  display: flex;
`;

const Item = styled.button`
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
  return (
    <Container>
      <Content>
        <Title>台北一日遊</Title>
        <Items>
          <Item>預定行程</Item>
          <Item>登入/註冊</Item>
        </Items>
      </Content>
    </Container>
  );
};

export default Navigation;
