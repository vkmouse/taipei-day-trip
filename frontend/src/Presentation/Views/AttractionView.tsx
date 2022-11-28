import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../Core/API';
import { Attraction } from '../../Core/Core';
import Carousel from '../Components/Carousel';
import Navigation from '../Components/Navigation';
import { Header } from '../Styles/SemanticStyles';

function AttractionView() {
  const params = useParams();
  if (params.attractionId === undefined) {
    return <></>;
  }

  const id = parseInt(params.attractionId);
  const [images, setImages] = useState<string[]>([]);

  const getAttraction = async (id: number) => {
    const attraction = await api.getAttraction(id);
    setImages(attraction.images);
  };

  useEffect(() => {
    getAttraction(id);
  }, []);

  return (
    <>
      <Navigation />
      <Header>
        <Carousel images={images}></Carousel>
      </Header>
    </>
  );
}

export default AttractionView;
