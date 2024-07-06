import { MenuItem } from "@chakra-ui/react";
import CreateCommunityModal from "../../Modal/CreateCommunity/CreateCommunityModal";
import { RiAddLine } from "@remixicon/react";
import MenuListItem from "./MenuListItem";
import useCommunity from "@/hooks/useCommunity";
import { useDispatch, useSelector } from "react-redux";
import { setCreateCommunityModelOpen } from "@/slices";
import useDirectory from "@/hooks/useDirectory";


const Communities = () => {

  const { userCommunities: { mySnippets, createCommunityModelOpen } } = useCommunity();
  const { toggleMenuOpen } = useDirectory();

  const dispatch = useDispatch();

  return (
    <>
      <CreateCommunityModal open={createCommunityModelOpen} handleClose={() => dispatch(setCreateCommunityModelOpen(false))} />

      {(mySnippets.filter(snippet => snippet.isModerator).length > 0) && <div className="w-full font-semibold tracking-wide mb-1 flex flex-col gap-1">
        <h3 className="text-gray-200">Moderating</h3>

        {mySnippets.filter(snippet => snippet.isModerator).map((snippet, index) => (
          <MenuListItem key={index} displayText={`h/${snippet.communityId}`} link={`/h/${snippet.communityId}`} imageURL={snippet.imageURL} />
        ))}

        <hr className="w-full border-gray-700 mb-3" />
      </div>}


      <div className="w-full font-semibold tracking-wide mb-1 flex flex-col gap-1">
        <h3 className="text-gray-200">My Commmunities</h3>

        <MenuItem
          zIndex={10}
          bgColor="transparent"
          className="gap-2 rounded-md hover:bg-blue-700 hover:text-gray-100"
          onClick={() => { toggleMenuOpen(); dispatch(setCreateCommunityModelOpen(true)); }}
        >
          <RiAddLine size={32} />
          <span className="font-poppins ml-2 text-sm font-medium">
            Create Community
          </span>
        </MenuItem>

        {mySnippets.filter(snippet => !snippet.isModerator).map((snippet, index) => (
          <MenuListItem key={index} displayText={`h/${snippet.communityId}`} link={`/h/${snippet.communityId}`} imageURL={snippet.imageURL} />
        ))}
      </div>
    </>
  );
};

export default Communities;
