import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Timestamp } from "firebase/firestore";

export interface Community {
  id: string;
  description: string;
  creatorId: string;
  numberOfMembers: number;
  numberOfPosts: number;
  privacyType: "public" | "private" | "restricted";
  createdAt: Timestamp;
  imageURL?: string;
  bgImageURL?: string;
}

export interface CommunitySnippet {
  communityId: string;
  isModerator?: boolean;
  imageUrl?: string;
}

export interface CommunitiesState {
  mySnippets: [CommunitySnippet] | [];
  currentCommunity?: Community,
}

const defaultCommunitiesState: CommunitiesState = {
  mySnippets: [],
};

export const CommunitySlice = createSlice({
  name: "communitiesState",
  initialState: defaultCommunitiesState,
  reducers: {
    setMyCommunitySnippets: (state, action: PayloadAction<{ mySnippets: [CommunitySnippet] | [] }>) => {
      return (state = {
        ...state,
        mySnippets: action.payload.mySnippets,
      });
    },
    setCurrentCommunity: (state, action: PayloadAction<{ currentCommunity: Community }>) => {
      return (state = {
        ...state,
        currentCommunity: action.payload.currentCommunity,
      });
    },
    resetCommunitiesState: (state) => {
      return (state = defaultCommunitiesState);
    },
  },
});

export default CommunitySlice.reducer;
