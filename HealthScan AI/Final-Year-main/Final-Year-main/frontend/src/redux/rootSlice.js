import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  auth: {
    user: null,
    token: null,
  },
};

export const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    // Loading actions
    setLoading: (state, action) => {
      console.log("Setting loading to:", action.payload);
      state.loading = action.payload;
    },
    // Auth actions
    setUser: (state, action) => {
      state.auth.user = action.payload;
    },
    setToken: (state, action) => {
      state.auth.token = action.payload;
    },
  },
});

// Action creators
export const { setLoading, setUser, setToken } = rootSlice.actions;

// Selectors
export const selectLoading = (state) => state.root.loading;
export const selectAuth = (state) => state.root.auth;

export default rootSlice.reducer;
