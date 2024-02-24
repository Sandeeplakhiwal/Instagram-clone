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

interface DeleteSelectedMessagesPayload {
  userId: string;
  messagesToDelete: Messages[];
}

// Generate a 24-character ID using nanoid
const generateMongoId = () => {
  return nanoid(12) + nanoid(12);
};

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
                    _id: generateMongoId(),
                  },
                ],
                _id: generateMongoId(),
              },
            ],
            _id: generateMongoId(),
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
                    _id: generateMongoId(),
                  },
                ],
                _id: generateMongoId(),
              },
            ],
            _id: generateMongoId(),
          });
        }
      } else {
        // If user found
        if (sender === userId) {
          // If sender is the same as userId
          const recipientIndex = state.userMessages[
            userIndex
          ].messages.findIndex(
            (msg) => msg.sender === action.payload.recipient
          );
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
                  _id: generateMongoId(),
                },
              ],
              _id: generateMongoId(),
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
              _id: generateMongoId(),
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
                  _id: generateMongoId(),
                },
              ],
              _id: generateMongoId(),
            });
          } else {
            // If sender found, push message to existing sender's contents
            state.userMessages[userIndex].messages[senderIndex].contents.push({
              sender: sender,
              recipient: action.payload.recipient,
              content: action.payload.content,
              createdAt: action.payload.createdAt,
              _id: generateMongoId(),
            });
          }
        }
      }
      // Save updated userMessages to localStorage
      localStorage.setItem("userMessages", JSON.stringify(state.userMessages));
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

    deleteSelectedMessages: (
      state,
      action: PayloadAction<DeleteSelectedMessagesPayload>
    ) => {
      const { userId, messagesToDelete } = action.payload;
      let messageIds: Array<string> = [];
      // Find the user
      const userIndex = state.userMessages.findIndex(
        (userMsg) => userMsg.userId === userId
      );
      if (userIndex !== -1) {
        // Find the message in the user's messages
        for (let i = 0; i < messagesToDelete.length; i++) {
          for (let j = 0; j < messagesToDelete[i].contents.length; j++) {
            messageIds.push(messagesToDelete[i].contents[j]._id);
          }
        }
      }
      if (messageIds.length) {
        for (let i = 0; i < messageIds.length; i++) {
          const messageIndex = state.userMessages[userIndex].messages.findIndex(
            (msg) =>
              msg.contents.some((content) => content._id === messageIds[i])
          );
          if (messageIndex !== -1) {
            // Remove the message from the contents array
            state.userMessages[userIndex].messages[
              messageIndex
            ].contents.filter((content) => content._id !== messageIds[i]);

            // If the contents array becomes empty after removing the messages, remove the entire message
            if (
              state.userMessages[userIndex].messages[messageIndex].contents
                .length === 0
            ) {
              state.userMessages[userIndex].messages.splice(messageIndex, 1);
            }

            // Save updated userMessages to localStorage
            localStorage.setItem(
              "userMessages",
              JSON.stringify(state.userMessages)
            );
          }
        }
      }
    },

    clearUserMessages: (state, action: PayloadAction<{ userId: string }>) => {
      let findUserIndex = state.userMessages.findIndex(
        (userMsg) => userMsg.userId === action.payload.userId
      );
      if (findUserIndex !== -1) {
        state.userMessages.splice(findUserIndex, 1);
        localStorage.setItem(
          "userMessages",
          JSON.stringify(state.userMessages)
        );
      }
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
  deleteSelectedMessages,
  clearUserMessages,
} = exampleSlice.actions;

export default exampleSlice.reducer;
