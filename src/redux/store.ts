import { configureStore } from "@reduxjs/toolkit";
import userReducer, { InitialStateType } from "./slices/userSlice";

export type RootState = {
  user: InitialStateType;
};

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  devTools: true,
});
