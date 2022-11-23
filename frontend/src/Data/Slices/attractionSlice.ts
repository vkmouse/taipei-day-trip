import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Attraction, AttractionState } from "../../Core/Core";

const initialState: AttractionState = {
  data: [],
  nextPage: 0
};

export const attractionSlice = createSlice({
  name: 'attraction',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Attraction[]>) => {
      state.data = action.payload;
    },
    setNextPage: (state, action: PayloadAction<number | null>) => {
      state.nextPage = action.payload;
    },
  }
});

export const { setData, setNextPage } = attractionSlice.actions;
export default attractionSlice.reducer;
