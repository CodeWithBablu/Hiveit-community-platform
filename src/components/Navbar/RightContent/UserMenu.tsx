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
import { auth, firestore } from "../../../firebase/clientApp";
import { setAuthModalState } from "../../../slices";
import { formatNumbers, getAvatarCode, truncateText } from "@/lib/Utils";
import { avatars } from "@/config/avatar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { Post } from "@/slices/postSlice";

type Props = {
  user: User;
};

const UserMenu = ({ user }: Props) => {
  const [masterImage, setMasterImage] = useState("");
  const [postKarma, setPostKarma] = useState(0);


  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getPostmasterImage = async () => {
      const imageRef = doc(firestore, `users/${user.uid}`);
      const image = await getDoc(imageRef);
      const data = image.data();
      if (data && data.providerData[0].photoURL) {
        setMasterImage(data.providerData[0].photoURL);
      }

      const profilePostsQuery = query(
        collection(firestore, `posts`),
        where("creatorId", "==", user.uid)
      );

      const profilePosts = await getDocs(profilePostsQuery);
      const updatedPostKarma = (profilePosts.docs.map(post => ({ id: post.id, ...post.data() })) as Post[]).reduce((accumulator, post) => accumulator += post.voteStatus, 0)
      setPostKarma(updatedPostKarma);
    };

    getPostmasterImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  let photoURL = avatars[getAvatarCode(user.displayName || user.email?.split('@')[0] as string)].url;

  if (masterImage)
    photoURL = masterImage;
  else if (user.providerData[0].photoURL)
    photoURL = user.providerData[0].photoURL;

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        _hover={{ outline: "none", background: "whiteAlpha.200" }}
        className="mx-1 h-10 rounded-md px-2 md:h-12 shrink-0"
      >
        <div className="flex items-center space-x-1">
          {user ? (
            <div className="flex items-center justify-around shadow-2xl shadow-secondary/20 space-x-2">
              <img
                className="h-[30px] w-[30px] rounded-full lg:h-[40px] lg:w-[40px] bg-gradient-to-b from-zinc-900 to-zinc-600"
                src={photoURL}
                alt="profile img"
              />

              <span className="flex lg:hidden items-center shrink-0 text-sm text-secondary">
                <RiBardLine size={20} />
                <span>{formatNumbers(postKarma)}</span>
              </span>

              <div className="hidden flex-col lg:flex">
                <span className="hidden lg:inline-block">
                  {truncateText(
                    user.displayName || (user.email?.split("@")[0] as string),
                    15,
                  )}
                </span>
                <span className="flex items-center text-sm text-gray-400">
                  <RiBardLine size={20} className="text-secondary" /> <span className="text-secondary mr-1">{formatNumbers(postKarma)}</span> Karma
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
