import React, { createContext, useContext, useState } from 'react';

type State = {
  id: number | null
  setId: (newId: number | null) => void
};

const initialState: State = {
  id: null,
  setId: () => { throw('Not Implement'); }
};

const PurchasedOrderContext = createContext<State>(initialState);

const PurchasedOrderProvider = (props: { children: JSX.Element | JSX.Element[] }) => {
  const [id, setId] = useState<number | null>(null);
  const value: State = { id: id, setId };
  
  return (
    <PurchasedOrderContext.Provider value={value}>
      {props.children}
    </PurchasedOrderContext.Provider>
  );
};

const usePurchasedOrderContext = (): State => {
  return useContext(PurchasedOrderContext);
};

export { PurchasedOrderProvider, usePurchasedOrderContext };
