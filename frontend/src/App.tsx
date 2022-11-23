import { Global } from '@emotion/react';
import React from 'react';
import { setAPI } from './Core/API';
import API from './Data/DataSource/MockAPI';
// import API from './Data/DataSource/RealAPI';
import GlobalStyles from './Presentation/Styles/GlobalStyles';
import HomeView from './Presentation/Views/HomeView';

function App() {
  setAPI(new API());
  return (
    <>
      <Global styles={GlobalStyles} />
      <HomeView />
    </>
  );
}

export default App;
