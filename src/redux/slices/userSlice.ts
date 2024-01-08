import { createSlice } from "@reduxjs/toolkit";

interface User {
  avatar: {
    public_id: string;
    url: string;
  };
  _id: string;
  name: string;
  email: string;
  post: any[];
  followers: any[];
  following: any[];
  __v: number;
}

interface InitialStateType {
  isAuthenticated: boolean;
  user?: User | null;
}

const initialState: InitialStateType = {
  isAuthenticated: false,
  user: null,
};

const Slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loadUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { loadUser, removeUser } = Slice.actions;

export default Slice.reducer;
