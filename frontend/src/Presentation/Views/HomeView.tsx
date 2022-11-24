import styled from '@emotion/styled';
import React, { useEffect, useRef } from 'react';
import { api } from '../../Core/API';
import { setData, setIsLoading, setNextPage } from '../../Data/Slices/attractionSlice';
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
  const isLoading = useAppSelector(state => state.attraction.isLoading);
  const keyword = useAppSelector(state => state.keyword.keyword);
  const dispatch = useAppDispatch();
  const isLoadingRef = useRef<boolean>(false);

  const getNextPage = async () => {
    // state of "nextPage" should be monitor
    const hasNext = nextPage !== null;
    if (hasNext && !isLoadingRef.current) {
      isLoadingRef.current = true;
      dispatch(setIsLoading(true));
      const body = await api.getAttractions(nextPage, keyword);
      dispatch(setData(attractions.concat(body.data)));
      dispatch(setNextPage(body.nextPage));
      dispatch(setIsLoading(false));
      isLoadingRef.current = false;
    }
  };

  const callback = (entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting) {
      getNextPage();
    }
  };

  const createObserver = () => {
    return new IntersectionObserver(callback, { threshold: 0.5 });
  };

  // create persist observer variable
  const observer = useRef<IntersectionObserver>(createObserver());

  useEffect(() => {
    // remove and create new observer when attractions changed
    // we need to re-create because next page variable should be updated
    // if we do not re-create, next page variable is always zero
    observer.current.disconnect();
    observer.current = createObserver();
    const target = document.querySelector('footer');
    if (target !== null) {
      observer.current.observe(target);
    }
  }, [attractions]);

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
