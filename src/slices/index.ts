import { AuthModalSlice } from "./authModalSlice";
import { CommunitySlice } from "./communitySlice";
import { PostsSlice } from "./postSlice";
import { DirectoryMenuSlice } from "./directoryMenuSlice";

const { setAuthModalState } = AuthModalSlice.actions;

const { setInitSnippetFetched, setCreateCommunityModelOpen, setCurrentCommunity, setMyCommunitySnippets, setRecentCommunities, resetMySnippets, changeCommunityImages } = CommunitySlice.actions;

const { setFilter, setHasMore, setLastVisible, setPostFetchingParams, setPostStateValue, setSelectedPost, setPosts, removePost, resetPostStatevalue, setPostVotes } = PostsSlice.actions;

const { setIsMenuOpen, setSelectedMenuItem, setDirectoryMenuState } = DirectoryMenuSlice.actions;

export {
  setAuthModalState,
  setCurrentCommunity,
  setInitSnippetFetched,
  setCreateCommunityModelOpen,
  setMyCommunitySnippets,
  setRecentCommunities,
  changeCommunityImages,
  resetMySnippets,
  setFilter,
  setHasMore,
  setLastVisible,
  setPostFetchingParams,
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
