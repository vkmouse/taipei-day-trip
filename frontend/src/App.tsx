import { Global } from '@emotion/react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/APIContext';
import { LoginRegisterProvider } from './context/LoginRegisterContext';
import AttractionPage from './pages/AttractionPage';
import BookingPage from './pages/BookingPage';
import HomePage from './pages/HomePage';
import { GlobalStyles } from './utils/CommonStyles';

function App() {
  return (
    <AuthProvider>
    {/* <AuthProvider isMock> */}
      <LoginRegisterProvider>
        <Global styles={GlobalStyles} />
        <Router>
          <Routes>
            <Route path='/'>
              <Route index element={<HomePage />} />
              <Route path='attraction'>
                <Route path=':attractionId'  element={<AttractionPage />} />
              </Route>
              <Route path='booking' element={<BookingPage />} />
            </Route>
          </Routes>
        </Router>
      </LoginRegisterProvider>
    </AuthProvider>
  );
}

export default App;
