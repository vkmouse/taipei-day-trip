import styled from "@emotion/styled";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import Carousel from "../components/Carousel";
import Navigation from "../components/Navigation";
import { Header, Main, Footer } from "../components/Semantic";
import { useAPIContext } from "../context/APIContext";
import { useAppSelector } from "../store/store";
import { Attraction } from "../types/AttractionTypes";
import { BodyMedium, Secondery, BodyBold } from "../utils/CommonStyles";

const Section = styled.section`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 39px 15px 40px 15px;
  border-top: 1px solid #e8e8e8;
  border-width: 1px;
  @media (max-width: 800px) {
    flex-wrap: wrap;
    padding: 0 0 40px 0;
  }
`;

const Article = styled.article`
  width: 100%;
  max-width: 1180px;
  border-top: 1px solid #e8e8e8;
  padding: 50px 10px 80px 10px;
`;

const Text = styled.div`
  ${BodyMedium}
  color: ${Secondery};
  line-height: 24px;
`;

const TextBold = styled.div`
  ${BodyBold}
  color: ${Secondery};
  padding-top: 20px;
  line-height: 28px;
`;

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
