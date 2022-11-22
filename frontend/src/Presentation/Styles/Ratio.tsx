import { css } from "@emotion/react";

const AbsoluteBottom = css`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

const AbsoluteFull = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const RatioContainer = css`
  position: relative;
  padding-top: 73%;
`;

export { AbsoluteBottom, AbsoluteFull, RatioContainer };
