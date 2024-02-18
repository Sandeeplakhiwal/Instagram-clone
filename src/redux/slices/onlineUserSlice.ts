import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface OnlineUser {
  userId: string;
  timing: {
    from: string;
    to: string;
  };
}

interface InitialState {
  onlineUsers: OnlineUser[];
}

const initialState: InitialState = {
  onlineUsers: [],
};

const userOnlineSlice = createSlice({
  name: "onlineUser",
  initialState,
  reducers: {
    addUserOnlineTiming: (
      state,
      action: PayloadAction<{ userId: string; from: string; to: string }>
    ) => {
      const existingUserIndex = state.onlineUsers.findIndex(
        (user) => user.userId === action.payload.userId
      );
      if (existingUserIndex === -1) {
        // If the user is not already in the list, add them
        state.onlineUsers.push({
          userId: action.payload.userId,
          timing: { from: action.payload.from, to: action.payload.to },
        });
      } else {
        // If user is already exist in the list, update their "from" timestamp
        state.onlineUsers[existingUserIndex].timing.from = action.payload.from;
        state.onlineUsers[existingUserIndex].timing.to = action.payload.to;
      }
    },

    removeUserOnlineTiming: (
      state,
      action: PayloadAction<{ userId: string; to: string }>
    ) => {
      const userIndex = state.onlineUsers.findIndex(
        (user) => user.userId === action.payload.userId
      );
      if (userIndex !== -1) {
        // If the user is found, update their "to" timestamp
        state.onlineUsers[userIndex].timing.to = action.payload.to;
      }
    },
  },
});

export const { addUserOnlineTiming, removeUserOnlineTiming } =
  userOnlineSlice.actions;

export default userOnlineSlice.reducer;
