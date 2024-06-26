// type Props = {

import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { RiArrowDropDownLine } from "@remixicon/react";
import { useState } from "react";

// }

type SortBy = "latest" | "top" | "rising";
const sortByOptions = ["latest", "top", "rising"];

const SortbyMenu = () => {
  const [sortby, setSortby] = useState<SortBy>("latest");

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        _hover={{ outline: "none", background: "whiteAlpha.200" }}
        className="mx-1 h-10 rounded-md px-2 md:h-12"
      >
        <div className="flex items-center gap-3 px-2 py-2 text-lg font-chillax font-medium capitalize text-blue-500">
          {sortby} <RiArrowDropDownLine size={30} />
        </div>
      </MenuButton>
      <MenuList
        boxShadow={"0px 0px 30px 0px rgba(225,225,225,0.5)"}
        padding={"10px 10px"}
        borderRadius={10}
        borderColor="gray.600"
        bgColor="blackAlpha.900"
        className="flex flex-col items-center p-2"
      >
        {sortByOptions.map((option, index) => (
          <MenuItem
            key={index}
            onClick={() => setSortby(option as SortBy)}
            color={"gray.500"}
            bgColor="transparent"
            className="gap-2 rounded-md hover:bg-zinc-900 hover:text-gray-50"
          >
            <span className="cursor-pointer text-lg font-chillax font-semibold capitalize">
              {option}
            </span>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default SortbyMenu;
