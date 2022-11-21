import React from 'react';
import Banner from '../Components/Banner';
import Navigation from '../Components/Navigation';
import { Header } from '../Styles/SemanticStyles';

function HomeView() {
  return (
    <>
      <Header>
        <Navigation />
        <Banner />
      </Header>
    </>
  );
}

export default HomeView;
