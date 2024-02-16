import { configureStore } from "@reduxjs/toolkit";
import userReducer, { InitialStateType } from "./slices/userSlice";
import { Message } from "../components/inbox/directMessageBox";
import messageReducer, { SenderCount } from "./slices/messagesSlice";
import exampleReducer, { UserMessages } from "./slices/exampleSlice";

export type RootState = {
  user: InitialStateType;
  message: {
    messages: Message[];
    messagesCount: SenderCount[];
  };
  example: {
    userMessages: UserMessages[];
  };
};

export const store = configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer,
    example: exampleReducer,
  },
  devTools: true,
});
