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
  password: InputValue
  name: InputValue
  clear: () => void
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
    setIsValid: () => void 0,
  },
  password: {
    value: '',
    isValid: false,
    setValue: () => void 0,
    setIsValid: () => void 0,
  },
  name: {
    value: '',
    isValid: false,
    setValue: () => void 0,
    setIsValid: () => void 0,
  },
  clear: () => void 0,
};

const NavigationContext = createContext<NavigationState>(initialState);

const NavigationProvider = (props: { children: JSX.Element }) => {
  const [isShow, setIsShow] = useState(false);
  const [email, setEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [name, setName] = useState('');
  const [nameIsValid, setNameIsValid] = useState(false);
  const clear = () => {
    setEmail('');
    setEmailIsValid(false);
    setPassword('');
    setPasswordIsValid(false);
    setName('');
    setNameIsValid(false);
  };
  const state: NavigationState = {
    dialog: {
      isShow: isShow,
      show: () => {
        setIsShow(true);
        clear();
      },
      hide: () => {
        setIsShow(false);
        clear();
      },
    },
    email: {
      value: email,
      isValid: emailIsValid,
      setValue: (value: string) => setEmail(value),
      setIsValid: (value: boolean) => setEmailIsValid(value),
    },
    password: {
      value: password,
      isValid: passwordIsValid,
      setValue: (value: string) => setPassword(value),
      setIsValid: (value: boolean) => setPasswordIsValid(value),
    },
    name: {
      value: name,
      isValid: nameIsValid,
      setValue: (value: string) => setName(value),
      setIsValid: (value: boolean) => setNameIsValid(value),
    },
    clear
  };

  return <NavigationContext.Provider value={state} {...props} />;
};

const useNavigationContext = () => {
  return useContext(NavigationContext);
};

export { NavigationProvider, useNavigationContext };
