import React, { createContext, useContext } from 'react';
import { useState } from 'react';

type Dialog = {
  isShow: boolean
  show: () => void
  hide: () => void
}

type NavigationState = {
  dialog: Dialog
}

const initialState: NavigationState = {
  dialog: {
    isShow: false,
    show: () => void 0,
    hide: () => void 0,
  },
};

const NavigationContext = createContext<NavigationState>(initialState);

const NavigationProvider = (props: { children: JSX.Element }) => {
  const [isShow, setIsShow] = useState(false);
  const state: NavigationState = {
    dialog: {
      isShow: isShow,
      show: () => {
        setIsShow(true);
      },
      hide: () => {
        setIsShow(false);
      },
    },
  };

  return <NavigationContext.Provider value={state} {...props} />;
};

const useNavigationContext = () => {
  return useContext(NavigationContext);
};

export { NavigationProvider, useNavigationContext };
