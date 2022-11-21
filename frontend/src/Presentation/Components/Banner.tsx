import styled from '@emotion/styled';
import React from 'react';
import { BodyMedium, H2 } from '../Styles/Typography';
import { Primary, Secondery } from '../Styles/Colors';

const BannerStyle = styled.div`
  align-items: center;
  display: flex;
  height: 320px;
  justify-content: space-between;
  width: 100%;
`;

const BackgroundImage = styled.img`
  content: url("welcome.png");
  height: 100%;
  object-fit: cover;
  object-position: left top;
  width: 100%;
`;

const Banner = () => {
  return (
    <BannerStyle>
      <BackgroundImage />
    </BannerStyle>
  );
};

export default Banner;
