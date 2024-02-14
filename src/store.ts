import { configureStore } from "@reduxjs/toolkit";

import authModalReducer from './slices/authModalSlice';
import communityReducer from './slices/communitySlice';

export default configureStore({
  reducer: {
    authModalState: authModalReducer,
    communitiesState: communityReducer,
  },
})