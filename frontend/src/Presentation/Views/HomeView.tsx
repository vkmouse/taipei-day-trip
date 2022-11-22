import React from 'react';
import Attractions from '../Components/Attractions';
import Banner from '../Components/Banner';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import { Header, Main } from '../Styles/SemanticStyles';

function HomeView() {
  return (
    <>
      <Header>
        <Navigation />
        <Banner />
      </Header>
      <Main>
        <Attractions />
      </Main>
      <Footer />
    </>
  );
}

export default HomeView;
