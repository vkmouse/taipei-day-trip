import { Global } from '@emotion/react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { APIProvider } from './context/APIContext';
import { AuthProvider } from './context/AuthContext';
import GlobalStyles from './Presentation/Styles/GlobalStyles';
import AttractionView from './pages/AttractionPage';
import HomeView from './pages/HomePage';

function App() {
  return (
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
  );
}

export default App;
