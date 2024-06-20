import { MenuItem } from "@chakra-ui/react";
import CreateCommunityModal from "../../Modal/CreateCommunity/CreateCommunityModal";
import { useState } from "react";
import { RiAddLine } from "@remixicon/react";

// type Props = {}

const Communities = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <MenuItem
        zIndex={50}
        bgColor="transparent"
        className="gap-2 rounded-md hover:bg-zinc-900 hover:text-gray-100"
        onClick={() => setOpen(true)}
      >
        <RiAddLine size={28} className="" />
        <span className="font-poppins text-lg font-medium">
          Create Community
        </span>
      </MenuItem>
    </>
  );
};

export default Communities;
