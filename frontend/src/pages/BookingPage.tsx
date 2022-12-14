import React from 'react';
import Navigation from '../components/Navigation';
import { Header, Main, Footer } from '../components/Semantic';

const BookingPage = () => {
  return (
    <>
      <Navigation />
      <Header>
        I am booking page header
      </Header>
      <Main>
        <p>I am booking page main</p>
      </Main>
      <Footer style={{ flexDirection: 'column' }} />
    </>
  );
};

export default BookingPage;
