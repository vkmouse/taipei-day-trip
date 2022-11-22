import styled from '@emotion/styled';
import React from 'react';
import { Secondery10 } from '../Styles/Colors';
import { BodyBold, H1 } from '../Styles/Typography';
import SearchBar from './SearchBar';

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
  height: 149px;
  margin: 0 10px 0 10px;
  padding: 10px;
  width: 1180px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const Slogal = styled.div`
  display: flex;
  flex-direction: column;
  height: 78px;
  width: 100%;
`;

const Title = styled.div`
  ${H1};
  color: ${Secondery10};
  display: flex;
  align-items: center;
`;

const Description = styled.span`
  ${BodyBold};
  color: ${Secondery10};
  align-items: end;
  display: flex;
  flex-grow: 1;
`;

const SearchBarContainer = styled.div`
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
          <SearchBarContainer>
            <SearchBar />
          </SearchBarContainer>
        </Container>
      </Content>
    </BannerStyle>
  );
};

export default Banner;
