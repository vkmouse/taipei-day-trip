import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import BookingForm from "../../components/BookingForm";
import Carousel from "../../components/Carousel";
import Navigation from "../../components/Navigation";
import { Header, Main, Footer } from "../../components/Semantic";
import { useAPIContext } from "../../context/APIContext";
import { useAppSelector } from "../../store/store";
import { Attraction } from "../../types/AttractionTypes";
import { Article, Section, Text, TextBold } from "./styles";

const AttractionPage = () => {
  const params = useParams();
  if (params.attractionId === undefined) {
    return <></>;
  }

  const id = parseInt(params.attractionId);
  const [attraction, setAttraction] = useState<Attraction>();
  const api = useAPIContext();
  const hasInit = useRef(false);
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  const getAttraction = async (id: number) => {
    if (hasInit.current) {
      return;
    }
    hasInit.current = true;

    const attraction = await api.getAttraction(id);
    setAttraction(attraction);
    document.title = attraction.name;
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
          <BookingForm attraction={attraction} isLoggedIn={isLoggedIn} />
        </Section>
      </Header>
      <Main>
        <Article>
          <Text>{attraction?.description}</Text>
          <TextBold>景點地址：</TextBold>
          <Text>{attraction?.address}</Text>
          <TextBold>交通方式：</TextBold>
          <Text>{attraction?.transport}</Text>
        </Article>
      </Main>
      <Footer />
    </>
  );
};

export default AttractionPage;
