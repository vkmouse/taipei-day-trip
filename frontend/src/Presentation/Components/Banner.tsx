import styled from '@emotion/styled';
import React from 'react';
import { Secondery10 } from '../Styles/Colors';
import { BodyBold, H1 } from '../Styles/Typography';

const BannerStyle = styled.div`
  align-items: center;
  background: url("welcome.png");
  background-size: cover;
  display: flex;
  height: 320px;
  justify-content: center;
  width: 100%;
`;

const Content = styled.div`
  background-color: Red;
  height: 149px;
  width: 1180px;
  padding: 10px;
`;

const Container = styled.div`
  background-color: Blue;
  height: 100%;
  width: 100%;
`;

const Slogal = styled.div`
  background-color: Green;
  display: flex;
  flex-direction: column;
  height: 78px;
  width: 100%;
`;

const Title = styled(H1)`
  ${Secondery10};
  display: flex;
  align-items: center;
`;

const Description = styled.span`
  ${BodyBold};
  ${Secondery10};
  align-items: end;
  display: flex;
  flex-grow: 1;
`;

const Banner = () => {
  return (
    <BannerStyle>
      <Content>
        <Container>
          <Slogal>
            <Title>輕鬆享受台北一日悠閒</Title>
            <Description>探索每個角落，體驗城市的深度旅遊行程</Description>
          </Slogal>
        </Container>
      </Content>
    </BannerStyle>
  );
};

export default Banner;
