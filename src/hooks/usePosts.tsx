import { auth, firestore, storage } from "@/firebase/clientApp";
import { Toast } from "@/lib/Toast";
import { timestampToMillis } from "@/lib/Utils";
import { removePost, setAuthModalState, setPostStateValue, setPostVotes, setPosts, setSelectedPost } from "@/slices";
import { CommunitiesState, Community } from "@/slices/communitySlice";
import { Post, PostState, PostVote } from "@/slices/postSlice";
import { collection, deleteDoc, doc, getDoc, getDocs, increment, query, updateDoc, where, writeBatch } from "firebase/firestore";
import { Timestamp } from "firebase/firestore/lite";
import { deleteObject, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const usePosts = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  const [user, loadingUser] = useAuthState(auth);
  const postStateValue = useSelector(
    (state: { postState: PostState }) => state.postState,
  );

  const currentCommunity: Community | undefined = useSelector(
    (state: { communitiesState: CommunitiesState }) => state.communitiesState.currentCommunity,
  );

  useEffect(() => {
    if (!user?.uid || !currentCommunity) return;
    getCommunityPostVotes(currentCommunity.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentCommunity]);

  useEffect(() => {
    // Logout or no authenticated user
    if (!user?.uid && !loadingUser) {
      dispatch(setPostVotes({ postVotes: [] }));

      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loadingUser]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const setPostsValue = async (posts: Post[], isHomepage = false) => {
    const updatedPosts = await Promise.all(
      posts.map(async (post) => {
        post = { ...post, createdAt: timestampToMillis(post.createdAt as Timestamp) };

        const { communityImgURL } = post;
        if (!communityImgURL && isHomepage) {
          const communityDoc = (await getDoc(doc(firestore, 'communities', post.communityId))).data();
          if (communityDoc?.imageURL) {
            await updateDoc(doc(firestore, `posts`, post.id!), { communityImgURL: communityDoc.imageURL });
            return { ...post, communityImgURL: communityDoc.imageURL };
          }
        }
        return post;
      })
    );

    dispatch(setPosts(updatedPosts));
  };

  const onVote = async (e: React.MouseEvent<HTMLDivElement>, post: Post, vote: number, communityId: string) => {
    e.stopPropagation();
    // check if user is authorized=> if not open auth model
    if (!user) return dispatch(setAuthModalState({ open: true, view: "login" }));

    setLoading(true);
    try {
      const { voteStatus } = post;
      const existingVote = postStateValue.postVotes.find((vote) => vote.postId === post.id);

      const batch = writeBatch(firestore);
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];
      let voteChange = vote;
      if (!existingVote) {
        //create a new postVote document
        const postVoteRef = doc(collection(firestore, "users", `${user?.uid}/postVotes`));

        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id!,
          communityId,
          voteValue: vote,// 1 or -1
        }

        batch.set(postVoteRef, newVote);

        //add/substract 1 to/from post.voteStatus
        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      }
      //Existing vote - they have voted on the post before
      else {

        const postVoteRef = doc(firestore, "users", `${user?.uid}/postVotes/${existingVote.id}`);

        //removing their vote (up=> neutral OR down => neutral)
        if (existingVote.voteValue === vote) {

          //add/substract 1 to/from post.voteStatus
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter((vote) => vote.id !== existingVote.id);

          //delete the postValue document
          batch.delete(postVoteRef);
          voteChange *= -1;
        }
        // Flipping their vote (up=>down OR down=>up)
        else {
          // add or substract 2 to/from post.voteStatus
          updatedPost.voteStatus = post.voteStatus + (vote * 2);
          updatedPostVotes = updatedPostVotes.map(postVote => {
            if (postVote.id === existingVote.id) {
              return { ...postVote, voteValue: vote }
            }
            else
              return postVote;
          });

          //updating the existing postVote document
          batch.update(postVoteRef, {
            voteValue: vote,
          });

          voteChange = 2 * vote;
        }

      }

      // update our post document
      const postRef = doc(firestore, 'posts', post.id!);
      batch.update(postRef, {
        voteStatus: voteStatus + voteChange
      });

      await batch.commit();


      const postIdx = postStateValue.posts.findIndex(
        (item) => item.id === post.id
      );

      updatedPosts[postIdx!] = updatedPost;

      const updatedPostState = {
        ...postStateValue,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
        ...(postStateValue.selectedPost && { selectedPost: updatedPost })
      };

      dispatch(setPostStateValue(updatedPostState));
    } catch (error) {
      Toast('error-bottom', 'failed to vote. try again later', 3000);
    }
    finally {
      setLoading(false);
    }
  };

  async function getCommunityPostVotes(communityId: string) {
    const postVotesQuery = query(
      collection(firestore, `users/${user?.uid}/postVotes`),
      where("communityId", "==", communityId)
    );
    const postVoteDocs = await getDocs(postVotesQuery);
    const postVotes = postVoteDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PostVote[];


    dispatch(setPostVotes({ postVotes }));

    // const unsubscribe = onSnapshot(postVotesQuery, (querySnapshot) => {
    //   const postVotes = querySnapshot.docs.map((postVote) => ({
    //     id: postVote.id,
    //     ...postVote.data(),
    //   }));

    // });

    // return () => unsubscribe();
  }

  const onSelectPost = (post: Post) => {
    dispatch(setSelectedPost({ post }));
    navigate(`/h/${post.communityId}/comments/${post.id}`);
  };

  const OnDeletePost = async (post: Post): Promise<boolean> => {
    try {
      //check if gallery exists, delete gallery if exists
      if (post.gallery && post.gallery.length > 0) {
        console.log("hi");
        await clearUpPostFiles(post);
      }

      //delete the post
      const postDocRef = doc(firestore, 'posts', post.id!);
      await deleteDoc(postDocRef);
      const communityDocRef = doc(firestore, "communities", post.communityId);
      await updateDoc(communityDocRef, {
        numberOfPosts: increment(-1),
      });

      //update state (postStateValue)
      dispatch(removePost({ postId: post.id! }));
      return true;
    } catch (error) {
      return false;
    }
    return true;
  };

  const clearUpPostFiles = async (post: Post) => {
    try {
      const storageRef = ref(storage, `posts/${post.id}`);
      const listResult = await listAll(storageRef);
      console.log(listResult);
      const deletePromises = listResult.items.map((itemRef) =>
        deleteObject(itemRef),
      );
      await Promise.all(deletePromises);
    } catch (error) {
      return;
    }
  };

  return {
    postStateValue,
    setPostsValue,
    onVote,
    onSelectPost,
    OnDeletePost,
    loading
  };
};

export default usePosts;
