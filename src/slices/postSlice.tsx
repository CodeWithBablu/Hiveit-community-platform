import { FileWithUrl } from "@/components/Post/PostForm";
import { MetaData } from "@/config";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
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

export type SortBy = "latest" | "top" | "hot";


export interface PostState {
  selectedPost: Post | null;
  posts: Post[];
  postVotes: PostVote[];
  hasMore: boolean,
  // lastVisible: { id: string, data: DocumentData } | null,
  filter: SortBy,
}

const defaultInitialState: PostState = {
  selectedPost: null,
  posts: [],
  postVotes: [],
  hasMore: true,
  filter: "hot",
};

export const PostsSlice = createSlice({
  name: "postState",
  initialState: defaultInitialState,
  reducers: {
    setHasMore: (state, action: PayloadAction<boolean>) => {
      return { ...state, hasMore: action.payload }
    },
    setLastVisible: (state, action: PayloadAction<{ id: string, data: DocumentData } | null>) => {
      return { ...state, lastVisible: action.payload }
    },
    setFilter: (state, action: PayloadAction<SortBy>) => {
      return { ...state, filter: action.payload }
    },
    setPostFetchingParams: (state, action: PayloadAction<{ hasMore: boolean, lastVisible: QueryDocumentSnapshot<DocumentData> | null, filter: SortBy }>) => {
      return { ...state, hasMore: action.payload.hasMore, filter: action.payload.filter, lastVisible: action.payload.lastVisible }
    },
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
      return ({
        ...state,
        selectedPost: null,
        posts: [],
        // postVotes: [],
        hasMore: true,
      });
    },
  },
});

export default PostsSlice.reducer;
