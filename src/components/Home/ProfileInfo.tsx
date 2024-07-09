import { firestore } from "@/firebase/clientApp";
import { Usertype } from "@/lib/Definations"
import { Post } from "@/slices/postSlice";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { Comment } from "../Post/Comments/CommentItem";
import { formatNumbers, formatPostDate, truncateText } from "@/lib/Utils";
import { Community } from "@/slices/communitySlice";
import useCommunity from "@/hooks/useCommunity";
import { RecommendedCommunitiesSkeleton } from "../Ui/Skeletons";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type ProfileinfoProps = {
  profileUser: Usertype;
}

function ProfileInfo({ profileUser }: ProfileinfoProps) {

  const [communities, setCommunities] = useState<Community[]>([])
  const [postKarma, setPostKarma] = useState(0);
  const [commentKarma, setCommentKarma] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { userCommunities: { mySnippets }, onJoinOrLeaveCommunity } = useCommunity();


  const getModeratingCommunities = useCallback(async () => {
    try {
      const communityQuery = query(
        collection(firestore, `users/${profileUser.uid}/communitySnippets`),
      );

      const communityDocs = await getDocs(communityQuery);
      const communities = communityDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCommunities(communities as Community[]);

    } catch (error) {
      console.log("getModeratingCommunities error: ", error);
    }
  }, [profileUser.uid]);

  const getProfileInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const profilePostsQuery = query(
        collection(firestore, `posts`),
        where("creatorId", "==", profileUser.uid)
      );

      const profileCommentsQuery = query(
        collection(firestore, `comments`),
        where("creatorId", "==", profileUser.uid)
      );
      const profilePosts = await getDocs(profilePostsQuery);
      const profileComments = await getDocs(profileCommentsQuery);
      const updatedPostKarma = (profilePosts.docs.map(post => ({ id: post.id, ...post.data() })) as Post[]).reduce((accumulator, post) => accumulator += post.voteStatus, 0)
      const updatedCommentKarma = (profileComments.docs.map(comment => ({ id: comment.id, ...comment.data() })) as Comment[]).reduce((accumulator, comment) => accumulator += comment.numberOfLikes, 0)

      await getModeratingCommunities()
      setPostKarma(updatedPostKarma);
      setCommentKarma(updatedCommentKarma);
    } catch (error) {
      console.log("getProfileInfo: ", error);
    } finally {
      setIsLoading(false);
    }

  }, [profileUser, getModeratingCommunities]);

  useEffect(() => {
    getProfileInfo();

    return () => {
      setPostKarma(0);
      setCommentKarma(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <div className="w-full rounded-2xl border-[1px] border-dimGray">

      <div className='relative h-28 mb-4 overflow-hidden rounded-t-2xl'>
        <img src="/profile-bg.jpg" className='absolute object-cover' alt="" />
        <h3 className='relative z-10 top-3 left-4 w-fit font-semibold tracking-wide text-zinc-900'>profile</h3>
      </div>

      <div className="p-4 max-h-[calc(100dvh-270px)] overflow-y-scroll">
        <h2 className="text-xl font-chillax font-medium tracking-wide">{profileUser.displayName || profileUser.email.split('@')[0]}</h2>

        <div className="flex justify-between mt-3 w-full font-poppins tracking-wide">
          <div className="flex flex-col gap-2 text-xs">
            <span className="text-sm font-medium">{formatNumbers(postKarma)}</span>
            <span>Post Karma</span>
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <span className="text-sm font-medium">{formatNumbers(commentKarma)}</span>
            <span>Comment Karma</span>
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <span className="text-sm font-medium">{formatPostDate('only-date', profileUser.createdAt.seconds * 1000)}</span>
            <span>Cake Day</span>
          </div>
        </div>


        {!!communities.length && <>
          <hr className="border-dimGray my-4" />
          <h3 className='my-4 font-semibold tracking-wide text-zinc-400'>MODERATOR OF THESE COMMUNITIES</h3>
        </>}

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
  )
}

export default ProfileInfo