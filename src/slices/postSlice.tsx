import { MetaData } from "@/config/postConfig";
import { createSlice } from "@reduxjs/toolkit";
import { Timestamp } from "firebase/firestore/lite";

export type Post = {
  id?: string;
  communityId: string;
  creatorId: string;
  creatorDisplayName: string;
  type: "post" | "media" | "link" | "poll";
  title: string;
  body?: string;
  gallery?: string[];
  video?: string;
  link?: string;
  metaData?: MetaData,
  numberOfComments: number;
  voteStatus: number;
  communityImgURL?: string;
  createdAt: Timestamp;
};

interface PostState {
  selectedPost: Post | null;
  posts: Post[];
  //postVotes
}

const defaultInitialState: PostState = {
  selectedPost: null,
  posts: [],
  //postVotes
};

export const PostsSlice = createSlice({
  name: "postState",
  initialState: defaultInitialState,
  reducers: {},
});

export default PostsSlice.reducer;
