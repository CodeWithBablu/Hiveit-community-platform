import { configureStore } from "@reduxjs/toolkit";

import authModalReducer from "./slices/authModalSlice";
import communityReducer from "./slices/communitySlice";
import postReducer from "./slices/postSlice";
import directoryMenuReducer from "./slices/directoryMenuSlice";

export default configureStore({
  reducer: {
    authModalState: authModalReducer,
    communitiesState: communityReducer,
    postState: postReducer,
    directoryMenuState: directoryMenuReducer,
  },
});
