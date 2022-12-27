import React, { createContext, useContext, useState } from "react";
import Dialog from "../components/Dialog";
import LoginRegisterDialog from "../components/LoginRegisterDialog";
import UserProfileDialog from "../components/UserProfileDialog";
import { useAppSelector } from "../store/store";

type DialogState = {
  showLoginRegister: () => void;
  showUserProgile: () => void;
  hideLoginRegister: () => void;
  hideUserProgile: () => void;
};

const initialState: DialogState = {
  showLoginRegister: () => {
    throw "Not Implement";
  },
  showUserProgile: () => {
    throw "Not Implement";
  },
  hideLoginRegister: () => {
    throw "Not Implement";
  },
  hideUserProgile: () => {
    throw "Not Implement";
  },
};

const DialogContext = createContext<DialogState>(initialState);

const DialogProvider = (props: { children: JSX.Element[] }) => {
  const [displayLoginRegister, setDisplayLoginRegister] = useState(false);
  const [displayUserProgile, setDisplayUserProgile] = useState(false);
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const value: DialogState = {
    showLoginRegister: () => setDisplayLoginRegister(true),
    showUserProgile: () => setDisplayUserProgile(true),
    hideLoginRegister: () => setDisplayLoginRegister(false),
    hideUserProgile: () => setDisplayUserProgile(false),
  };

  if (isLoggedIn) {
    return (
      <DialogContext.Provider value={value}>
        {displayUserProgile ? (
          <UserProfileDialog hide={value.hideUserProgile} />
        ) : (
          <></>
        )}
        {props.children}
      </DialogContext.Provider>
    );
  }

  return (
    <DialogContext.Provider value={value}>
      {displayLoginRegister ? (
        <LoginRegisterDialog hide={value.hideLoginRegister} />
      ) : (
        <></>
      )}
      {props.children}
    </DialogContext.Provider>
  );
};

const useDialogContext = (): DialogState => {
  return useContext(DialogContext);
};

export { DialogProvider, useDialogContext };
