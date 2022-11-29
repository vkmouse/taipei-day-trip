import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { api } from '../../Core/API';
import { Attractions } from '../../Core/Core';
import { setData, setNextPage } from '../../Data/Slices/attractionSlice';
import { useAppDispatch, useAppSelector } from '../../Data/Store/hooks';
import AttractionListComponent from '../Components/AttractionListComponent';
import Banner from '../Components/Banner';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import { Header, Main } from '../Styles/SemanticStyles';

const AttractionNotFound = styled.img`
  width: 100%;
  height: 100%;
  max-width: 600px;
  content: url("attraction_not_found.png");
`;

const Loading = styled.img`
  content: url("loading.gif");
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-basis: 100%;
`;

function HomeView() {
  const attractions = useAppSelector(state => state.attraction.data);
  const nextPage = useAppSelector(state => state.attraction.nextPage);
  const keyword = useAppSelector(state => state.keyword.keyword);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const setAttractions = (body: Attractions) => {
    dispatch(setData(attractions.concat(body.data)));
    dispatch(setNextPage(body.nextPage));
  };

  const getNextPage = async (isLoading: boolean) => {
    const hasNext = nextPage !== null;
    if (hasNext && !isLoading) {
      setIsLoading(true);
      const body = await api.getAttractions(nextPage, keyword);
      setAttractions(body);
      setIsLoading(false);
    }
  };

  const createOberserver = () => {
    const target = document.querySelector('footer');
    if (target !== null) {
      const observer = new IntersectionObserver((entries, observer) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          getNextPage(isLoading);
        }
      }, { threshold: 0.5 });
      observer.observe(target);  
    }
  };

  useEffect(() => {
    if (isLoading) {
      window.scrollTo({ top: document.body.scrollHeight });
    } else {
      createOberserver();
    }
  }, [isLoading]);

  return (
    <>
      <Navigation />
      <Header>
        <Banner />
      </Header>
      <Main>
        <AttractionListComponent />
        <Container>
          {isLoading ? <Loading /> : <></>}
          {attractions.length === 0 && nextPage === null ? <AttractionNotFound /> : <></>}
        </Container>
      </Main>
      <Footer />
    </>
  );
}

export default HomeView;
