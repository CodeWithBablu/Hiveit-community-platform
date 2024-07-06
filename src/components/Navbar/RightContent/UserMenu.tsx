import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";

import { signOut, User } from "firebase/auth";

import {
  RiArrowDropDownLine,
  RiBardLine,
  RiLoginBoxLine,
  RiLogoutBoxLine,
  RiProfileLine,
  RiUser4Line,
} from "@remixicon/react";
import { useDispatch } from "react-redux";
import { auth } from "../../../firebase/clientApp";
import { setAuthModalState } from "../../../slices";
import { getAvatarCode, truncateText } from "@/lib/Utils";
import { avatars } from "@/config/avatar";
import { useNavigate } from "react-router-dom";

type Props = {
  user: User;
};

const UserMenu = ({ user }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        _hover={{ outline: "none", background: "whiteAlpha.200" }}
        className="mx-1 h-10 rounded-md px-2 md:h-12"
      >
        <div className="flex items-center space-x-1">
          {user ? (
            <div className="flex items-center justify-around shadow-2xl shadow-secondary/20 space-x-2">
              <img
                className="h-[30px] w-[30px] rounded-full lg:h-[40px] lg:w-[40px] bg-gradient-to-b from-zinc-900 to-zinc-600"
                src={
                  user.providerData[0].photoURL
                    ? user.providerData[0].photoURL
                    : avatars[getAvatarCode(user.displayName || user.email?.split('@')[0] as string)].url
                }
                alt=""
              />

              <div className="hidden flex-col lg:flex">
                <span className="hidden lg:inline-block">
                  {truncateText(
                    user.displayName || (user.email?.split("@")[0] as string),
                    15,
                  )}
                </span>
                <span className="flex items-center text-sm text-gray-500">
                  <RiBardLine size={20} className="text-secondary" /> 1 Karma
                </span>
              </div>
            </div>
          ) : (
            <RiUser4Line size={24} className="" />
          )}
          <RiArrowDropDownLine size={20} />
        </div>
      </MenuButton>
      <MenuList
        zIndex={30}
        boxShadow={"0px 0px 15px 0px rgba(225,225,225,0.3)"}
        padding={"10px 10px"}
        color={"gray.400"}
        borderRadius={10}
        borderColor="gray.600"
        bgColor="blackAlpha.900"
        className="flex flex-col items-center p-2"
      >
        {user ? (
          <>
            <MenuItem
              bgColor="transparent"
              className="gap-2 rounded-md hover:bg-zinc-900 hover:text-gray-100"
              onClick={() => navigate(`/profile/${user.displayName || user.email?.split('@')[0]}`)}
            >
              <RiProfileLine size={28} className="" />
              <span className="font-poppins text-lg font-medium">Profile</span>
            </MenuItem>
            <MenuItem
              bgColor="transparent"
              className="gap-2 rounded-md hover:bg-zinc-900 hover:text-rose-500"
              onClick={logout}
            >
              <RiLogoutBoxLine size={24} className="" />
              <span className="font-poppins text-lg font-medium">Logout</span>
            </MenuItem>
          </>
        ) : (
          <MenuItem
            bgColor="transparent"
            onClick={() =>
              dispatch(setAuthModalState({ open: true, view: "login" }))
            }
            className="gap-2 rounded-md hover:bg-zinc-900 hover:text-gray-100"
          >
            <RiLoginBoxLine size={20} className="" />
            <span className="font-poppins text-lg font-medium">Login</span>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
