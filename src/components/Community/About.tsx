
// type Props = {}

import { formatPostDate, timestampToMillis } from "@/lib/Utils";
import { Community } from "@/slices/communitySlice"
import { RiCalendar2Line, RiMoreFill } from "@remixicon/react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";

type AboutProps = {
  communityData: Community;
}

function About({ communityData }: AboutProps) {

  const navigate = useNavigate();

  return (
    <div className="sticky top-10 h-fit mt-32 p-4 w-full max-w-[400px] rounded-2xl border-[1px] border-gray-800">
      <div className="flex justify-between gap-2">
        <h2 className="font-chillax font-medium text-gray-50 tracking-wider text-[18px]">About Community</h2>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="cursor-pointer rounded-full border-[1px] border-zinc-700 p-1 hover:bg-zinc-800"
        >
          <RiMoreFill size={20} />
        </motion.button>
      </div>

      <div className="h-max whitespace-pre-wrap font-poppins break-words mt-3 text-gray-300 tracking-wide text-sm">
        {communityData.description}
      </div>

      <div>

        <div className="grid grid-cols-2 mt-3 gap-3">
          <div className="flex flex-col gap-2 font-chillax font-medium">
            <span>102 k</span>
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
            {formatPostDate('only-date', timestampToMillis(communityData.createdAt))}
          </span>
        </div>

        <button onClick={() => navigate(`submit`)} className="border-[1px] border-blue-600 shadow-[0px_0px_15px_0px_rgba(37,99,235,0.3)] w-full rounded-full py-2 font-semibold tracking-wider mt-5">Creat post</button>

      </div>
    </div>
  )
}

export default About