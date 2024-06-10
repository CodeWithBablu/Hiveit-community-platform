import { AuthModalSlice } from "./authModalSlice";
import { CommunitySlice } from "./communitySlice";

const { setAuthModalState } = AuthModalSlice.actions;
const { setCommunitiesState, resetCommunitiesState } = CommunitySlice.actions;



export { setAuthModalState, setCommunitiesState, resetCommunitiesState };