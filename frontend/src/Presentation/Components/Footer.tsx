import styled from '@emotion/styled';
import React from 'react';
import { BodyBold } from '../Styles/Typography';

const Container = styled.footer`
  align-items: end;
  display: flex;
  flex-grow: 1;
`;

const FooterStyle = styled.div`
  ${BodyBold}
  background: #757575;
  display: flex;
  justify-content: center;
  padding-top: 45px;
  padding-bottom: 45px;
  color: white;
  width: 100%;
`;

const Footer = () => (
  <Container>
    <FooterStyle>
      COPYRIGHT © 2022 台北一日遊
    </FooterStyle>
  </Container>
);

export default Footer;
