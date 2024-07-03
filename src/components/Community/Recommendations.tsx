import { firestore } from '@/firebase/clientApp';
import useCommunity from '@/hooks/useCommunity';
import { truncateText } from '@/lib/Utils';
import { Community } from '@/slices/communitySlice'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { RecommendedCommunitiesSkeleton } from '../Ui/Skeletons';
import useDirectory from '@/hooks/useDirectory';
import CreateCommunityModal from '../Modal/CreateCommunity/CreateCommunityModal';

// type Props = {}

const Recommendations = () => {

  const [communities, setCommunities] = useState<Community[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const { userCommunities: { mySnippets }, onJoinOrLeaveCommunity } = useCommunity();
  const { toggleMenuOpen } = useDirectory();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  const getCommunityRecommendation = useCallback(async () => {
    setIsLoading(true);

    try {
      const communityQuery = query(
        collection(firestore, "communities"),
        orderBy("numberOfMembers", "desc"),
        limit(5)
      );

      const communityDocs = await getDocs(communityQuery);
      const communities = communityDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCommunities(communities as Community[]);

    } catch (error) {
      console.log("getRecommendation error: ", error);
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    getCommunityRecommendation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (

    <div className="sticky top-14 w-[350px] h-fit mt-14 flex flex-col gap-10">


      <div className='rounded-2xl border-[1px] border-dimGray overflow-hidden'>
        <div className='relative h-32 mb-4 overflow-hidden rounded-t-2xl'>
          <img src="/community.svg" className='absolute object-cover' alt="" />
          <h3 className='relative z-10 top-3 left-4 font-semibold tracking-wide text-zinc-900'>Top Communities</h3>
        </div>

        <div className="p-4 w-full overflow-hidden">

          <div className='flex flex-col gap-5'>
            {isLoading ?
              <>
                <RecommendedCommunitiesSkeleton />
              </> :
              <>
                {
                  communities.map(community => {
                    const isJoined = !!mySnippets.find((snippet) => snippet.communityId === community.id)
                    return (
                      <Link to={`/h/${community.id}`} key={community.id} className='w-full flex justify-between items-center'>

                        <div className=' flex items-center gap-2'>
                          <div className="mr-2 h-[40px] w-[40px] shrink-0 bg-gradient-to-t from-gray-600 to-gray-900 to-80% rounded-full">
                            <img
                              className="h-[40px] w-[40px] rounded-full"
                              src={community.imageURL ? community.imageURL : '/profile.png'}
                              alt="comm img"
                            />
                          </div>

                          <span className={`text-gray-100 font-medium tracking-wide w-full ${isJoined ? 'max-w-[150px]' : 'max-w-[180px]'}`}>h/{isJoined ? truncateText(community.id, 10) : truncateText(community.id, 15)}</span>
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onJoinOrLeaveCommunity(community, isJoined); }}
                          className={`shrink-0 ${isJoined ? `w-28 ring-[1px] ring-gray-500 after:content-['Following'] hover:bg-rose-900/20 hover:text-rose-600 hover:ring-rose-950 hover:after:content-['unfollow']` : `w-20 bg-gray-100 text-zinc-900 after:content-['Follow']`} rounded-full py-2 text-center font-poppins text-sm font-medium tracking-wider transition-all duration-300 ease-in-out`}
                        ></motion.button>
                      </Link>
                    )
                  })
                }
              </>}
          </div>

        </div>
      </div>

      <div className="w-full rounded-2xl border-[1px] border-dimGray overflow-hidden">
        <div className='relative h-20 mb-4 rounded-t-2xl overflow-hidden'>
          <img src="/home-bg.avif" className='absolute object-cover object-center h-20 w-full' alt="" />
          <h3 className='relative z-10 top-3 left-4 font-semibold tracking-wide text-zinc-900'>Home</h3>
        </div>

        <div className='p-4 flex flex-col gap-3'>

          <div className='flex items-center gap-3'>
            <img className='w-[50px] h-[50px]' src="/Hiveit.png" alt="hiveit" />
            <h3 className='text-gray-200 font-medium text-lg'>Home</h3>
          </div>

          <h2 className='text-gray-400 text-[12px] text-center font-medium tracking-wide'>Your thoughts, our hive, one buzzing community!</h2>

          <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />

          <div className='flex flex-col gap-3'>
            <button onClick={() => setOpen(true)} className=" text-gray-200 bg-blue-600 hover:bg-blue-700 w-full rounded-full py-3 font-medium tracking-wider">Create Community</button>
            <button onClick={() => { scrollToTop(); toggleMenuOpen(); }} className=" text-gray-200 border-[1px] border-blue-600 hover:border-blue-700 w-full rounded-full py-3 font-medium tracking-wider">Create post</button>
          </div>
        </div>


      </div>

    </div>


  )
}

export default Recommendations