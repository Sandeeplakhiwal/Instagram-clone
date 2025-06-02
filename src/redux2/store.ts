import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user.slice";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  devTools: true,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
