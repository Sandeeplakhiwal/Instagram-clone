import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { Message } from "../../components/inbox/directMessageBox";

export interface Messages {
  sender: string;
  contents: Message[];
  _id: string;
}

export interface UserMessages {
  userId: string;
  messages: Messages[];
  _id: string;
}

interface InitialState {
  userMessages: UserMessages[];
}

interface AddMessagePayload extends Omit<Message, "_id"> {
  userId: string;
}

interface UnsendMessagePayload {
  userId: string;
  messageId: string;
}

interface DeleteReceivedMessagePayload {
  userId: string;
  sender: string;
  messageId: string;
}

// Load userMessages from localStorage if available
const savedUserMessages = localStorage.getItem("userMessages");
let initialState: InitialState = {
  userMessages: savedUserMessages ? JSON.parse(savedUserMessages) : [],
};

const exampleSlice = createSlice({
  name: "example",
  initialState,
  reducers: {
    addNewMessage: (state, action: PayloadAction<AddMessagePayload>) => {
      const { sender, userId } = action.payload;

      const userIndex = state.userMessages.findIndex(
        (userMsg) => userMsg.userId === userId
      );

      if (userIndex === -1) {
        // If user not found create a new entry
        // But first check for userId === sender
        if (userId === sender) {
          state.userMessages.push({
            userId: userId,
            messages: [
              {
                sender: action.payload.recipient,
                contents: [
                  {
                    sender: sender,
                    recipient: action.payload.recipient,
                    content: action.payload.content,
                    createdAt: action.payload.createdAt,
                    _id: nanoid(),
                  },
                ],
                _id: nanoid(),
              },
            ],
            _id: nanoid(),
          });
        } else {
          state.userMessages.push({
            userId: userId,
            messages: [
              {
                sender: sender,
                contents: [
                  {
                    sender: sender,
                    recipient: action.payload.recipient,
                    content: action.payload.content,
                    createdAt: action.payload.createdAt,
                    _id: nanoid(),
                  },
                ],
                _id: nanoid(),
              },
            ],
            _id: nanoid(),
          });
        }
      } else {
        // If user found
        if (sender === userId) {
          // If sender is the same as userId
          console.log("Id has matched");
          const recipientIndex = state.userMessages[
            userIndex
          ].messages.findIndex(
            (msg) => msg.sender === action.payload.recipient
          );
          console.log("recipent index", recipientIndex);
          if (recipientIndex === -1) {
            // If recipient not found, create a new entry for the recipient
            state.userMessages[userIndex].messages.push({
              sender: action.payload.recipient,
              contents: [
                {
                  sender: action.payload.sender,
                  recipient: action.payload.recipient,
                  content: action.payload.content,
                  createdAt: action.payload.createdAt,
                  _id: nanoid(),
                },
              ],
              _id: nanoid(),
            });
          } else {
            // If recipient found, push message to existing recipeint's contents
            state.userMessages[userIndex].messages[
              recipientIndex
            ].contents.push({
              sender: sender,
              recipient: action.payload.recipient,
              content: action.payload.content,
              createdAt: action.payload.createdAt,
              _id: nanoid(),
            });
          }
        } else {
          // If sender is different from userId
          const senderIndex = state.userMessages[userIndex].messages.findIndex(
            (msg) => msg.sender === sender
          );

          if (senderIndex === -1) {
            // If sender not found, create a new entry for the sender
            state.userMessages[userIndex].messages.push({
              sender: sender,
              contents: [
                {
                  sender: sender,
                  recipient: action.payload.recipient,
                  content: action.payload.content,
                  createdAt: action.payload.createdAt,
                  _id: nanoid(),
                },
              ],
              _id: nanoid(),
            });
          } else {
            // If sender found, push message to existing sender's contents
            state.userMessages[userIndex].messages[senderIndex].contents.push({
              sender: sender,
              recipient: action.payload.recipient,
              content: action.payload.content,
              createdAt: action.payload.createdAt,
              _id: nanoid(),
            });
          }
        }
      }
      // Save updated userMessages to localStorage
      localStorage.setItem("userMessages", JSON.stringify(state.userMessages));
      console.log("message has set to localstorage");
    },

    unsendMessage: (state, action: PayloadAction<UnsendMessagePayload>) => {
      const { userId, messageId } = action.payload;

      // Find the user
      const userIndex = state.userMessages.findIndex(
        (userMsg) => userMsg.userId === userId
      );

      if (userIndex !== -1) {
        // Find the message in the user's messages
        const messageIndex = state.userMessages[userIndex].messages.findIndex(
          (msg) => msg.contents.some((content) => content._id === messageId)
        );

        if (messageIndex !== -1) {
          // Remove the message from the contents array
          state.userMessages[userIndex].messages[messageIndex].contents =
            state.userMessages[userIndex].messages[
              messageIndex
            ].contents.filter((content) => content._id !== messageId);

          // If the contents array becomes empty after removing the message, remove the entire message
          if (
            state.userMessages[userIndex].messages[messageIndex].contents
              .length === 0
          ) {
            state.userMessages[userIndex].messages.splice(messageIndex, 1);
          }
        }
      }

      // Save updated userMessages to localStorage
      localStorage.setItem("userMessages", JSON.stringify(state.userMessages));
    },

    deleteReceivedMessage: (
      state,
      action: PayloadAction<DeleteReceivedMessagePayload>
    ) => {
      const { userId, sender, messageId } = action.payload;

      // Find the user
      const userIndex = state.userMessages.findIndex(
        (userMsg) => userMsg.userId === userId
      );

      if (userIndex !== -1) {
        // Find the message in the user's messages sent by the provided sender
        const messageIndex = state.userMessages[userIndex].messages.findIndex(
          (msg) =>
            msg.sender === sender &&
            msg.contents.some((content) => content._id === messageId)
        );

        if (messageIndex !== -1) {
          // Remove the message from the contents array
          state.userMessages[userIndex].messages[messageIndex].contents =
            state.userMessages[userIndex].messages[
              messageIndex
            ].contents.filter((content) => content._id !== messageId);

          // If the contents array becomes empty after removing the message, remove the entire message
          if (
            state.userMessages[userIndex].messages[messageIndex].contents
              .length === 0
          ) {
            state.userMessages[userIndex].messages.splice(messageIndex, 1);
          }
        }
      }

      // Save updated userMessages to localStorage
      localStorage.setItem("userMessages", JSON.stringify(state.userMessages));
    },

    clearMessages: (state) => {
      state.userMessages = [];
    },
  },
});

export const {
  addNewMessage,
  clearMessages,
  unsendMessage,
  deleteReceivedMessage,
} = exampleSlice.actions;

export default exampleSlice.reducer;
