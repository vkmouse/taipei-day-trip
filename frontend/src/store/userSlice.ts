import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "../types/UserTypes";

type UserState = {
  isLoggedIn: boolean;
  loading: boolean;
  userInfo: UserInfo | null;
  userToken: string | null;
};

const initialState: UserState = {
  isLoggedIn: false,
  loading: false,
  userInfo: null,
  userToken: null,
};

export const userSlice = createSlice({
  name: "user",
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
      state.loading = false;
      state.userInfo = {
        ...action.payload,
        avatarUrl: action.payload.avatarUrl + `?v=${new Date().getTime()}`,
      };
    },
    reset: (state) => {
      state.isLoggedIn = false;
      state.loading = false;
      state.userInfo = null;
      state.userToken = null;
    },
  },
});

export const { startLoading, setToken, setUser, reset } = userSlice.actions;
export default userSlice.reducer;
