import { MenuItem } from "@chakra-ui/react";
import CreateCommunityModal from "../../Modal/CreateCommunity/CreateCommunityModal";
import { useState } from "react";
import { RiAddLine } from "@remixicon/react";
import { useSelector } from "react-redux";
import { CommunitiesState, CommunitySnippet } from "@/slices/communitySlice";
import MenuListItem from "./MenuListItem";

// type Props = {}

const Communities = () => {
  const [open, setOpen] = useState(false);
  const mySnippets: CommunitySnippet[] = useSelector(
    (state: { communitiesState: CommunitiesState }) => state.communitiesState.mySnippets,
  );


  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />

      <div className="w-full font-semibold tracking-wide mb-1">
        <h3 className="text-gray-200">Moderating</h3>
      </div>

      {mySnippets.filter(snippet => snippet.isModerator).map((snippet, index) => (
        <MenuListItem key={index} displayText={`h/${snippet.communityId}`} link={`/h/${snippet.communityId}`} imageURL={snippet.imageURL} />
      ))}

      <hr className="border-[1px] w-full border-gray-800 mt-2 mb-3" />

      <div className="w-full font-semibold tracking-wide mb-1">
        <h3 className="text-gray-200">My Commmunities</h3>
      </div>
      <MenuItem
        zIndex={10}
        bgColor="transparent"
        className="gap-2 rounded-md hover:bg-zinc-900 hover:text-gray-100"
        onClick={() => setOpen(true)}
      >
        <RiAddLine size={32} />
        <span className="font-poppins ml-2 text-sm font-medium">
          Create Community
        </span>
      </MenuItem>

      {mySnippets.filter(snippet => !snippet.isModerator).map((snippet, index) => (
        <MenuListItem key={index} displayText={`h/${snippet.communityId}`} link={`/h/${snippet.communityId}`} imageURL={snippet.imageURL} />
      ))}
    </>
  );
};

export default Communities;
