import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface KeywordState {
  searchBarText: string
  keyword: string
}

const initialState: KeywordState = {
  searchBarText: '',
  keyword: ''
};

export const keywordSlice = createSlice({
  name: 'keyword',
  initialState,
  reducers: {
    setSearchBarText: (state, action: PayloadAction<string>) => {
      state.searchBarText = action.payload;
    },
    updateKeyword: (state) => {
      state.keyword = state.searchBarText;
    },
  }
});

export const { setSearchBarText, updateKeyword } = keywordSlice.actions;
export default keywordSlice.reducer;
