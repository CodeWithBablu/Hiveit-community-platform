import { FileWithUrl } from "@/components/Post/PostForm";
import { MetaData } from "@/config/postConfig";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Timestamp } from "firebase/firestore/lite";

export type Post = {
  id?: string;
  communityId: string;
  creatorId: string;
  creatorDisplayName: string;
  type: "post" | "media" | "link" | "poll";
  title: string;
  body?: string;
  gallery?: FileWithUrl[];
  link?: string;
  metaData?: MetaData;
  numberOfComments: number;
  voteStatus: number;
  communityImgURL?: string;
  createdAt: Timestamp | number;
};

export type PostVote = {
  id: string;
  postId: string;
  communityId: string;
  voteValue: number;
}

export interface PostState {
  selectedPost: Post | null;
  posts: Post[];
  postVotes: PostVote[];
}

const defaultInitialState: PostState = {
  selectedPost: null,
  posts: [],
  postVotes: [],
};

export const PostsSlice = createSlice({
  name: "postState",
  initialState: defaultInitialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      const posts = action.payload.filter(
        (post) => !state.posts.some((item) => item.id === post.id),
      );
      return (state = {
        ...state,
        posts: [...state.posts, ...posts],
      });
    },
    setSelectedPost: (state, action: PayloadAction<{ post: Post }>) => {
      return ({ ...state, selectedPost: action.payload.post });
    },
    setPostVotes: (state, action: PayloadAction<{ postVotes: PostVote[] }>) => {
      return (state = { ...state, postVotes: action.payload.postVotes });
    },
    removePost: (state, action: PayloadAction<{ postId: string }>) => {
      return (state = { ...state, posts: state.posts.filter(post => post.id !== action.payload.postId) });
    },
    setPostStateValue: (state, action: PayloadAction<PostState>) => {
      return (state = { ...state, ...action.payload });
    },
    resetPostStatevalue: (state) => {
      return (state = defaultInitialState);
    },
  },
});

export default PostsSlice.reducer;
