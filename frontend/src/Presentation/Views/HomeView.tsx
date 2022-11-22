import React from 'react';
import AttractionListComponent from '../Components/AttractionListComponent';
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
        <AttractionListComponent />
      </Main>
      <Footer />
    </>
  );
}

export default HomeView;
