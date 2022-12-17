import { css } from '@emotion/react';

export const Primary = '#448899';
export const Secondery = '#666666';
export const Secondery10 = '#F8F8F8';
export const Secondery20 = '#E8E8E8';
export const Secondery50 = '#757575';
export const Secondery70 = '#666666';

export const CenterCropped = css`
  object-fit: cover;
  object-position: center;
`;

export const GlobalStyles = css`
  @import url(https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap);

  body {
    margin: 0;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
`;

export const AbsoluteBottom = css`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const AbsoluteFull = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const RatioContainer = css`
  position: relative;
  padding-top: 73%;
`;

export const BodyBold = css`
  font-family: 'Noto Sans TC';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
`;

export const BodyMedium = css`
  font-family: 'Noto Sans TC';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 23px;
`;

export const CategoryMedium = css`
  font-family: 'Noto Sans TC';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
`;

export const H1 = css`
  font-family: 'Noto Sans TC';
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
`;

export const H2 = css`
  font-family: 'Noto Sans TC';
  font-style: normal;
  font-weight: 700;
  font-size: 30px;
`;

export const H3 = css`
  font-family: 'Noto Sans TC';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
`;
