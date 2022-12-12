import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import { useAPIContext } from '../context/APIContext';
import { Attractions } from '../Core/Core';
import { setData, setNextPage } from '../Data/Slices/attractionSlice';
import { useAppSelector, useAppDispatch } from '../Data/Store/hooks';
import Footer from '../Presentation/Components/Footer';
import Navigation from '../components/Navigation';
import { Header, Main } from '../Presentation/Styles/SemanticStyles';
import AttractionsList from '../components/AttractionsList';
import SearchBar from '../components/SearchBar';
import { Secondery10 } from '../Presentation/Styles/Colors';
import { H1, BodyBold } from '../Presentation/Styles/Typography';

const AttractionsNotFound = styled.img`
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


const BannerContainer = styled.div`
  display: flex;  
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 320px;
  background: url("welcome.png");
  background-size: cover;
`;

const BannerContent = styled.div`
  width: 1180px;
  height: 149px;
  margin: 0 10px 0 10px;
  padding: 10px;
`;

const BannerContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const BannerSlogan = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 78px;
`;

const BannerTitle = styled.div`
  ${H1};
  display: flex;
  align-items: center;
  color: ${Secondery10};
`;

const BannerDescription = styled.span`
  ${BodyBold};
  display: flex;
  align-items: end;
  flex-grow: 1;
  color: ${Secondery10};
`;

const SearchBarContainer = styled.div`
  display: flex;
  flex-grow: 1;  
  align-items: end;
`;

function HomeView() {
  const attractions = useAppSelector(state => state.attraction.data);
  const nextPage = useAppSelector(state => state.attraction.nextPage);
  const observer = useRef<IntersectionObserver>();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const api = useAPIContext();
  const [searchInputText, setSearchInputText] = useState('');
  const keyword = useRef('');

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
    createOberserver(nextPage, keyword.current);
  }, [nextPage, keyword.current]);

  useEffect(() => {
    if (isLoading) {
      window.scrollTo({ top: document.body.scrollHeight });
    }
  }, [isLoading]);

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
                    dispatch(setNextPage(0));
                    dispatch(setData([]));
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
        <AttractionsList />
        <Container>
          {isLoading ? <Loading /> : <></>}
          {attractions.length === 0 && nextPage === null ? <AttractionsNotFound /> : <></>}
        </Container>
      </Main>
      <Footer />
    </>
  );
}

export default HomeView;
