import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Attraction, Attractions } from "../../Core/Core";

interface AttractionState extends Attractions {
  isLoading: boolean
}

const initialState: AttractionState = {
  data: [],
  nextPage: 0,
  isLoading: false,
};

export const attractionSlice = createSlice({
  name: 'attraction',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Attraction[]>) => {
      state.data = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setNextPage: (state, action: PayloadAction<number | null>) => {
      state.nextPage = action.payload;
    },
  }
});

export const { setData, setIsLoading, setNextPage } = attractionSlice.actions;
export default attractionSlice.reducer;
