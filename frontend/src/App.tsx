import { Global } from '@emotion/react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { APIProvider } from './context/APIContext';
import { AuthProvider } from './context/AuthContext';
import AttractionPage from './pages/AttractionPage';
import BookingPage from './pages/BookingPage';
import HomePage from './pages/HomePage';
import { GlobalStyles } from './utils/CommonStyles';

function App() {
  return (
    <APIProvider>
    {/* <APIProvider isMock> */}
      <AuthProvider>
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
      </AuthProvider>
    </APIProvider>
  );
}

export default App;
