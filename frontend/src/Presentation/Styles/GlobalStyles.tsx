import { css } from "@emotion/react";

const GlobalStyles = css`
  @import url(https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap);

  body {
    margin: 0;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
`;

export default GlobalStyles;
