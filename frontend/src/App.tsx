import { Global } from '@emotion/react';
import React from 'react';
import { setAPI } from './Core/API';
import MockAPI from './Data/DataSource/MockAPI';
import GlobalStyles from './Presentation/Styles/GlobalStyles';
import HomeView from './Presentation/Views/HomeView';

function App() {
  setAPI(new MockAPI());
  return (
    <>
      <Global styles={GlobalStyles} />
      <HomeView />
    </>
  );
}

export default App;
