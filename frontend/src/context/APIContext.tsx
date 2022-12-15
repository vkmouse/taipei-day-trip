import React, { createContext, useContext } from 'react';
import { API } from '../api/api';
import mockAPI from '../api/mockAPI';
import realAPI from '../api/realAPI';

const initialState: API = {
  addBooking: () => new Promise(() => void 0),
  getAttraction: () => new Promise(() => void 0),
  getAttractions: () => new Promise(() => void 0),
  getBookings: () => new Promise(() => void 0),
  getCategories: () => new Promise(() => void 0),
  getUserInfo: () => new Promise(() => void 0),
  login: () => new Promise(() => void 0),
  logout: () => new Promise(() => void 0),
  refresh: () => new Promise(() => void 0),
  register: () => new Promise(() => void 0),
  removeBooking: () => new Promise(() => void 0),
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
