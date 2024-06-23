import { AuthModalSlice } from "./authModalSlice";
import { CommunitySlice } from "./communitySlice";
import { PostsSlice } from "./postSlice";

const { setAuthModalState } = AuthModalSlice.actions;
const { setCurrentCommunity, setMyCommunitySnippets, resetMySnippets, changeCommunityImages } = CommunitySlice.actions;

const { setPostStateValue, setSelectedPost, setPosts, removePost, resetPostStatevalue, setPostVotes } = PostsSlice.actions;

export {
  setAuthModalState,
  setCurrentCommunity,
  setMyCommunitySnippets,
  changeCommunityImages,
  resetMySnippets,
  setPosts,
  setSelectedPost,
  setPostVotes,
  removePost,
  setPostStateValue,
  resetPostStatevalue,
};
