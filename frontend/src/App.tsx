import { Global } from "@emotion/react";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { APIProvider } from "./context/APIContext";
import { LoginRegisterProvider } from "./context/LoginRegisterContext";
import { PurchasedOrderProvider } from "./context/PurchasedOrderContext";
import AttractionPage from "./pages/AttractionPage";
import BookingPage from "./pages/BookingPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ThankYouPage from "./pages/ThankYouPage";
import store from "./store/store";
import { GlobalStyles } from "./utils/CommonStyles";

function App() {
  return (
    <Provider store={store}>
      <APIProvider>
        {/* <APIProvider isMock> */}
        <LoginRegisterProvider>
          <Global styles={GlobalStyles} />
          <PurchasedOrderProvider>
            <Router>
              <Routes>
                <Route path="/">
                  <Route index element={<HomePage />} />
                  <Route path="attraction">
                    <Route path=":attractionId" element={<AttractionPage />} />
                  </Route>
                  <Route path="booking" element={<BookingPage />} />
                  <Route path="thankyou" element={<ThankYouPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Router>
          </PurchasedOrderProvider>
        </LoginRegisterProvider>
      </APIProvider>
    </Provider>
  );
}

export default App;
