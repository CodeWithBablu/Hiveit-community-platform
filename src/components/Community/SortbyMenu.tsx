// type Props = {

import { resetPostStatevalue, setFilter, setPostFetchingParams } from "@/slices";
import { PostState, SortBy } from "@/slices/postSlice";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { RiArrowDropDownLine } from "@remixicon/react";
import { useDispatch, useSelector } from "react-redux";


const sortByOptions = ["latest", "top", "hot"];

const SortbyMenu = () => {

  const { filter } = useSelector((state: { postState: PostState }) => state.postState);
  const dispatch = useDispatch();

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        _hover={{ outline: "none", background: "whiteAlpha.200" }}
        className="mx-1 h-10 rounded-md px-2 md:h-12"
      >
        <div className="flex items-center gap-3 px-2 py-2 text-lg font-chillax font-medium capitalize text-gray-300">
          {filter} <RiArrowDropDownLine size={30} />
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
            onClick={() => { dispatch(setFilter(option as SortBy)) }}
            color={"gray.500"}
            bgColor="transparent"
            className="gap-2 rounded-md hover:bg-blue-700 hover:text-gray-50"
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
