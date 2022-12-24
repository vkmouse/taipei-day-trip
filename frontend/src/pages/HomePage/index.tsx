import React, { useRef, useState, useEffect, useReducer } from "react";
import AttractionsList from "./AttractionsList";
import Navigation from "../../components/Navigation";
import SearchBar from "../../components/SearchBar";
import { Header, Main, Footer } from "../../components/Semantic";
import { useAPIContext } from "../../context/APIContext";
import { Attraction, Attractions } from "../../types/AttractionTypes";
import {
  BannerContainer,
  BannerContent,
  BannerContentContainer,
  BannerSlogan,
  BannerTitle,
  BannerDescription,
  SearchBarContainer,
  Container,
  AttractionsNotFound,
} from "./styles";
import Loader from "../../components/Loader";

type State = {
  attractions: Attraction[];
  keyword: string;
  nextPage: number | null;
  loading: boolean;
  loadedCount: number;
  response: Attractions | null;
  searchText: string;
};

enum Type {
  APPLY_RESPONSE,
  INCREMENT_LOADED_COUNT,
  SET_RESPONSE,
  SET_SEARCH_TEXT,
  START_LOADING,
  STOP_LOADING,
  UPDATE_KEYWORD,
}

type Action = { type: Type; payload?: any };
const applyResponse = (): Action => {
  return { type: Type.APPLY_RESPONSE };
};
const incrementLoadedCount = (): Action => {
  return { type: Type.INCREMENT_LOADED_COUNT };
};
const setResponse = (props: Attractions): Action => {
  return { type: Type.SET_RESPONSE, payload: props };
};
const setSearchText = (value: string): Action => {
  return { type: Type.SET_SEARCH_TEXT, payload: value };
};
const startLoading = (): Action => {
  return { type: Type.START_LOADING };
};
const stopLoading = (): Action => {
  return { type: Type.STOP_LOADING };
};
const updateKeyword = (): Action => {
  return { type: Type.UPDATE_KEYWORD };
};

const initialState: State = {
  attractions: [],
  keyword: "",
  nextPage: 0,
  loading: false,
  loadedCount: 0,
  response: null,
  searchText: "",
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Type.APPLY_RESPONSE: {
      if (state.response !== null) {
        const attractions = state.attractions.concat(state.response.data);
        const nextPage = state.response.nextPage;
        return { ...state, attractions, nextPage, response: null };
      }
      return state;
    }
    case Type.INCREMENT_LOADED_COUNT: {
      return { ...state, loadedCount: state.loadedCount + 1 };
    }
    case Type.SET_RESPONSE: {
      const response = action.payload as Attractions;
      return { ...state, response };
    }
    case Type.SET_SEARCH_TEXT: {
      const searchText = action.payload as string;
      return { ...state, searchText };
    }
    case Type.START_LOADING: {
      return { ...state, loading: true, loadedCount: 0 };
    }
    case Type.STOP_LOADING: {
      return { ...state, loading: false };
    }
    case Type.UPDATE_KEYWORD: {
      return {
        ...state,
        keyword: state.searchText,
        attractions: [],
        nextPage: 0,
      };
    }
    default: {
      return state;
    }
  }
};

const HomePage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const api = useAPIContext();
  const observer = useRef<IntersectionObserver>();

  const getPage = async (nextPage: number | null, keyword: string) => {
    const hasNext = nextPage !== null;
    if (hasNext) {
      dispatch(startLoading());
      const body = await api.getAttractions(nextPage, keyword);
      dispatch(setResponse(body));
      if (body.data.length === 0) {
        dispatch(applyResponse());
        dispatch(stopLoading());
      }
    }
  };

  const createOberserver = (nextPage: number | null, keyword: string) => {
    const target = document.querySelector("footer");
    if (target !== null) {
      observer.current = new IntersectionObserver(
        (entries, observer) => {
          if (entries[0].isIntersecting) {
            observer.disconnect();
            getPage(nextPage, keyword);
          }
        },
        { threshold: 0.5 }
      );
      observer.current.observe(target);
    }
  };

  useEffect(() => {
    // Updating observer when 'nextPage' or 'keyword' changed.
    observer.current?.disconnect();
    createOberserver(state.nextPage, state.keyword);
  }, [state.nextPage, state.keyword]);

  useEffect(() => {
    if (state.loading) {
      window.scrollTo({ top: document.body.scrollHeight });
    }
  }, [state.loadedCount]);

  useEffect(() => {
    if (state.loadedCount === state.response?.data.length) {
      dispatch(applyResponse());
      dispatch(stopLoading());
    }
  }, [state.loadedCount]);

  useEffect(() => {
    document.title = "台北一日遊 - 首頁";
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
                <BannerDescription>
                  探索每個角落，體驗城市的深度旅遊行程
                </BannerDescription>
              </BannerSlogan>
              <SearchBarContainer>
                <SearchBar
                  searchInputText={state.searchText}
                  onSearchButtonClick={() => dispatch(updateKeyword())}
                  onSearchInputTextChanged={(text) =>
                    dispatch(setSearchText(text))
                  }
                />
              </SearchBarContainer>
            </BannerContentContainer>
          </BannerContent>
        </BannerContainer>
      </Header>
      <Main>
        <AttractionsList
          attractions={state.attractions}
          loadingAttractions={state.response ? state.response.data : []}
          onLoad={() => dispatch(incrementLoadedCount())}
        />
        <Container>
          {state.loading ? (
            <Loader
              percent={
                state.response
                  ? state.loadedCount / state.response.data.length
                  : 0
              }
            />
          ) : (
            <></>
          )}
          {state.attractions.length === 0 && state.nextPage === null ? (
            <AttractionsNotFound />
          ) : (
            <></>
          )}
        </Container>
      </Main>
      <Footer />
    </>
  );
};

export default HomePage;
