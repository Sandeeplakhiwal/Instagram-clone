import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Message } from "../../components/inbox/directMessageBox";

export interface SenderCount {
  sender: string;
  count: number;
}

export interface MessageSeenConversation {
  sender: string;
  recipient: string;
  status: string;
}

const initialState = {
  messages: JSON.parse(localStorage.getItem("messages") || "[]") as Message[],
  messagesCount: JSON.parse(
    localStorage.getItem("messagesCount") || "[]"
  ) as SenderCount[],
  messageSeenConversations: JSON.parse(
    localStorage.getItem("messageSeenConversations") || "[]"
  ) as MessageSeenConversation[],
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
    addToMessageSeenConversation: (
      state,
      action: PayloadAction<{ sender: string; recipient: string }>
    ) => {
      const { sender, recipient } = action.payload;
      let indexOfConversation = state.messageSeenConversations.findIndex(
        (convers) =>
          convers.recipient === recipient && convers.sender === sender
      );
      if (indexOfConversation !== -1) {
        state.messageSeenConversations[indexOfConversation].status = "Seen";
      } else {
        state.messageSeenConversations.push({
          sender,
          recipient,
          status: "Seen",
        });
      }
      localStorage.setItem(
        "messageSeenConversations",
        JSON.stringify(state.messageSeenConversations)
      );
    },
    resetMessageSeenConversation: (
      state,
      action: PayloadAction<{ sender: string; recipient: string }>
    ) => {
      const { sender, recipient } = action.payload;
      let indexOfConversation = state.messageSeenConversations.findIndex(
        (convers) =>
          convers.recipient === recipient && convers.sender === sender
      );
      if (indexOfConversation !== -1) {
        state.messageSeenConversations[indexOfConversation].status = "Unseen";
      } else {
        state.messageSeenConversations.push({
          sender,
          recipient,
          status: "Unseen",
        });
      }
      localStorage.setItem(
        "messageSeenConversations",
        JSON.stringify(state.messageSeenConversations)
      );
    },
  },
});

export const {
  addMessage,
  clearMessages,
  increaseMessagesCount,
  decreaseMessagesCount,
  addToMessageSeenConversation,
  resetMessageSeenConversation,
} = messageSlice.actions;

export default messageSlice.reducer;
