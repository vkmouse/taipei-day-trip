import styled from '@emotion/styled';
import React from 'react';
import { BodyBold } from '../Styles/Typography';

const Container = styled.footer`
  display: flex;  
  align-items: end;
  flex-grow: 1;
`;

const Text = styled.div`
  ${BodyBold}
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 45px 0 45px 0;
  background: #757575;
  color: white;
`;

const Footer = () => (
  <Container>
    <Text>
      COPYRIGHT © 2022 台北一日遊
    </Text>
  </Container>
);

export default Footer;
