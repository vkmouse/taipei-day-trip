import React, { useRef, useState, useEffect } from 'react';
import AttractionsList from './AttractionsList';
import Navigation from '../../components/Navigation';
import SearchBar from '../../components/SearchBar';
import { Header, Main, Footer } from '../../components/Semantic';
import { useAPIContext } from '../../context/APIContext';
import { Attraction } from '../../types/AttractionTypes';
import { BannerContainer, BannerContent, BannerContentContainer, BannerSlogan, BannerTitle, BannerDescription, SearchBarContainer, Container, Loading, AttractionsNotFound } from './styles';

const HomePage = () => {
  const observer = useRef<IntersectionObserver>();
  const [isLoading, setIsLoading] = useState(false);
  const api = useAPIContext();
  const [searchInputText, setSearchInputText] = useState('');
  const keyword = useRef('');
  const nextPage = useRef<number | null>(0);
  const [attractions, setAttractions] = useState<Attraction[]>([]);

  const getPage = async (newNextPage: number | null, keyword: string) => {
    const hasNext = newNextPage !== null;
    if (hasNext) {
      setIsLoading(true);
      const body = await api.getAttractions(newNextPage, keyword);
      setAttractions(attractions => attractions.concat(body.data));
      nextPage.current = body.nextPage;
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
    // Updating observer when 'nextPage' or 'keyword' changed.
    observer.current?.disconnect();
    createOberserver(nextPage.current, keyword.current);
  }, [nextPage.current, keyword.current]);

  useEffect(() => {
    if (isLoading) {
      window.scrollTo({ top: document.body.scrollHeight });
    }
  }, [isLoading]);

  useEffect(() => {
    document.title = '台北一日遊 - 首頁';
  }, []);

  return (
    <>
      <Navigation />
      <Header>
        <BannerContainer>
          <BannerContent>
            <BannerContentContainer>
              <BannerSlogan>
                <BannerTitle>輕鬆享受台北一日悠閒</BannerTitle>
                <BannerDescription>探索每個角落，體驗城市的深度旅遊行程</BannerDescription>
              </BannerSlogan>
              <SearchBarContainer>
                <SearchBar
                  searchInputText={searchInputText}
                  onSearchButtonClick={() => {
                    setAttractions([]);
                    nextPage.current = 0;
                    keyword.current = searchInputText;
                  }}
                  onSearchInputTextChanged={text => setSearchInputText(text)}
                />
              </SearchBarContainer>
            </BannerContentContainer>
          </BannerContent>
        </BannerContainer>
      </Header>
      <Main>
        <AttractionsList attractions={attractions} />
        <Container>
          {isLoading ? <Loading /> : <></>}
          {attractions.length === 0 && nextPage === null ? <AttractionsNotFound /> : <></>}
        </Container>
      </Main>
      <Footer />
    </>
  );
};

export default HomePage;
