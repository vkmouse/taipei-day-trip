import React, { useEffect, useState } from 'react';
import { Attraction } from '../../Core/Core';
import { getAttractions } from '../../Data/DataSource/MockAPI';
import AttractionListComponent from '../Components/AttractionListComponent';
import Banner from '../Components/Banner';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import { Header, Main } from '../Styles/SemanticStyles';

function HomeView() {
  const [nextPage, setNextPage] = useState<number | null>(0);
  const [attractions, setAttractions] = useState<Attraction[]>([]);

  const getNextPage = async () => {
    if (nextPage !== null) {
      const body = await getAttractions(nextPage);
      setAttractions(attractions.concat(body.data));
      setNextPage(body.nextPage);
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
      <Header>
        <Navigation />
        <Banner />
      </Header>
      <Main>
        <AttractionListComponent {...{ attractions }} />
      </Main>
      <Footer />
    </>
  );
}

export default HomeView;
