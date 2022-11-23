import { configureStore } from '@reduxjs/toolkit';
import attractionReducer from '../Slices/attractionSlice';
import keywordReducer from '../Slices/keywordSlice';

const store = configureStore({
  reducer: {
    keyword: keywordReducer,
    attraction: attractionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
