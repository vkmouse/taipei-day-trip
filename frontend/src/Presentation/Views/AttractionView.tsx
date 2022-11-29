import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../Core/API';
import Carousel from '../Components/Carousel';
import Navigation from '../Components/Navigation';
import { Header } from '../Styles/SemanticStyles';
import BookingForm from '../Components/BookingForm';
import { Attraction } from '../../Core/Core';
import styled from '@emotion/styled';

const Section = styled.section`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 39px 15px 40px 15px;
  border-top: 1px solid #E8E8E8;
  border-width: 1px;
  @media (max-width: 800px) {
    flex-wrap: wrap;
    padding: 0 0 40px 0;
  }
`;

function AttractionView() {
  const params = useParams();
  if (params.attractionId === undefined) {
    return <></>;
  }

  const id = parseInt(params.attractionId);
  const [attraction, setAttraction] = useState<Attraction>();

  const getAttraction = async (id: number) => {
    const attraction = await api.getAttraction(id);
    setAttraction(attraction);
  };

  useEffect(() => {
    getAttraction(id);
  }, []);

  return (
    <>
      <Navigation />
      <Header>
        <Section>
          <Carousel attraction={attraction} />
          <BookingForm attraction={attraction} />
        </Section>
      </Header>
    </>
  );
}

export default AttractionView;
