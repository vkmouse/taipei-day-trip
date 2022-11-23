import { css } from "@emotion/react";

const GlobalStyles = css`
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

export default GlobalStyles;
