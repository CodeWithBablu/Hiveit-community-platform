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
          <motion.button onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)} whileTap={{ scale: 0.9 }} className={` w-28 text-center font-semibold text-lg rounded-full py-1 ${isJoined ? 'ring-2 ring-indigo-300' : 'bg-indigo-500'}`}>{isJoined ? 'Joined' : 'Join'}</motion.button>
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
            <motion.button onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)} whileTap={{ scale: 0.9 }} className={` w-28 text-center font-semibold text-lg rounded-full py-1 ${isJoined ? 'ring-2 ring-indigo-300' : 'bg-indigo-500'}`}>{isJoined ? 'Joined' : 'Join'}</motion.button>
          </div>
        </div>

        <div className=' flex flex-col gap-2 p-2 md:p-3'>
          <h1 className=' font-poppins font-medium text-xl'>{communityData.id}</h1>
          <p className='text-zinc-400 text-sm'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Earum consectetur, enim dignissimos corrupti adipisci nisi.</p>

          <div className=' flex items-center justify-end gap-3 text-sm text-zinc-400 font-medium'>
            <div className=' flex items-center gap-2'>
              <RiLink size={20} />
              <a className=' text-indigo-400 underline underline-offset-2 hover:text-indigo-300'>pawan890@.com</a>
            </div>
            <div className=' flex items-center gap-2'>
              <RiCalendar2Line size={20} />
              <span>Since June 2021</span>
            </div>
          </div>

        </div>
      </main>

    </div>
  )
}

export default Header