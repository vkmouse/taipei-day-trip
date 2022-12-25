import styled from "@emotion/styled";
import React, { CSSProperties } from "react";
import { BodyBold } from "../utils/CommonStyles";

const Container = styled.footer`
  display: flex;
  align-items: end;
  flex-grow: 1;
  margin-top: 40px;
`;

const Text = styled.div`
  ${BodyBold}
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 45px 0 45px 0;
  background: #757575;
  color: white;
  flex-grow: 1;
`;

const Footer = (props: { style?: CSSProperties }) => (
  <Container {...props}>
    <Text>COPYRIGHT © 2022 台北一日遊</Text>
  </Container>
);

const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 54px;
`;

const Main = styled.main`
  display: flex;
  justify-content: center;
  flex-flow: wrap;
`;

export { Header, Main, Footer };
