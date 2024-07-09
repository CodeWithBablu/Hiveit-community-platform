import { FileCategoryType } from "@/lib/Definations";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Timestamp } from "firebase/firestore";

export interface Community {
  id: string;
  description: string;
  creatorId: string;
  numberOfMembers: number;
  numberOfPosts: number;
  privacyType: "public" | "private" | "restricted";
  createdAt: Timestamp | number;
  imageURL?: string;
  bgImageURL?: string;
}

export interface CommunitySnippet {
  communityId: string;
  isModerator?: boolean;
  imageURL?: string;
}

export interface CommunitiesState {
  initSnippetFetched: boolean;
  createCommunityModelOpen: boolean;
  mySnippets: CommunitySnippet[] | [];
  recentCommunities: CommunitySnippet[] | [];
  currentCommunity?: Community,
}

const defaultCommunitiesState: CommunitiesState = {
  initSnippetFetched: false,
  createCommunityModelOpen: false,
  mySnippets: [],
  recentCommunities: [],
};

export const CommunitySlice = createSlice({
  name: "communitiesState",
  initialState: defaultCommunitiesState,
  reducers: {
    setInitSnippetFetched: (state, action: PayloadAction<{ initSnippetFetched: boolean }>) => {
      return ({ ...state, initSnippetFetched: action.payload.initSnippetFetched });
    },
    setCreateCommunityModelOpen: (state, action: PayloadAction<boolean>) => {
      return ({ ...state, createCommunityModelOpen: action.payload });
    },
    setMyCommunitySnippets: (state, action: PayloadAction<{ mySnippets: [CommunitySnippet] | [] }>) => {
      return (state = {
        ...state,
        mySnippets: action.payload.mySnippets,
      });
    },
    setRecentCommunities: (state, action: PayloadAction<{ recentCommunities: CommunitySnippet[] | [] }>) => {
      return (state = {
        ...state,
        recentCommunities: action.payload.recentCommunities,
      });
    },
    changeCommunityImages: (state, action: PayloadAction<{ fileCategory: FileCategoryType, url: string }>) => {
      if (state.currentCommunity) {
        return {
          ...state,
          currentCommunity: {
            ...state.currentCommunity,
            ...(action.payload.fileCategory === 'community_image' && { imageURL: action.payload.url }),
            ...(action.payload.fileCategory === 'community_bgImage' && { bgImageURL: action.payload.url })
          },
          mySnippets: [
            ...state.mySnippets.map((snippet: CommunitySnippet) => {
              if ((snippet.communityId === state.currentCommunity?.id) && action.payload.fileCategory === "community_image") {
                return { ...snippet, imageURL: action.payload.url } as CommunitySnippet
              }

              return snippet;
            })
          ]
        }
      }
      else
        return state
    },
    setCurrentCommunity: (state, action: PayloadAction<{ currentCommunity: Community }>) => {
      return (state = {
        ...state,
        currentCommunity: action.payload.currentCommunity,
      });
    },
    resetMySnippets: (state) => {
      return ({ ...state, mySnippets: [] });
    },
  },
});

export default CommunitySlice.reducer;
