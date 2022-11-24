import styled from '@emotion/styled';
import React, { useEffect, useRef } from 'react';
import { api } from '../../Core/API';
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

function HomeView() {
  const attractions = useAppSelector(state => state.attraction.data);
  const nextPage = useAppSelector(state => state.attraction.nextPage);
  const keyword = useAppSelector(state => state.keyword.keyword);
  const dispatch = useAppDispatch();

  const getNextPage = async () => {
    // state of "nextPage" should be monitor
    if (nextPage !== null) {
      const body = await api.getAttractions(nextPage, keyword);
      dispatch(setData(attractions.concat(body.data)));
      dispatch(setNextPage(body.nextPage));
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
        {attractions.length > 0 ? <AttractionListComponent /> : <AttractionNotFound />}
      </Main>
      <Footer />
    </>
  );
}

export default HomeView;
