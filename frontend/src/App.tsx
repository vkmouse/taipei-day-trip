import { Global } from '@emotion/react';
import React from 'react';
import { Provider } from 'react-redux';
import { setAPI } from './Core/API';
// import API from './Data/DataSource/MockAPI';
import API from './Data/DataSource/RealAPI';
import store from './Data/Store/store';
import GlobalStyles from './Presentation/Styles/GlobalStyles';
import HomeView from './Presentation/Views/HomeView';

function App() {
  setAPI(new API());
  return (
    <Provider store={store}>
      <Global styles={GlobalStyles} />
      <HomeView />
    </Provider>
  );
}

export default App;
