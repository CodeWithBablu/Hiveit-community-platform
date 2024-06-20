import { firestore, storage } from "@/firebase/clientApp";
import { timestampToMillis } from "@/lib/Utils";
import { removePost, setPostStateValue, setPosts } from "@/slices";
import { Post, PostState } from "@/slices/postSlice";
import { deleteDoc, doc, increment, updateDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore/lite";
import { deleteObject, listAll, ref } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";

const usePosts = () => {
  const postStateValue = useSelector(
    (state: { postState: PostState }) => state.postState,
  );
  const dispatch = useDispatch();

  const setPostsValue = (posts: Post[]) => {
    dispatch(
      setPosts(
        posts.map((post) => ({
          ...post,
          createdAt: timestampToMillis(post.createdAt as Timestamp),
        })),
      ),
    );
  };

  const onVote = async () => { };

  const onSelectPost = () => { };

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
      console.log(post.createdAt);
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
  };
};

export default usePosts;
