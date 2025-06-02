import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../redux/slices/userSlice";

const initialState: {
  isAuthenticated: boolean;
  user: User | null;
} = {
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
