import styled from '@emotion/styled';
import React from 'react';
import { Secondery10 } from '../Styles/Colors';
import { BodyBold, H1 } from '../Styles/Typography';
import SearchBar from './SearchBar';

const BannerStyle = styled.div`
  display: flex;  
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 320px;
  background: url("welcome.png");
  background-size: cover;
`;

const Content = styled.div`
  width: 1180px;
  height: 149px;
  margin: 0 10px 0 10px;
  padding: 10px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Slogal = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 78px;
`;

const Title = styled.div`
  ${H1};
  display: flex;
  align-items: center;
  color: ${Secondery10};
`;

const Description = styled.span`
  ${BodyBold};
  display: flex;
  align-items: end;
  flex-grow: 1;
  color: ${Secondery10};
`;

const SearchBarContainer = styled.div`
  display: flex;
  flex-grow: 1;  
  align-items: end;
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
