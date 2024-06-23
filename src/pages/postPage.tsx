import About from "@/components/Community/About"
import PageLayout from "@/components/Layout/PageLayout"
import PostItem from "@/components/Post/PostItem";
import { auth } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import { useAuthState } from "react-firebase-hooks/auth";

function PostPage() {
  const { postStateValue, onVote, OnDeletePost } = usePosts();
  const [user] = useAuthState(auth);
  return (
    <div className="bg-zinc-950">
      <PageLayout>
        <>
          {postStateValue.selectedPost && (<PostItem post={postStateValue.selectedPost}
            onVote={onVote}
            onDeletePost={OnDeletePost}
            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
            userVoteValue={postStateValue.postVotes.find((vote) => vote.postId === postStateValue.selectedPost?.id)?.voteValue}
          />)}
          {/* Comments */}
        </>
        <>
          {/* <About/> */}
        </>
      </PageLayout>
    </div>
  )
}

export default PostPage