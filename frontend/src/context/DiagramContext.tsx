import React, { createContext, useContext, useState } from "react";
import LoginRegisterDialog from "../components/LoginRegisterDialog";
import { useAppSelector } from "../store/store";

type LoginRegisterState = {
  showLoginRegister: () => void;
  hideLoginRegister: () => void;
};

const initialState: LoginRegisterState = {
  showLoginRegister: () => void 0,
  hideLoginRegister: () => void 0,
};

const LoginRegisterContext = createContext<LoginRegisterState>(initialState);

const DialogProvider = (props: { children: JSX.Element[] }) => {
  const [displayLoginRegister, setDisplayLoginRegister] = useState(false);
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const value: LoginRegisterState = {
    showLoginRegister: () => setDisplayLoginRegister(true),
    hideLoginRegister: () => setDisplayLoginRegister(false),
  };

  return (
    <LoginRegisterContext.Provider value={value}>
      {!isLoggedIn && displayLoginRegister ? (
        <LoginRegisterDialog hide={value.hideLoginRegister} />
      ) : (
        <></>
      )}
      {props.children}
    </LoginRegisterContext.Provider>
  );
};

const useDialogContext = (): LoginRegisterState => {
  return useContext(LoginRegisterContext);
};

export { DialogProvider, useDialogContext };
