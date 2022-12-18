import React, { createContext, useContext, useRef, useState } from 'react';
import mockAPI from '../api/mockAPI';
import realAPI from '../api/realAPI';
import { useAppDispatch } from '../store/store';
import { setIsLogin } from '../store/userSlice';
import { Attraction, Attractions } from '../types/AttractionTypes';
import { Booking, BookingResponse } from '../types/BookingTypes';
import { parseDateTimeString } from '../utils/time';

enum LoginResponse {
  Success = 1,
  EmailNotExist,
  PasswordError,
  LoginFailed,
  ServerFailed,
}

type Member = {
  id: number,
  name: string,
  email: string,
}

type Auth = {
  token: string
  hasInit: boolean

  getAttraction: (id: number) => Promise<Attraction>
  getAttractions: (page: number, keyword: string) => Promise<Attractions>
  getCategories: () => Promise<{ data: string[] }>
  refresh: () => Promise<Response>
  register: (name: string, email: string, password: string) => Promise<Response>

  addBooking: (booking: Booking) => Promise<boolean>
  login: (email: string, password: string) => Promise<LoginResponse>
  logout: () => Promise<void>
  getBookings: () => Promise<BookingResponse[]>
  getUserInfo: () => Promise<Member | null>
  removeBooking: (bookingId: number) => Promise<boolean>
}

const initialState: Auth = {
  token: '',
  hasInit: false,

  getAttraction: () => { throw new Error('Function not implemented.'); },
  getAttractions: () => { throw new Error('Function not implemented.'); },
  getCategories: () => { throw new Error('Function not implemented.'); },
  refresh: () => { throw new Error('Function not implemented.'); },
  register: () => { throw new Error('Function not implemented.'); },

  addBooking: (): Promise<boolean> => { throw new Error('Function not implemented.'); },
  login: (): Promise<LoginResponse> => { throw new Error('Function not implemented.'); },
  logout: (): Promise<void> => { throw new Error('Function not implemented.'); },
  getBookings: (): Promise<BookingResponse[]> => { throw new Error('Function not implemented.'); },
  getUserInfo: (): Promise<Member> => { throw new Error('Function not implemented.'); },
  removeBooking: (): Promise<boolean> => { throw new Error('Function not implemented.'); },
};

const AuthContext = createContext<Auth>(initialState);

const AuthProvider = (props: { isMock?: boolean, children: JSX.Element[] | JSX.Element }) => {
  const dispatch = useAppDispatch();
  const [hasInit, setHasInit] = useState(false);
  const token = useRef('');
  const api = props.isMock ? mockAPI : realAPI;
  const parseLoginSuccess = async (response: Response) => {
    try {
      const body: { 'ok': boolean, 'access_token': string } = await response.json();
      token.current = body.access_token;
      dispatch(setIsLogin(true));
      return LoginResponse.Success;
    } catch (e) {
      token.current = '';
      dispatch(setIsLogin(false));
      return LoginResponse.LoginFailed;
    }
  };
  const parseLoginFailed = async (response: Response) => {
    token.current = '';
    dispatch(setIsLogin(false));
    const body: { 'error': boolean, 'message': string } = await response.json();
    if (body.message.includes('email')) {
      return LoginResponse.EmailNotExist;
    } else if (body.message.includes('password')) {
      return LoginResponse.PasswordError;
    } else if (response.status === 500) {
      return LoginResponse.ServerFailed;
    } else {
      return LoginResponse.LoginFailed;
    }
  };

  const runRefreshToken = async (callback: () => Promise<Response>) => {
    const response = await callback();
    if (response.status === 401) {
      const response = await api.refresh();
      if (response.status === 200) {
        const body: { ok: boolean, access_token: string } = await response.json();
        token.current = body.access_token;
        return await callback();
      }
      return response;
    }
    return response;
  };

  const auth: Auth = {
    token: token.current,
    hasInit: hasInit,

    getAttraction: api.getAttraction,
    getAttractions: api.getAttractions,
    getCategories: api.getCategories,
    refresh: api.refresh,
    register: api.register,

    addBooking: async (booking) => {
      const response = await runRefreshToken(() => api.addBooking(token.current, booking));
      if (response.status === 201) {
        return true;
      }
      return false;
    },
    login: async (email, password) => {
      const response = await api.login(email, password);
      if (response.status === 200) {
        return parseLoginSuccess(response);
      } else {
        return parseLoginFailed(response);
      }
    },
    logout: async () => {
      const response = await api.logout();
      const body: { 'ok': boolean } = await response.json();
      if (body.ok) {
        token.current = '';
        dispatch(setIsLogin(false));
      }
    },
    getUserInfo: async () => {
      const response = await runRefreshToken(() => api.getUserInfo(token.current));
      setHasInit(true);
      if (response.status === 200) {
        dispatch(setIsLogin(true));
        const body: { data: Member } = await response.json();
        return body.data;
      }
      return null;
    },
    getBookings: async () => {
      const response = await runRefreshToken(() => api.getBookings(token.current));
      if (response.status === 200) {
        const body: { 
          data: {
            attraction: {
              id: number
              name: string
              address: string
              image: string
            },
            bookingId: number
            starttime: string
            endtime: string
            price: number
          }[] 
        } = await response.json();
        return body.data.map(m => {
          return {
            ...m,
            starttime: parseDateTimeString(m.starttime),
            endtime: parseDateTimeString(m.endtime),
          };
        });
      }
      return [];
    },
    removeBooking: async (bookingId) => {
      const response = await runRefreshToken(() => api.removeBooking(token.current, bookingId));
      if (response.status === 200) {
        return true;
      }
      return false;
    },
  };
  return <AuthContext.Provider value={auth} {...props} />;
};

const useAuthContext = (): Auth => {
  return useContext(AuthContext);
};

export { type Auth, AuthContext, AuthProvider, LoginResponse, useAuthContext };
