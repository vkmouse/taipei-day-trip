import React, { createContext, useContext, useRef, useState } from 'react';
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
  login: (email: string, password: string) => Promise<LoginResponse>
  logout: () => Promise<void>
  getUserInfo: (refresh: boolean) => Promise<Member | null>
}

const initialState: Auth = {
  token: '',
  isLogin: false,
  login: (): Promise<LoginResponse> => { throw new Error('Function not implemented.'); },
  logout: (): Promise<void> => { throw new Error('Function not implemented.'); },
  getUserInfo: (): Promise<Member> => { throw new Error('Function not implemented.'); }
};

const AuthContext = createContext<Auth>(initialState);

const AuthProvider = (props: { children: JSX.Element[] | JSX.Element }) => {
  const [isLogin, setIsLogin] = useState(false);
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
    getUserInfo: async (refresh: boolean) => {
      const response = await api.getUserInfo(token.current);
      switch (response.status) {
        case 200:
          setIsLogin(true);
          return response.json();
        case 401:
          if (refresh) {
            const response = await api.refresh();
            const body: { 'ok': boolean, 'access_token': string } = await response.json();
            token.current = body.access_token;
            return auth.getUserInfo(false);
          } else {
            setIsLogin(false);
            return null;
          }
        case 403:
          setIsLogin(false);
          return null;
        case 500:
          setIsLogin(false);
          return null;
      }
    },
  };
  return <AuthContext.Provider value={auth} {...props} />;
};

const useAuthContext = (): Auth => {
  return useContext(AuthContext);
};

export { type Auth, AuthContext, AuthProvider, LoginResponse, useAuthContext };
