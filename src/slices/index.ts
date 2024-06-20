import { AuthModalSlice } from "./authModalSlice";
import { CommunitySlice } from "./communitySlice";
import { PostsSlice } from "./postSlice";

const { setAuthModalState } = AuthModalSlice.actions;
const { setCurrentCommunity, setMyCommunitySnippets, resetCommunitiesState } = CommunitySlice.actions;

const { setPostStateValue, setPosts, removePost, resetPostStatevalue } = PostsSlice.actions;

export {
  setAuthModalState,
  setCurrentCommunity,
  setMyCommunitySnippets,
  resetCommunitiesState,
  setPostStateValue,
  setPosts,
  removePost,
  resetPostStatevalue,
};
