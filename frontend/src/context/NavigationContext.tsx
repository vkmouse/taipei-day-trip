import React, { createContext, useContext } from 'react';
import { useState } from 'react';

type Dialog = {
  isShow: boolean
  show: () => void
  hide: () => void
}

type InputValue = {
  value: string
  isValid: boolean
  setValue: (value: string) => void
  setIsValid: (value: boolean) => void
}

type NavigationState = {
  dialog: Dialog
  email: InputValue
}

const initialState: NavigationState = {
  dialog: {
    isShow: false,
    show: () => void 0,
    hide: () => void 0,
  },
  email: {
    value: '',
    isValid: false,
    setValue: () => void 0,
    setIsValid: () => void 0
  }
};

const NavigationContext = createContext<NavigationState>(initialState);

const NavigationProvider = (props: { children: JSX.Element }) => {
  const [isShow, setIsShow] = useState(false);
  const [email, setEmail] = useState('');
  const [emailIsValid, setemailIsValid] = useState(false);
  const state: NavigationState = {
    dialog: {
      isShow: isShow,
      show: () => setIsShow(true),
      hide: () => setIsShow(false),
    },
    email: {
      value: email,
      isValid: emailIsValid,
      setValue: (value: string) => setEmail(value),
      setIsValid: (value: boolean) => setemailIsValid(value),
    },
  };

  return <NavigationContext.Provider value={state} {...props} />;
};

const useNavigationContext = () => {
  return useContext(NavigationContext);
};

export { NavigationProvider, useNavigationContext };

// export const ShowDialogContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>([false, () => void 0]);
// export const EmailContext = createContext<[string, Dispatch<SetStateAction<string>>]>(['', () => void 0]);
// export const PasswordContext = createContext<[string, Dispatch<SetStateAction<string>>]>(['', () => void 0]);
// export const NameContext = createContext<[string, Dispatch<SetStateAction<string>>]>(['', () => void 0]);
// export const EmailIsValidContext = createContext<[boolean, Dispatch<SetStateAction<boolean>>]>([false, () => void 0]);
// export const PasswordIsValidContext = createContext<[boolean, Dispatch<SetStateAction<boolean>>]>([false, () => void 0]);
// export const NameIsValidContext = createContext<[boolean, Dispatch<SetStateAction<boolean>>]>([false, () => void 0]);
