import React from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '../Components/Navigation';
import { Header } from '../Styles/SemanticStyles';

function AttractionView() {
  const params = useParams();
  return (
    <>
      <Navigation />
      <Header>
        <div>{params.attractionId}</div>
      </Header>
    </>
  );
}

export default AttractionView;
