import React, { createContext, useContext } from 'react';
import { useState } from 'react';

type NavigationState = {
  dialogIsDisplay: boolean
  email: string
  showDialog: () => void
  hideDialog: () => void
  setEmail: (value: string) => void
}

const initialState: NavigationState = {
  dialogIsDisplay: false,
  email: '',
  showDialog: () => void 0,
  hideDialog: () => void 0,
  setEmail: () => void 0,
};

const NavigationContext = createContext<NavigationState>(initialState);

const NavigationProvider = (props: { children: JSX.Element }) => {
  const [dialogIsDisplay, setDialogIsDisplay] = useState(false);
  const [email, setEmail] = useState('');
  const state: NavigationState = {
    dialogIsDisplay,
    email,
    showDialog: () => setDialogIsDisplay(true),
    hideDialog: () => setDialogIsDisplay(false),
    setEmail
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
