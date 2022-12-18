import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserInfo = {
  id: number
  name: string
  email: string
}

type UserState = {
  isLoggedIn: boolean,
  lastUpdated: Date | null,
  loading: boolean
  userInfo: UserInfo | null
  userToken: string | null
}

const initialState: UserState = {
  isLoggedIn: false,
  lastUpdated: null,
  loading: false,
  userInfo: null,
  userToken: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.isLoggedIn = true;
      state.loading = false;
      state.userToken = action.payload;
    }, 
    setUser: (state, action: PayloadAction<UserInfo>) => {
      state.lastUpdated = new Date();
      state.loading = false;
      state.userInfo = action.payload;
    },
    reset: (state) => {
      state.isLoggedIn = false;
      state.lastUpdated = new Date();
      state.loading = false;
      state.userInfo = null;
      state.userToken = null;
    },
  }
});

export const { startLoading, setToken, setUser, reset } = userSlice.actions;
export default userSlice.reducer;
