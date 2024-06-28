import { setIsMenuOpen, setSelectedMenuItem } from "@/slices";
import { CommunitiesState } from "@/slices/communitySlice";
import { DirectoryMenuItem, DirectoryMenuState } from "@/slices/directoryMenuSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useDirectory = () => {
  const directoryState: DirectoryMenuState = useSelector((state: { directoryMenuState: DirectoryMenuState }) => state.directoryMenuState);

  const communityStateValue: CommunitiesState = useSelector(
    (state: { communitiesState: CommunitiesState }) => state.communitiesState,
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
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
    // const { community } = router.query;

    if (communityStateValue.currentCommunity) {
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

    // setDirectoryState((prev) => ({
    //   ...prev,
    //   selectedMenuItem: defaultMenuItem,
    // }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityStateValue.currentCommunity]);

  return { directoryState, onSelectMenuItem, toggleMenuOpen };
};

export default useDirectory;