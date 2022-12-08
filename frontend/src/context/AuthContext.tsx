import React, { createContext, useContext, useState } from 'react';
import { useAPIContext } from './APIContext';

enum LoginResponse {
  Success = 1,
  EmailNotExist,
  PasswordError,
  LoginFailed,
  ServerFailed,
}

type Auth = {
  token: string
  isLogin: boolean
  login: (email: string, password: string) => Promise<LoginResponse>
}

const initialState: Auth = {
  token: '',
  isLogin: false,
  login: (): Promise<LoginResponse> => { throw new Error('Function not implemented.'); }
};

const AuthContext = createContext<Auth>(initialState);

const AuthProvider = (props: { children: JSX.Element[] | JSX.Element }) => {
  const [isLogin, setIsLogin] = useState(false);
  const api = useAPIContext();
  const parseLoginSuccess = async (response: Response) => {
    try {
      const body: { 'ok': boolean, 'access_token': string } = await response.json();
      auth.token = body.access_token;
      setIsLogin(true);
      return LoginResponse.Success;
    } catch (e) {
      auth.token = '';
      setIsLogin(false);
      return LoginResponse.LoginFailed;
    }
  };
  const parseLoginFailed = async (response: Response) => {
    auth.token = '';
    setIsLogin(false);
    try {
      const body: { 'error': boolean, 'message': string } = await response.json();
      if (body.message.includes('email')) {
        return LoginResponse.EmailNotExist;
      } else if (body.message.includes('password')) {
        return LoginResponse.PasswordError;
      } else if (response.status === 500) {
        return LoginResponse.ServerFailed;
      }
    } finally {
      return LoginResponse.LoginFailed;
    }
  };
  const auth: Auth = {
    token: '',
    isLogin: isLogin,
    login: async (email, password) => {
      const response = await api.login(email, password);
      if (response.status === 200) {
        return parseLoginSuccess(response);
      } else {
        return parseLoginFailed(response);
      }
    },
  };
  return <AuthContext.Provider value={auth} {...props} />;
};

const useAuthContext = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthProvider, LoginResponse, useAuthContext };
