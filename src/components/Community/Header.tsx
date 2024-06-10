import { RiArrowLeftLine, RiMoreFill, RiCalendar2Line, RiLink } from '@remixicon/react';
import { motion } from 'framer-motion';

import { Community } from '../../slices/communitySlice'
import useCommunity from '../../hooks/useCommunity';

type Props = {
  communityData: Community;
}

const Header = ({ communityData }: Props) => {

  const { userCommunities, onJoinOrLeaveCommunity } = useCommunity();
  const isJoined = !!userCommunities.mySnippets.find((snippet) => snippet.communityId === communityData.id);


  return (
    <div className=' text-white font-poppins'>

      <div className=' flex items-center justify-between w-full h-14 px-2 text-gray-400 text-xs bg-blackAplha500'>
        <div className=' flex items-center gap-4'>
          <RiArrowLeftLine size={25} />
          <div className='flex flex-col'>
            <span className=' text-xl text-white font-dynapuff'>{communityData.id}</span>
            <span>200 posts</span>
          </div>
        </div>
        <div className=' flex items-center gap-4 text-white'>
          <motion.button whileTap={{ scale: 0.9 }} className=' p-1 cursor-pointer border-[1px] border-zinc-700 rounded-full hover:bg-zinc-800'><RiMoreFill size={25} /></motion.button>
          <motion.button onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)} whileTap={{ scale: 0.9 }} className={` ${isJoined ? `w-32 after:content-['Following'] hover:after:content-['unfollow'] ring-[1px] ring-gray-300 hover:ring-rose-950 hover:bg-rose-900/20 hover:text-rose-600` : `w-28 after:content-['Follow'] bg-gray-100 text-zinc-900`} text-center font-chillax font-semibold tracking-wider text-lg rounded-full py-2 transition-all duration-300 ease-in-out`}></motion.button>
        </div>
      </div>


      <main>
        <div className=' h-64 shadow-lg md:rounded-r-xl overflow-hidden'>
          <img className=' w-full h-full object-cover' src={communityData.bgImageURL ? communityData.bgImageURL : '/community.svg'} alt="" />
        </div>

        <div className=' flex items-center justify-between h-20 px-2'>
          <div className=' relative -top-10 rounded-full p-1 bg-indigo-300'>
            <img className='rounded-full w-20 h-20 md:w-[120px] md:h-[120px]' src="/profile.png" alt="" />
          </div>

          <div className=' flex items-center gap-4 text-white'>
            <motion.button whileTap={{ scale: 0.9 }} className=' p-1 cursor-pointer border-[1px] border-zinc-700 rounded-full hover:bg-zinc-800'><RiMoreFill size={25} /></motion.button>
            <motion.button onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)} whileTap={{ scale: 0.9 }} className={` ${isJoined ? `w-32 after:content-['Following'] hover:after:content-['unfollow'] ring-[1px] ring-gray-500 hover:ring-rose-950 hover:bg-rose-900/20 hover:text-rose-600` : `w-28 after:content-['Follow'] bg-gray-100 text-zinc-900`} text-center font-chillax font-semibold tracking-wider text-lg rounded-full py-2 transition-all duration-300 ease-in-out`}></motion.button>
          </div>
        </div>

        <div className=' flex flex-col gap-2 p-2 md:p-3'>
          <h1 className=' font-poppins font-medium text-xl sm:text-2xl'>{communityData.id}</h1>
          <p className='text-zinc-400 text-lg'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Earum consectetur, enim dignissimos corrupti adipisci nisi.</p>

          <div className=' flex items-center justify-end gap-3 text-zinc-400 font-medium'>
            <div className=' flex items-center gap-2'>
              <RiLink size={20} />
              <a href={`mailto:pawan890@.com`} className=' text-sky-500 text-base sm:text-lg font-normal hover:text-sky-300 cursor-pointer'>pawan890@.com</a>
            </div>
            <div className=' flex items-center gap-2'>
              <RiCalendar2Line size={20} />
              <span className='text-base sm:text-lg'>Since June 2021</span>
            </div>
          </div>

        </div>
      </main >

    </div >
  )
}

export default Header