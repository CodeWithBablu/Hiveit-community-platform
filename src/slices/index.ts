import { AuthModalSlice } from "./authModalSlice";
import { CommunitySlice } from "./communitySlice";
import { PostsSlice } from "./postSlice";
import { DirectoryMenuSlice } from "./directoryMenuSlice";

const { setAuthModalState } = AuthModalSlice.actions;
const { setInitSnippetFetched, setCurrentCommunity, setMyCommunitySnippets, resetMySnippets, changeCommunityImages } = CommunitySlice.actions;

const { setPostStateValue, setSelectedPost, setPosts, removePost, resetPostStatevalue, setPostVotes } = PostsSlice.actions;

const { setIsMenuOpen, setSelectedMenuItem, setDirectoryMenuState } = DirectoryMenuSlice.actions;

export {
  setAuthModalState,
  setCurrentCommunity,
  setInitSnippetFetched,
  setMyCommunitySnippets,
  changeCommunityImages,
  resetMySnippets,
  setPosts,
  setSelectedPost,
  setPostVotes,
  removePost,
  setPostStateValue,
  resetPostStatevalue,
  setIsMenuOpen,
  setSelectedMenuItem,
  setDirectoryMenuState
};
