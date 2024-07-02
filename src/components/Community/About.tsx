
// type Props = {}

import { auth } from "@/firebase/clientApp";
import useSelectFile from "@/hooks/useSelectFile";
import { formatNumbers, formatPostDate, timestampToMillis } from "@/lib/Utils";
import { setAuthModalState } from "@/slices";
import { Community } from "@/slices/communitySlice"
import { RiCalendar2Line, RiMoreFill } from "@remixicon/react"
import { Timestamp } from "firebase/firestore";
import { motion } from "framer-motion"
import { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

type AboutProps = {
  communityData: Community;
}

function About({ communityData }: AboutProps) {

  const [user] = useAuthState(auth);
  const fileSelectorRef = useRef<HTMLInputElement>(null);

  const { selectedFile, onSelectFile } = useSelectFile();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    if (!user)
      return dispatch(setAuthModalState({ open: true, view: "login" }));

    navigate(`/h/${communityData.id}/submit`);
  }

  return (
    <div className="p-4 w-full rounded-2xl border-[1px] border-gray-800">
      <div className="flex justify-between gap-2">
        <h2 className="font-chillax font-medium text-gray-50 tracking-wider text-[18px]">About Community</h2>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="cursor-pointer rounded-full border-[1px] border-zinc-700 p-1 hover:bg-zinc-800"
        >
          <RiMoreFill size={20} />
        </motion.button>
      </div>

      <div className="h-max whitespace-pre-wrap font-poppins break-words mt-3 text-slate-300 tracking-wider text-sm">
        {communityData.description}
      </div>

      <div>

        <div className="grid grid-cols-2 mt-3 gap-3">
          <div className="flex flex-col gap-2 font-chillax font-medium">
            <span>{formatNumbers(communityData.numberOfMembers)}</span>
            <span>Members</span>
          </div>

          <div className="flex flex-col gap-2 font-chillax font-medium">
            <span>100 M</span>
            <span><span className="bg-green-500 inline-block rounded-full w-2 h-2 mr-1 animate-pulse"></span>Online</span>
          </div>

        </div>

        <div className="flex items-center gap-2 mt-2 text-gray-400/80">
          <RiCalendar2Line size={20} />
          <span className="text-base">
            Since{" "}
            {(typeof communityData.createdAt === 'number') && formatPostDate('only-date', communityData.createdAt)}
            {(typeof communityData.createdAt !== 'number') && formatPostDate('only-date', (communityData.createdAt.seconds * 1000))}
          </span>
        </div>

        <button onClick={handleClick} className=" text-gray-200 border-[1px] border-blue-600 w-full rounded-full py-3 font-medium tracking-wider mt-5">Create post</button>

        {user?.uid === communityData.creatorId && (
          <>
            <hr className="border-gray-700 my-4" />
            <div className="flex flex-col font-chillax tracking-wide font-medium gap-3">
              <h3 className="text-slate-300">COMMUNITY SETTINGS</h3>
              <div className=" flex justify-between items-center">
                <span onClick={() => fileSelectorRef.current?.click()} className="text-blue-500 font-poppins hover:underline cursor-pointer text-sm">Community Appearance</span>

                {(selectedFile || communityData.imageURL) ?
                  <div className=" border-[1px] border-gray-800 rounded-full"><img className="rounded-full w-14 h-14 " src={selectedFile || communityData.imageURL} alt="community image" /></div> :
                  <div className=" border-[1px] border-gray-800 rounded-full"><img className="rounded-full w-14 h-14 " src={'/profile.png'} alt="community image" /></div>
                }
              </div>

              <input ref={fileSelectorRef} onChange={(e) => onSelectFile(e, "community_image", communityData)} id="file-upload" type="file" className="hidden" accept="image/x-png,image/gif,image/jpeg,/image/webp" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default About