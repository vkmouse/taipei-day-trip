import { Global } from '@emotion/react';
import React from 'react';
import GlobalStyles from './Presentation/Styles/GlobalStyles';
import HomeView from './Presentation/Views/HomeView';

function App() {
  return (
    <>
      <Global styles={GlobalStyles} />
      <HomeView />
    </>
  );
}

export default App;
