import React, { useRef, useState, useEffect, useReducer } from 'react';
import AttractionsList from './AttractionsList';
import Navigation from '../../components/Navigation';
import SearchBar from '../../components/SearchBar';
import { Header, Main, Footer } from '../../components/Semantic';
import { useAPIContext } from '../../context/APIContext';
import { Attraction, Attractions } from '../../types/AttractionTypes';
import { BannerContainer, BannerContent, BannerContentContainer, BannerSlogan, BannerTitle, BannerDescription, SearchBarContainer, Container, Loading, AttractionsNotFound } from './styles';

type State = {
  attractions: Attraction[]
  keyword: string
  nextPage: number | null
  searchText: string
}

enum Type {
  ADD_ATTRACTIONS,
  SET_SEARCH_TEXT,
  UPDATE_KEYWORD,
}

type Action = { type: Type, payload?: any };
const addAttractions = (props: Attractions): Action => { return { type: Type.ADD_ATTRACTIONS, payload: props }; };
const setSearchText = (value: string): Action => { return { type: Type.SET_SEARCH_TEXT, payload: value }; };
const updateKeyword = (): Action => { return { type: Type.UPDATE_KEYWORD }; };

const initialState: State = {
  attractions: [],
  keyword: '',
  nextPage: 0,
  searchText: '',
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Type.ADD_ATTRACTIONS: {
      const body = action.payload as Attractions;
      const attractions = state.attractions.concat(body.data);
      const nextPage = body.nextPage;
      return { ...state, attractions, nextPage };
    }
    case Type.SET_SEARCH_TEXT: {
      const searchText = action.payload as string;
      return { ...state, searchText };
    }
    case Type.UPDATE_KEYWORD: {
      return { ...state, keyword: state.searchText, attractions: [], nextPage: 0 };
    }
    default: {
      return state;
    }
  }
};

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const api = useAPIContext();
  const observer = useRef<IntersectionObserver>();

  const getPage = async (nextPage: number | null, keyword: string) => {
    const hasNext = nextPage !== null;
    if (hasNext) {
      setIsLoading(true);
      const body = await api.getAttractions(nextPage, keyword);
      dispatch(addAttractions(body));
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
    createOberserver(state.nextPage, state.keyword);
  }, [state.nextPage, state.keyword]);

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
                  searchInputText={state.searchText}
                  onSearchButtonClick={() => dispatch(updateKeyword())}
                  onSearchInputTextChanged={text => dispatch(setSearchText(text))}
                />
              </SearchBarContainer>
            </BannerContentContainer>
          </BannerContent>
        </BannerContainer>
      </Header>
      <Main>
        <AttractionsList attractions={state.attractions} />
        <Container>
          {isLoading ? <Loading /> : <></>}
          {state.attractions.length === 0 && state.nextPage === null ? <AttractionsNotFound /> : <></>}
        </Container>
      </Main>
      <Footer />
    </>
  );
};

export default HomePage;
