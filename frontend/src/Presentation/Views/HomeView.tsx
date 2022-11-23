import React, { useEffect, useState } from 'react';
import { api } from '../../Core/API';
import { Attraction } from '../../Core/Core';
import { updateKeyword } from '../../Data/Slices/keywordSlice';
import { useAppDispatch, useAppSelector } from '../../Data/Store/hooks';
import AttractionListComponent from '../Components/AttractionListComponent';
import Banner from '../Components/Banner';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import { Header, Main } from '../Styles/SemanticStyles';

function HomeView() {
  const [nextPage, setNextPage] = useState<number | null>(0);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const keyword = useAppSelector(state => state.keyword.keyword);
  const dispatch = useAppDispatch();

  const getNextPage = async () => {
    if (nextPage !== null) {
      const body = await api.getAttractions(nextPage, keyword);
      setAttractions(attractions.concat(body.data));
      setNextPage(body.nextPage);
    }
  };

  const handleSearchBarClicked = () => {
    setNextPage(0);
    setAttractions([]);
    dispatch(updateKeyword());
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
        <Banner 
          onSearchButtonClick={handleSearchBarClicked}
        />
      </Header>
      <Main>
        <AttractionListComponent {...{ attractions }} />
      </Main>
      <Footer />
    </>
  );
}

export default HomeView;
