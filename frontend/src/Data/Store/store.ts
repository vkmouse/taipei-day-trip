import { configureStore } from '@reduxjs/toolkit';
import attractionReducer from '../Slices/attractionSlice';

const store = configureStore({
  reducer: {
    attraction: attractionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
