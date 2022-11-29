import { Global } from '@emotion/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { setAPI } from './Core/API';
// import API from './Data/DataSource/MockAPI';
import API from './Data/DataSource/RealAPI';
import store from './Data/Store/store';
import GlobalStyles from './Presentation/Styles/GlobalStyles';
import AttractionView from './Presentation/Views/AttractionView';
import HomeView from './Presentation/Views/HomeView';

function App() {
  setAPI(new API());
  return (
    <Provider store={store}>
      <Global styles={GlobalStyles} />
      <Router>
        <Routes>
          <Route path='/'>
            <Route index element={<HomeView />} />
            <Route path='attraction'>
              <Route path=":attractionId"  element={<AttractionView />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
