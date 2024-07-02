import { configureStore } from "@reduxjs/toolkit";

import authModalReducer from "./slices/authModalSlice";
import communityReducer from "./slices/communitySlice";
import postReducer from "./slices/postSlice";
import directoryMenuReducer from "./slices/directoryMenuSlice";
import filterReducer from "./slices/filterSlice";

export default configureStore({
  reducer: {
    authModalState: authModalReducer,
    communitiesState: communityReducer,
    postState: postReducer,
    directoryMenuState: directoryMenuReducer,
    filterState: filterReducer
  },
});
