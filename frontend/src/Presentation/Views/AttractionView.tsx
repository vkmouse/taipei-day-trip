import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../Core/API';
import { Attraction } from '../../Core/Core';
import Navigation from '../Components/Navigation';
import { Header } from '../Styles/SemanticStyles';

function AttractionView() {
  const params = useParams();
  if (params.attractionId === undefined) {
    return <></>;
  }

  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const id = parseInt(params.attractionId);
  const getAttraction = async () => {
    const attraction = await api.getAttraction(id);
    setAttraction(attraction);
  };

  useEffect(() => {
    getAttraction();
  }, []);

  return (
    <>
      <Navigation />
      <Header>
        <div>
          <div>{attraction?.id}</div>
          <div>{attraction?.name}</div>
          <div>{attraction?.description}</div>
          <div>{attraction?.address}</div>
          <div>{attraction?.lat}</div>
          <div>{attraction?.lng}</div>
          <div>{attraction?.transport}</div>
          <div>{attraction?.images}</div>
          <div>{attraction?.category}</div>
          <div>{attraction?.mrt}</div>
        </div>
      </Header>
    </>
  );
}

export default AttractionView;
