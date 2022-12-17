import React, { createContext, useContext, useRef, useState } from 'react';
import { Booking, BookingResponse } from '../api/api';
import { parseDateTimeString } from '../utils/time';
import { useAPIContext } from './APIContext';

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
  isLogin: boolean
  hasInit: boolean
  addBooking: (refresh: boolean, booking: Booking) => Promise<boolean>
  login: (email: string, password: string) => Promise<LoginResponse>
  logout: () => Promise<void>
  getBookings: (refresh: boolean) => Promise<BookingResponse[]>
  getUserInfo: (refresh: boolean) => Promise<Member | null>
  removeBooking: (refresh: boolean, bookingId: number) => Promise<boolean>
}

const initialState: Auth = {
  token: '',
  isLogin: false,
  hasInit: false,
  addBooking: (): Promise<boolean> => { throw new Error('Function not implemented.'); },
  login: (): Promise<LoginResponse> => { throw new Error('Function not implemented.'); },
  logout: (): Promise<void> => { throw new Error('Function not implemented.'); },
  getBookings: (): Promise<BookingResponse[]> => { throw new Error('Function not implemented.'); },
  getUserInfo: (): Promise<Member> => { throw new Error('Function not implemented.'); },
  removeBooking: (): Promise<boolean> => { throw new Error('Function not implemented.'); },
};

const AuthContext = createContext<Auth>(initialState);

const AuthProvider = (props: { children: JSX.Element[] | JSX.Element }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [hasInit, setHasInit] = useState(false);
  const token = useRef('');
  const api = useAPIContext();
  const parseLoginSuccess = async (response: Response) => {
    try {
      const body: { 'ok': boolean, 'access_token': string } = await response.json();
      token.current = body.access_token;
      setIsLogin(true);
      return LoginResponse.Success;
    } catch (e) {
      token.current = '';
      setIsLogin(false);
      return LoginResponse.LoginFailed;
    }
  };
  const parseLoginFailed = async (response: Response) => {
    token.current = '';
    setIsLogin(false);
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

  const auth: Auth = {
    token: token.current,
    isLogin: isLogin,
    hasInit: hasInit,
    addBooking: async (refresh, booking) => {
      const response = await api.addBooking(token.current, booking);
      switch (response.status) {
        case 201:
          return true;
        case 401:
          if (refresh) {
            const response = await api.refresh();
            const body: { 'ok': boolean, 'access_token': string } = await response.json();
            token.current = body.access_token;
            return auth.addBooking(false, booking);
          }
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
        setIsLogin(false);
      }
    },
    getUserInfo: async (refresh) => {
      const response = await api.getUserInfo(token.current);
      switch (response.status) {
        case 200:
          setIsLogin(true);
          setHasInit(true);
          const body: { data: Member } = await response.json();
          return body.data;
        case 401:
          if (refresh) {
            const response = await api.refresh();
            const body: { 'ok': boolean, 'access_token': string } = await response.json();
            token.current = body.access_token;
            return auth.getUserInfo(false);
          } else {
            setIsLogin(false);
            setHasInit(true);
          }
          break;
        case 403:
          setIsLogin(false);
          setHasInit(true);
          break;
        case 500:
          setIsLogin(false);
          setHasInit(true);
          break;
      }
      return null;
    },
    getBookings: async (refresh) => {
      const response = await api.getBookings(token.current);
      switch (response.status) {
        case 200:
          const body: { data: {
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
          }[] } = await response.json();
          return body.data.map(m => {
            return {
              ...m,
              starttime: parseDateTimeString(m.starttime),
              endtime: parseDateTimeString(m.endtime),
            };
          });
        case 401:
          if (refresh) {
            const response = await api.refresh();
            const body: { 'ok': boolean, 'access_token': string } = await response.json();
            token.current = body.access_token;
            return auth.getBookings(false);
          }
      }
      return [];
    },
    removeBooking: async (refresh, bookingId) => {
      const response = await api.removeBooking(token.current, bookingId);
      switch (response.status) {
        case 200:
          return true;
        case 401:
          if (refresh) {
            const response = await api.refresh();
            const body: { 'ok': boolean, 'access_token': string } = await response.json();
            token.current = body.access_token;
            return auth.removeBooking(false, bookingId);
          }
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
