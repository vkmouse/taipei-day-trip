import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import { useAPIContext } from '../../../context/APIContext';
import { Attractions } from '../../../Core/Core';
import { setData, setNextPage } from '../../../Data/Slices/attractionSlice';
import { useAppSelector, useAppDispatch } from '../../../Data/Store/hooks';
import Footer from '../../Components/Footer';
import Navigation from '../../Components/Navigation';
import { Header, Main } from '../../Styles/SemanticStyles';
import AttractionListComponent from './AttractionListComponent';
import Banner from './Banner';

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
  const observer = useRef<IntersectionObserver>();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const api = useAPIContext();

  const setAttractions = (body: Attractions) => {
    dispatch(setData(attractions.concat(body.data)));
    dispatch(setNextPage(body.nextPage));
  };

  const getPage = async (nextPage: number | null, keyword: string) => {
    const hasNext = nextPage !== null;
    if (hasNext) {
      setIsLoading(true);
      const body = await api.getAttractions(nextPage, keyword);
      setAttractions(body);
      setIsLoading(false);
    }
  };

  const createOberserver = (nextPage: number | null, keyword: string) => {
    const target = document.querySelector('footer');
    if (target !== null) {
      observer.current = new IntersectionObserver((entries, observer) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          getPage(nextPage, keyword);
        }
      }, { threshold: 0.5 });
      observer.current.observe(target);  
    }
  };

  useEffect(() => {
    // Updating observer when "nextPage" or "keyword" changed.
    observer.current?.disconnect();
    createOberserver(nextPage, keyword);
  }, [nextPage, keyword]);

  useEffect(() => {
    if (isLoading) {
      window.scrollTo({ top: document.body.scrollHeight });
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
