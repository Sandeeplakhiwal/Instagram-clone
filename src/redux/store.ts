import { configureStore } from "@reduxjs/toolkit";
import userReducer, { InitialStateType } from "./slices/userSlice";
import { Message } from "../components/inbox/directMessageBox";
import messageReducer, {
  MessageSeenConversation,
  SenderCount,
} from "./slices/messagesSlice";
import exampleReducer, { UserMessages } from "./slices/exampleSlice";
import onlineUserReducer, { OnlineUser } from "./slices/onlineUserSlice";

export type RootState = {
  user: InitialStateType;
  message: {
    messages: Message[];
    messagesCount: SenderCount[];
    messageSeenConversations: MessageSeenConversation[];
  };
  example: {
    userMessages: UserMessages[];
  };
  onlineUsers: {
    onlineUsers: OnlineUser[];
  };
};

export const store = configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer,
    example: exampleReducer,
    onlineUsers: onlineUserReducer,
  },
  devTools: true,
});
