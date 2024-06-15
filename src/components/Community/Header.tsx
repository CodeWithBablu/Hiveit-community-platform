import {
  RiArrowLeftLine,
  RiMoreFill,
  RiCalendar2Line,
  RiLink,
} from "@remixicon/react";
import { motion } from "framer-motion";

import { Community } from "../../slices/communitySlice";
import useCommunity from "../../hooks/useCommunity";

type Props = {
  communityData: Community;
};

const Header = ({ communityData }: Props) => {
  const { userCommunities, onJoinOrLeaveCommunity } = useCommunity();
  const isJoined = !!userCommunities.mySnippets.find(
    (snippet) => snippet.communityId === communityData.id,
  );

  return (
    <div className="font-poppins text-white">
      <div className="flex h-14 w-full items-center justify-between bg-blackAplha500 px-2 text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <RiArrowLeftLine size={25} />
          <div className="flex flex-col">
            <span className="font-dynapuff text-xl text-white">
              {communityData.id}
            </span>
            <span>200 posts</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-white">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer rounded-full border-[1px] border-zinc-700 p-1 hover:bg-zinc-800"
          >
            <RiMoreFill size={25} />
          </motion.button>
          <motion.button
            onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
            whileTap={{ scale: 0.9 }}
            className={` ${isJoined ? `w-32 ring-[1px] ring-gray-300 after:content-['Following'] hover:bg-rose-900/20 hover:text-rose-600 hover:ring-rose-950 hover:after:content-['unfollow']` : `w-28 bg-gray-100 text-zinc-900 after:content-['Follow']`} rounded-full py-2 text-center font-chillax text-lg font-semibold tracking-wider transition-all duration-300 ease-in-out`}
          ></motion.button>
        </div>
      </div>

      <main>
        <div className="h-64 overflow-hidden shadow-lg md:rounded-r-xl">
          <img
            className="h-full w-full object-cover"
            src={
              communityData.bgImageURL
                ? communityData.bgImageURL
                : "/community.svg"
            }
            alt=""
          />
        </div>

        <div className="flex h-20 items-center justify-between px-2">
          <div className="relative -top-10 rounded-full bg-indigo-300 p-1">
            <img
              className="h-20 w-20 rounded-full md:h-[120px] md:w-[120px]"
              src="/profile.png"
              alt=""
            />
          </div>

          <div className="flex items-center gap-4 text-white">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer rounded-full border-[1px] border-zinc-700 p-1 hover:bg-zinc-800"
            >
              <RiMoreFill size={25} />
            </motion.button>
            <motion.button
              onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
              whileTap={{ scale: 0.9 }}
              className={` ${isJoined ? `w-32 ring-[1px] ring-gray-500 after:content-['Following'] hover:bg-rose-900/20 hover:text-rose-600 hover:ring-rose-950 hover:after:content-['unfollow']` : `w-28 bg-gray-100 text-zinc-900 after:content-['Follow']`} rounded-full py-2 text-center font-chillax text-lg font-semibold tracking-wider transition-all duration-300 ease-in-out`}
            ></motion.button>
          </div>
        </div>

        <div className="flex flex-col gap-2 p-2 md:p-3">
          <h1 className="font-poppins text-xl font-medium sm:text-2xl">
            {communityData.id}
          </h1>
          <p className="text-lg text-zinc-400">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Earum
            consectetur, enim dignissimos corrupti adipisci nisi.
          </p>

          <div className="flex items-center justify-end gap-3 font-medium text-zinc-400">
            <div className="flex items-center gap-2">
              <RiLink size={20} />
              <a
                href={`mailto:pawan890@.com`}
                className="cursor-pointer text-base font-normal text-sky-500 hover:text-sky-300 sm:text-lg"
              >
                pawan890@.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <RiCalendar2Line size={20} />
              <span className="text-base sm:text-lg">Since June 2021</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Header;
