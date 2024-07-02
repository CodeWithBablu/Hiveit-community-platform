import { firestore } from '@/firebase/clientApp';
import useCommunity from '@/hooks/useCommunity';
import { truncateText } from '@/lib/Utils';
import { Community } from '@/slices/communitySlice'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { RecommendedCommunitiesSkeleton } from '../Ui/Skeletons';

// type Props = {}

const Recommendations = () => {

  const [communities, setCommunities] = useState<Community[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { userCommunities: { mySnippets }, onJoinOrLeaveCommunity } = useCommunity();

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
                  <Link to={`/h/${community.id}`} key={community.id} className='w-full flex justify-between'>

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
  )
}

export default Recommendations