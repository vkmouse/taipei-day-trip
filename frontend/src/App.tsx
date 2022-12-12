import { Global } from '@emotion/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { APIProvider } from './context/APIContext';
import { AuthProvider } from './context/AuthContext';
import store from './Data/Store/store';
import GlobalStyles from './Presentation/Styles/GlobalStyles';
import AttractionView from './Presentation/Views/AttractionView';
import HomeView from './pages/HomePages';

function App() {
  return (
    <Provider store={store}>
      <APIProvider>
      {/* <APIProvider isMock> */}
        <AuthProvider>
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
        </AuthProvider>
      </APIProvider>
    </Provider>
  );
}

export default App;
