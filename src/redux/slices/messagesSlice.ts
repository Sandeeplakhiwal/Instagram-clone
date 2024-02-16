import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Message } from "../../components/inbox/directMessageBox";

export interface SenderCount {
  sender: string;
  count: number;
}

const initialState = {
  messages: JSON.parse(localStorage.getItem("messages") || "[]") as Message[],
  messagesCount: JSON.parse(
    localStorage.getItem("messagesCount") || "[]"
  ) as SenderCount[],
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      localStorage.setItem("messages", JSON.stringify(state.messages));
    },
    clearMessages: (state) => {
      state.messages = [];
      localStorage.removeItem("messages");
    },
    increaseMessagesCount: (state, action: PayloadAction<string>) => {
      const sender = action.payload;
      const existingSenderIndex = state.messagesCount.findIndex(
        (count) => count.sender === sender
      );
      if (existingSenderIndex === -1) {
        state.messagesCount.push({ sender, count: 1 });
      } else {
        state.messagesCount[existingSenderIndex].count++;
      }
      localStorage.setItem(
        "messagesCount",
        JSON.stringify(state.messagesCount)
      );
    },
    decreaseMessagesCount: (state, action: PayloadAction<string>) => {
      const senderToRemove = action.payload;
      state.messagesCount = state.messagesCount.filter(
        (count) => count.sender !== senderToRemove
      );
      localStorage.setItem(
        "messagesCount",
        JSON.stringify(state.messagesCount)
      );
    },
  },
});

export const {
  addMessage,
  clearMessages,
  increaseMessagesCount,
  decreaseMessagesCount,
} = messageSlice.actions;

export default messageSlice.reducer;
