import React, { useEffect } from 'react';
import { api } from '../../Core/API';
import { setData, setNextPage } from '../../Data/Slices/attractionSlice';
import { useAppDispatch, useAppSelector } from '../../Data/Store/hooks';
import AttractionListComponent from '../Components/AttractionListComponent';
import Banner from '../Components/Banner';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import { Header, Main } from '../Styles/SemanticStyles';

function HomeView() {
  const attractions = useAppSelector(state => state.attraction.data);
  const nextPage = useAppSelector(state => state.attraction.nextPage);
  const keyword = useAppSelector(state => state.keyword.keyword);
  const dispatch = useAppDispatch();

  const getNextPage = async () => {
    if (nextPage !== null) {
      const body = await api.getAttractions(nextPage, keyword);
      dispatch(setData(attractions.concat(body.data)));
      dispatch(setNextPage(body.nextPage));
    }
  };

  const registerOberserver = (target: Element) => {
    const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      if (entries[0].isIntersecting) {
        observer.unobserve(target);
        getNextPage();
      }
    };
    const observer = new IntersectionObserver(callback, { threshold: [0.1] });
    observer.observe(target);
  };

  const handleIntersection = () => {
    const target = document.querySelector('footer');
    if (nextPage !== null && target !== null) {
      registerOberserver(target);
    }
  };

  useEffect(() => {
    handleIntersection();
  }, [attractions]);

  return (
    <>
      <Navigation />
      <Header>
        <Banner />
      </Header>
      <Main>
        <AttractionListComponent />
      </Main>
      <Footer />
    </>
  );
}

export default HomeView;
