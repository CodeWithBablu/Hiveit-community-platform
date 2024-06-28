import { setIsMenuOpen, setSelectedMenuItem } from "@/slices";
import { CommunitiesState } from "@/slices/communitySlice";
import { DirectoryMenuItem, DirectoryMenuState } from "@/slices/directoryMenuSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const defaultMenuItem = {
  displayText: "Home",
  link: "/",
};

const useDirectory = () => {
  const directoryState: DirectoryMenuState = useSelector((state: { directoryMenuState: DirectoryMenuState }) => state.directoryMenuState);

  const communityStateValue: CommunitiesState = useSelector(
    (state: { communitiesState: CommunitiesState }) => state.communitiesState,
  );

  const dispatch = useDispatch();
  const { communityId } = useParams();
  const navigate = useNavigate();


  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    console.log(menuItem);
    dispatch(setSelectedMenuItem({ selectedMenuItem: menuItem }));

    navigate(menuItem.link);
    if (directoryState.isOpen) {
      toggleMenuOpen();
    }
  };

  const toggleMenuOpen = () => {
    dispatch(setIsMenuOpen({ isOpen: !directoryState.isOpen }));
  };

  useEffect(() => {

    if (communityStateValue.currentCommunity && communityId) {
      const existingCommunity = communityStateValue.currentCommunity;

      dispatch(setSelectedMenuItem({
        selectedMenuItem: {
          displayText: `h/${existingCommunity?.id}`,
          link: `/h/${existingCommunity?.id}`,
          imageURL: existingCommunity.imageURL,
        }
      }))
      return;
    }

    // dispatch(setSelectedMenuItem({ selectedMenuItem: defaultMenuItem }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityStateValue.currentCommunity, communityId]);

  return { directoryState, onSelectMenuItem, toggleMenuOpen };
};

export default useDirectory;