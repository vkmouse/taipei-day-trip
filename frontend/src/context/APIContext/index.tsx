import React, { createContext, useContext } from 'react';
import { Attraction, Attractions } from '../../Core/Core';
import mockAPI from './mockAPI';
import realAPI from './realAPI';

export type API = {
  getAttraction: (id: number) => Promise<Attraction>
  getAttractions : (page: number, keyword: string) => Promise<Attractions>
  getCategories: () => Promise<{ data: string[] }>
  getUserInfo: (token: string) => Promise<Response>
  login: (email: string, password: string) => Promise<Response>
  logout: () => Promise<Response>
  refresh: () => Promise<Response>
  register: (name: string, email: string, password: string) => Promise<Response>
}

const initialState: API = {
  getAttraction: () => new Promise(() => void 0),
  getAttractions: () => new Promise(() => void 0),
  getCategories: () => new Promise(() => void 0),
  getUserInfo: () => new Promise(() => void 0),
  login: () => new Promise(() => void 0),
  logout: () => new Promise(() => void 0),
  refresh: () => new Promise(() => void 0),
  register: () => new Promise(() => void 0),
};

const APIContext = createContext<API>(initialState);

const APIProvider = (props: { isMock?: boolean, children: JSX.Element[] | JSX.Element }) => {
  if (props.isMock) {
    return <APIContext.Provider value={mockAPI} {...props} />;
  } else {
    return <APIContext.Provider value={realAPI} {...props} />;
  }
};

const useAPIContext = () => {
  return useContext(APIContext);
};

export { APIContext, APIProvider, useAPIContext };
