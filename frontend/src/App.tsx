import { Global } from '@emotion/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { setAPI } from './Core/API';
// import API from './Data/DataSource/MockAPI';
import API from './Data/DataSource/RealAPI';
import store from './Data/Store/store';
import GlobalStyles from './Presentation/Styles/GlobalStyles';
import AttractionsView from './Presentation/Views/AttractionsView';
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
            <Route path='attractions'>
              <Route path=":attractionId"  element={<AttractionsView />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
