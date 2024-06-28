import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type DirectoryMenuItem = {
  displayText: string;
  link: string;
  imageURL?: string;
};

export interface DirectoryMenuState {
  isOpen: boolean;
  selectedMenuItem: DirectoryMenuItem;
}

const defaultMenuItem = {
  displayText: "Home",
  link: "/",
};

const defaultMenuState: DirectoryMenuState = {
  isOpen: false,
  selectedMenuItem: defaultMenuItem,
};

export const DirectoryMenuSlice = createSlice({
  name: "directoryMenuState",
  initialState: defaultMenuState,
  reducers: {
    setIsMenuOpen: (state, action: PayloadAction<{ isOpen: boolean }>) => {
      return ({ ...state, isOpen: action.payload.isOpen });
    },
    setSelectedMenuItem: (state, action: PayloadAction<{ selectedMenuItem: DirectoryMenuItem }>) => {
      return ({ ...state, selectedMenuItem: action.payload.selectedMenuItem });
    },
    setDirectoryMenuState: (state, action: PayloadAction<DirectoryMenuState>) => {
      return (state = action.payload);
    },
  },
});

export default DirectoryMenuSlice.reducer;