import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface AuthModalState {
  open: boolean;
  view: "login" | "signup" | "resetPassword";
}

const defaultAuthModalState: AuthModalState = {
  open: false,
  view: "login",
}

export const AuthModalSlice = createSlice({
  name: 'authModalState',
  initialState: defaultAuthModalState,
  reducers: {
    setAuthModalState: (state, action: PayloadAction<AuthModalState>) => {
      return state = action.payload;
    }
  }
});


export default AuthModalSlice.reducer;