import { css } from '@emotion/react';
import styled from '@emotion/styled';

const BodyBold = css`
  font-family: 'Noto Sans TC';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
`;

const BodyMedium = css`
  font-family: 'Noto Sans TC';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
`;

const H1 = styled.h1`
  font-family: 'Noto Sans TC';
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
  margin-block-start: 0;
  margin-block-end: 0;
`;

const H2 = styled.h2`
  font-family: 'Noto Sans TC';
  font-style: normal;
  font-weight: 700;
  font-size: 30px;
`;

export { BodyBold, BodyMedium, H1, H2 };
