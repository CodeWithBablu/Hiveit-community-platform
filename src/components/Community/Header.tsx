import {
  RiArrowLeftLine,
  RiMoreFill,
  RiCalendar2Line,
  RiLink,
  RiAddLine,
} from "@remixicon/react";
import { motion } from "framer-motion";

import { CommunitiesState, Community } from "../../slices/communitySlice";
import useCommunity from "../../hooks/useCommunity";
import SortbyMenu from "./SortbyMenu";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { formatPostDate, timestampToMillis } from "@/lib/Utils";
import { useSelector } from "react-redux";

type Props = {
  communityData: Community;
};

const Header = ({ communityData }: Props) => {
  const { userCommunities, onJoinOrLeaveCommunity } = useCommunity();

  const targetRef = useRef<HTMLDivElement>(null);
  const [isAtTop, setIsAtTop] = useState(false);

  const currCommunity: Community | undefined = useSelector(
    (state: { communitiesState: CommunitiesState }) => state.communitiesState.currentCommunity,
  );

  const navigate = useNavigate();

  const isJoined = !!userCommunities.mySnippets.find(
    (snippet) => snippet.communityId === communityData.id,
  );

  useEffect(() => {
    const handleScroll = () => {
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        if (rect.top <= 5 && !isAtTop) setIsAtTop(true);
        else if (rect.top > 5 && isAtTop) setIsAtTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isAtTop]);

  return (
    <>
      <div className="sticky top-0 z-10 flex h-14 w-full items-center justify-between bg-blackAplha800 px-4 text-xs text-gray-400 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <RiArrowLeftLine
            className="cursor-pointer text-gray-300 hover:text-gray-50"
            onClick={() => navigate(-1)}
            size={25}
          />
          <div className="flex flex-col">
            <span className="font-dynapuff text-xl font-semibold tracking-wider text-white">
              {communityData.id}
            </span>
            <span>{currCommunity ? currCommunity.numberOfPosts : communityData.numberOfPosts} posts</span>
          </div>
        </div>
        <div
          className={clsx(
            "flex items-center gap-4 text-white transition-all duration-300 ease-in",
            {
              hidden: !isAtTop,
              "inline-block": isAtTop,
            },
          )}
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer rounded-full border-[1px] border-zinc-700 p-1 hover:bg-zinc-800"
          >
            <RiMoreFill size={20} />
          </motion.button>
          <motion.button
            onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
            whileTap={{ scale: 0.9 }}
            className={` ${isJoined ? `w-32 ring-[1px] ring-gray-500 after:content-['Following'] hover:bg-rose-900/20 hover:text-rose-600 hover:ring-rose-950 hover:after:content-['unfollow']` : `w-28 bg-gray-100 text-zinc-900 after:content-['Follow']`} rounded-full py-2 text-center font-chillax text-lg font-semibold tracking-wider transition-all duration-300 ease-in-out`}
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

        <div className="flex h-20 items-center justify-between px-4">
          <div className="relative -top-10 rounded-full bg-red-500 p-1">
            <img
              className="h-20 w-20 rounded-full md:h-[120px] md:w-[120px]"
              src="/profile.png"
              alt=""
            />
          </div>

          <div
            ref={targetRef}
            className="sticky top-0 flex items-center gap-4 text-white"
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer rounded-full border-[1px] border-zinc-700 p-1 hover:bg-zinc-800"
            >
              <RiMoreFill size={20} />
            </motion.button>
            <motion.button
              onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
              whileTap={{ scale: 0.9 }}
              className={` ${isJoined ? `w-32 ring-[1px] ring-gray-500 after:content-['Following'] hover:bg-rose-900/20 hover:text-rose-600 hover:ring-rose-950 hover:after:content-['unfollow']` : `w-28 bg-gray-100 text-zinc-900 after:content-['Follow']`} rounded-full py-2 text-center font-chillax text-lg font-semibold tracking-wider transition-all duration-300 ease-in-out`}
            ></motion.button>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-4 py-2 md:p-4">
          <h1 className="font-poppins text-xl font-medium sm:text-2xl">
            {communityData.id}
          </h1>
          <p className="text-sm sm:text-base text-zinc-400">{communityData.description}</p>

          <div className="flex items-center justify-end gap-3 font-chillax font-medium text-zinc-400">
            <div className="flex items-center gap-2">
              <RiLink size={20} />
              <a
                href={`mailto:pawan890@.com`}
                className="cursor-pointer text-base font-normal tracking-wide text-sky-500 hover:text-sky-300"
              >
                pawan890@.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <RiCalendar2Line size={20} />
              <span className="text-base">
                Since{" "}
                {formatPostDate('only-date', timestampToMillis(communityData.createdAt))}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-5 mt-10 flex w-full items-center justify-between px-2">
          <SortbyMenu />
          <button
            onClick={() => navigate(`submit`)}
            className="flex items-center gap-2 rounded-full px-4 py-3 text-base font-semibold shadow-[0px_0px_15px_0px_rgba(37,99,235,0.3)] ring-[1px] ring-blue-600"
          >
            <RiAddLine size={20} /> Create post
          </button>
        </div>
      </main>
    </>
  );
};

export default Header;
