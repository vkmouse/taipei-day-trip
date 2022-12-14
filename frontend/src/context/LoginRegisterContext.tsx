import React, { createContext, useContext, useState } from 'react';
import LoginRegister from '../components/LoginRegister';
import { useAuthContext } from './AuthContext';

type LoginRegisterState = {
  show: () => void,
  hide: () => void,
};

const initialState: LoginRegisterState = {
  show: () => void 0,
  hide: () => void 0,
};

const LoginRegisterContext = createContext<LoginRegisterState>(initialState);

const LoginRegisterProvider = (props: { children: JSX.Element[] }) => {
  const [display, setDisplay] = useState(false);
  const { isLogin } = useAuthContext();
  const value: LoginRegisterState = {
    show: () => setDisplay(true),
    hide: () => setDisplay(false)
  };
  
  return (
    <LoginRegisterContext.Provider value={value}>
      {!isLogin && display ? <LoginRegister hide={value.hide} /> : <></>}
      {props.children}
    </LoginRegisterContext.Provider>
  );
};

const useLoginRegisterContext = (): LoginRegisterState => {
  return useContext(LoginRegisterContext);
};

export { LoginRegisterProvider, useLoginRegisterContext };
