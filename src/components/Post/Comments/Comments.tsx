import { Post } from '@/slices/postSlice';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import CommentInput from './CommentInput';
import { Timestamp, collection, doc, getDocs, increment, orderBy, query, serverTimestamp, where, writeBatch } from 'firebase/firestore';
import { firestore } from '@/firebase/clientApp';
import { useDispatch } from 'react-redux';
import { setAuthModalState, setSelectedPost } from '@/slices';
import CommentItem, { Comment, LikedComment } from './CommentItem';
import { CommentSkeleton } from '@/components/Ui/Skeletons';
import { avatars } from '@/config/avatar';
import { getAvatarCode } from '@/lib/Utils';

type CommentsProps = {
  user: User | null | undefined;
  selectedPost: Post;
  communityId: string;
}

function Comments({ user, selectedPost, communityId, }: CommentsProps) {

  const [comments, setComments] = useState<Comment[]>([]);
  const [likedComments, setLikedComments] = useState<LikedComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [deletingComment, setDeletingComment] = useState<boolean>(false);

  const dispatch = useDispatch();

  const onCreateComment = async (commentText: string, user: User) => {
    if (!user)
      return dispatch(setAuthModalState({ open: true, view: "login" }));

    setCreateLoading(true);
    try {
      const batch = writeBatch(firestore);
      //create a comment doxument
      const commentDocRef = doc(collection(firestore, 'comments'));

      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorImage: user.photoURL || avatars[getAvatarCode(user.displayName || user.email?.split('@')[0] as string)].url,
        creatorDisplayName: user.displayName || user.email?.split('@')[0] as string,
        communityId,
        postId: selectedPost.id!,
        postTitle: selectedPost.title,
        text: commentText,
        numberOfLikes: 0,
        createdAt: serverTimestamp() as Timestamp,
      }

      batch.set(commentDocRef, newComment);

      // update post numberOfComment +1
      const postDocRef = doc(firestore, 'posts', selectedPost.id!);
      batch.update(postDocRef, { numberOfComments: increment(1) });

      await batch.commit();

      //update client redux state
      const updatedSelectedPost = { ...selectedPost, numberOfComments: selectedPost.numberOfComments + 1 } as Post;
      dispatch(setSelectedPost({ post: updatedSelectedPost }));
      setCommentText("");

      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp
      setComments(prev => [newComment, ...prev])
    } catch (error) {
      console.log('onCreateComment', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const onDeleteComment = async (comment: Comment) => {
    setDeletingComment(true);
    try {
      const batch = writeBatch(firestore);

      //delete comment doxument
      const commentDocRef = doc(firestore, 'comments', comment.id)
      batch.delete(commentDocRef);

      // update post numberOfComment +1
      const postDocRef = doc(firestore, "posts", selectedPost.id!);
      batch.update(postDocRef, { numberOfComments: increment(-1) });
      await batch.commit();
      //update client redux state
      const updatedSelectedPost = { ...selectedPost, numberOfComments: selectedPost.numberOfComments - 1 } as Post;
      dispatch(setSelectedPost({ post: updatedSelectedPost }));
      setComments(prev => prev.filter((item) => item.id !== comment.id));

    } catch (error) {
      console.log('onDeleteComment : ', error);
    } finally {
      setDeletingComment(false);
    }
  };

  const handleLike = async (isLiked: boolean, comment: Comment) => {
    if (!user)
      return dispatch(setAuthModalState({ open: true, view: "login" }));

    try {

      const batch = writeBatch(firestore);
      const commentDocRef = doc(firestore, 'comments', comment.id);

      if (!isLiked) {
        const likedCommentDocRef = doc(collection(firestore, "users", `${user.uid}/likedComments`));

        const newLikedComment = {
          id: likedCommentDocRef.id,
          commentId: comment.id,
          postId: comment.postId,
        }

        batch.set(likedCommentDocRef, newLikedComment);
        batch.update(commentDocRef, { numberOfLikes: increment(1) });

        setLikedComments(prev => [...prev, newLikedComment]);
        setComments(prev => {
          const updatedComments = prev.map((item) => {
            if (item.id === comment.id)
              return { ...item, numberOfLikes: item.numberOfLikes + 1 };

            return item;
          });

          return updatedComments;
        });
      } else {

        const existinglikedComment = likedComments.find((likedComment) => likedComment.commentId === comment.id) as LikedComment;
        const likedCommentDocRef = doc(firestore, "users", `${user.uid}/likedComments`, existinglikedComment.id);

        batch.update(commentDocRef, { numberOfLikes: increment(-1) });
        batch.delete(likedCommentDocRef);

        setLikedComments(prev => prev.filter((likedComment) => likedComment.commentId !== comment.id));
        setComments(prev => {
          const updatedComments = prev.map((item) => {
            if (item.id === comment.id)
              return { ...item, numberOfLikes: item.numberOfLikes - 1 };

            return item;
          });

          return updatedComments;
        });

      }

      await batch.commit();
    } catch (error) {
      console.log(error)
    }
  }

  const getPostComments = async () => {
    setFetchLoading(true);

    try {
      const commentsQuery = query(collection(firestore, "comments"),
        where("postId", "==", selectedPost.id),
        orderBy('createdAt', 'desc')
      );

      const commentsDocs = await getDocs(commentsQuery);
      const comments = commentsDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (user) {
        await getLikedComments();
      }
      setComments(comments as Comment[]);
    } catch (error) {
      console.log(error);
    } finally {
      setFetchLoading(false);
    }
  };

  async function getLikedComments() {
    const likedCommentsQuery = query(
      collection(firestore, `users/${user?.uid}/likedComments`),
      where("postId", "==", selectedPost.id)
    );
    const likedCommentsDocs = await getDocs(likedCommentsQuery);
    const likedComments = likedCommentsDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as LikedComment[];

    setLikedComments(likedComments);
  }

  useEffect(() => {
    getPostComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className='w-full border-b-[1px] mb-10 border-dimGray'>
      <CommentInput
        commentText={commentText}
        setCommentText={setCommentText}
        createLoading={createLoading}
        onCreateComment={onCreateComment}
        user={user}
      />

      {(fetchLoading && (
        <>
          <CommentSkeleton />
          <CommentSkeleton />
          <CommentSkeleton />
        </>
      ))}

      {
        ((comments.length === 0 && !fetchLoading) &&
          <>
            <div className=' flex justify-center w-full border-t-[1px] border-dimGray py-10'>
              <h3 className='text-indigo-500'>No comments yet? Come on, don't leave me hanging! 🥺😭</h3>
            </div>
          </>
        )
      }

      {
        (comments.length > 0 && !fetchLoading) && comments.map(comment => (
          <CommentItem key={comment.id} userId={user ? user.uid : null}
            isLiked={!!likedComments.find(likedComment => likedComment.commentId === comment.id)}
            handleLike={handleLike}
            comment={comment}
            deletingComment={deletingComment}
            onDeleteComment={onDeleteComment} />
        ))
      }
    </div>
  )
}

export default Comments