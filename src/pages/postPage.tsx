import About from "@/components/Community/About"
import PageLayout from "@/components/Layout/PageLayout"
import Comments from "@/components/Post/Comments/Comments";
import PostItem from "@/components/Post/PostItem";
import { auth, firestore } from "@/firebase/clientApp";
import useCommunity from "@/hooks/useCommunity";
import usePosts from "@/hooks/usePosts";
import { timestampToMillis } from "@/lib/Utils";
import { setSelectedPost } from "@/slices";
import { Post } from "@/slices/postSlice";
import { Spinner } from "@chakra-ui/react";
import { RiArrowLeftLine } from "@remixicon/react";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function PostPage() {
  const { postStateValue, onVote, OnDeletePost } = usePosts();
  const [user] = useAuthState(auth);
  const { userCommunities } = useCommunity();


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postId } = useParams();

  const fetchPost = async (postId: string) => {
    try {
      const postDocRef = doc(firestore, 'posts', postId);
      const postDoc = await getDoc(postDocRef);
      let post = { id: postDoc.id, ...postDoc.data() } as Post;
      post = { ...post, createdAt: timestampToMillis(post.createdAt as Timestamp) };
      dispatch(setSelectedPost({ post }));

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (postId && !postStateValue.selectedPost) {
      fetchPost(postId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, postStateValue.selectedPost]);

  const currentCommunity = userCommunities.currentCommunity || undefined;


  return (
    <div className="bg-zinc-950">
      <PageLayout>
        <>
          <div className="sticky top-0 z-[5] flex h-14 w-full items-center justify-between bg-zinc-950/80 px-4 text-xs text-gray-400 backdrop-blur-xl">
            <div className="flex items-center gap-6">
              <RiArrowLeftLine
                className="cursor-pointer text-gray-300 hover:text-gray-50"
                onClick={() => navigate(-1)}
                size={25}
              />
              <div className="font-chillax text-xl font-semibold tracking-wider text-white">
                Post
              </div>
            </div>
          </div>

          {!postStateValue.selectedPost && (
            <div className="flex items-center justify-center w-full h-32">
              <Spinner size={'lg'} thickness="3px" speed="0.75s" color="#2563eb" />
            </div>
          )}

          {postStateValue.selectedPost && (<PostItem post={postStateValue.selectedPost}
            onVote={onVote}
            onDeletePost={OnDeletePost}
            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
            userVoteValue={postStateValue.postVotes.find((vote) => vote.postId === postStateValue.selectedPost?.id)?.voteValue}
          />)}

          {/* Comments */}
          {(postStateValue.selectedPost) && <Comments user={user} communityId={postStateValue.selectedPost?.communityId} selectedPost={postStateValue.selectedPost!} />}
        </>
        <>
          {currentCommunity &&
            <div className="sticky top-14 w-full max-w-[350px] h-fit mt-14">
              <About communityData={currentCommunity} />
            </div>
          }
        </>
      </PageLayout>
    </div>
  )
}

export default PostPage