// import { createSlice } from "@reduxjs/toolkit";

// export interface User {
//   avatar: {
//     public_id: string;
//     url: string;
//   };
//   _id: string;
//   name: string;
//   email: string;
//   post: any[];
//   followers: any[];
//   following: any[];
//   __v: number;
// }

// export interface InitialStateType {
//   isAuthenticated: boolean;
//   user?: User | null;
// }

// const initialState: InitialStateType = {
//   isAuthenticated: false,
//   user: null,
// };

// const Slice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     loadUser: (state: InitialStateType, action) => {
//       state.isAuthenticated = true;
//       state.user = action.payload;
//     },
//     removeUser: (state) => {
//       state.isAuthenticated = false;
//       state.user = null;
//     },
//   },
// });

// export const { loadUser, removeUser } = Slice.actions;

// export default Slice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Avatar {
  public_id: string;
  url: string;
}

export interface User {
  avatar: Avatar;
  _id: string;
  name: string;
  email: string;
  post: any[];
  followers: any[];
  following: any[];
  __v: number;
}

export interface InitialStateType {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: InitialStateType = {
  isAuthenticated: false,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loadUser: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { loadUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
