import { auth, firestore } from "@/firebase/clientApp";
import { Community } from "@/slices/communitySlice";
import { Post, PostState } from "@/slices/postSlice";
import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import usePosts from "@/hooks/usePosts";
import PostItem from "./PostItem";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { resetPostStatevalue, setCurrentCommunity, setHasMore } from "@/slices";
import { PostSkeleton } from "../Ui/Skeletons";

type PostsProps = {
  communityData: Community;
};

const PAGE_SIZE = 3;

function Posts({ communityData }: PostsProps) {
  const [user] = useAuthState(auth);

  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const { filter: sortBy, hasMore } = useSelector((state: { postState: PostState }) => state.postState);


  const { postStateValue, setPostsValue, onVote, OnDeletePost, onSelectPost } = usePosts();
  const dispatch = useDispatch();

  const fetchposts = useCallback(async () => {
    try {
      //prevent fetch if already loading
      if (isLoading || !hasMore) return;
      setIsLoading(true);

      // get posts for this community
      let postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        limit(PAGE_SIZE),
      );

      if (sortBy === "hot") {
        postsQuery = query(postsQuery, orderBy("voteStatus", "desc"), orderBy("numberOfComments", "desc"));
      }

      if (sortBy === "latest") {
        postsQuery = query(postsQuery, orderBy("createdAt", "desc"));
      }

      if (sortBy === "top") {
        postsQuery = query(postsQuery, orderBy("voteStatus", "desc"));
      }

      if (lastVisible) {
        postsQuery = query(postsQuery, startAfter(lastVisible));
      }
      const postDocs = await getDocs(postsQuery);
      const newPosts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];


      if (postDocs.docs.length < PAGE_SIZE) {
        dispatch(setHasMore(false)); // No more posts to load
      }

      setLastVisible(
        postDocs.docs.length > 0
          ? postDocs.docs[postDocs.docs.length - 1]
          : null,
      );
      await setPostsValue(newPosts);
    } catch (error) {
      console.log(
        "fetchPosts error: ",
        error instanceof Error ? error.message : "failed to fetch posts",
      );
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityData.id, sortBy, hasMore, isLoading, lastVisible]);

  const getIntialPosts = useCallback(async () => {
    dispatch(resetPostStatevalue());
    setIsLoading(true);

    let postsQuery = query(
      collection(firestore, "posts"),
      where("communityId", "==", communityData.id),
      limit(PAGE_SIZE),
    );

    if (sortBy === "hot") {
      postsQuery = query(postsQuery, orderBy("voteStatus", "desc"), orderBy("numberOfComments", "desc"));
    }

    if (sortBy === "latest") {
      postsQuery = query(postsQuery, orderBy("createdAt", "desc"));
    }

    if (sortBy === "top") {
      postsQuery = query(postsQuery, orderBy("voteStatus", "desc"));
    }

    const postDocs = await getDocs(postsQuery);
    const newPosts = postDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];

    if (postDocs.docs.length < PAGE_SIZE) {
      dispatch(setHasMore(false)); // No more posts to load
    }

    setLastVisible(
      postDocs.docs.length > 0
        ? postDocs.docs[postDocs.docs.length - 1]
        : null,
    );
    await setPostsValue(newPosts);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityData.id, sortBy]);


  useEffect(() => {
    getIntialPosts(); // Load initial posts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityData, sortBy]);

  useEffect(() => {
    const options = {
      root: null, // use the viewport as the root
      rootMargin: "0px", // no margin
      threshold: 0.1, // trigger when 10% of the element is visible
    };

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isLoading) {
          fetchposts(); // Fetch more posts when the target element is intersecting with the viewport
        }
      });
    }, options);

    if (observer.current && lastVisible) {
      const target = document.querySelector("#load-more-marker"); // marking the last element
      if (target) {
        observer.current.observe(target);
      }
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect(); // Disconnect the observer when component unmounts
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, lastVisible]);


  return (
    <div className="flex flex-col flex-grow w-full">

      {isLoading &&
        <div className="flex w-full flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      }

      {(postStateValue.posts.length > 0) && (
        <>
          <div className="">
            {postStateValue.posts.map((post, index) => (
              <PostItem
                key={post.id}
                post={post}
                userIsCreator={user?.uid === post.creatorId}
                userVoteValue={postStateValue.postVotes.find(vote => vote.postId === post.id)?.voteValue}
                onVote={onVote}
                onSelectPost={onSelectPost}
                onDeletePost={OnDeletePost}
              />
            ))}
            <div id="load-more-marker" className="h-32"></div>{" "}
          </div>
        </>
      )}

      {
        (postStateValue.posts.length == 0 && !isLoading) && (
          <>
            <div className="mt-10 px-4 flex w-full flex-col items-center font-chillax text-lg font-medium">
              <h2 className="animate-pulse">
                No posts yet? Time to break the ice and start the chatter!
              </h2>
              <img className="w-[50%]" src="/notfound.png" alt="" />
            </div>
          </>
        )
      }

      {!hasMore && postStateValue.posts.length > 0 && (
        <div className="mb-32 flex w-full items-center gap-3">
          <hr className="flex-grow border-[1px] border-gray-800" />
          <span className="text-gray-500 text-sm sm:text-base">
            Congratualations you reached the end!! 🎊🎉
          </span>
          <hr className="flex-grow border-[1px] border-gray-800" />
        </div>
      )}
    </div>
  );
}

export default Posts;

