import { auth, firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import { DocumentData, QueryDocumentSnapshot, collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { PostSkeleton } from "../Ui/Skeletons";
import PostItem from "../Post/PostItem";
import { Post } from "@/slices/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { resetPostStatevalue } from "@/slices";
import { CommunitiesState } from "@/slices/communitySlice";
import useCommunity from "@/hooks/useCommunity";

// type Props = {}
const PAGE_SIZE = 3;

const Homefeed = () => {

  const [user, loadingUser] = useAuthState(auth);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);


  const { userCommunities: communityStateValue } = useCommunity();


  const { postStateValue, setPostsValue, onSelectPost, onVote, OnDeletePost } = usePosts();
  const dispatch = useDispatch();

  const getIntialNoUserfeeds = useCallback(async () => {
    dispatch(resetPostStatevalue());
    setIsLoading(true);

    try {
      const postsQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(PAGE_SIZE)
      );
      const postDocs = await getDocs(postsQuery);
      const newPosts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      if (postDocs.docs.length < PAGE_SIZE) {
        setHasMore(false); // No more posts to load
      }

      setLastVisible(
        postDocs.docs.length > 0
          ? postDocs.docs[postDocs.docs.length - 1]
          : null,
      );
      await setPostsValue(newPosts, true);

    } catch (error) {
      console.log('failed to fetch initil home feeds', error);
    } finally {
      setIsLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPostsValue]);

  const fetchNoUserHomePosts = useCallback(async () => {
    try {
      //prevent fetch if already loading
      if (isLoading || !hasMore) return;
      setIsLoading(true);

      // get posts for this community
      let postsQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(PAGE_SIZE)
      );

      if (lastVisible) {
        postsQuery = query(postsQuery, startAfter(lastVisible));
      }
      const postDocs = await getDocs(postsQuery);
      const newPosts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      if (postDocs.docs.length < PAGE_SIZE) {
        setHasMore(false); // No more posts to load
      }

      setLastVisible(
        postDocs.docs.length > 0
          ? postDocs.docs[postDocs.docs.length - 1]
          : null,
      );
      await setPostsValue(newPosts, true);
    } catch (error) {
      console.log("fetchPosts error: ", error instanceof Error ? error.message : "failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, lastVisible, setPostsValue]);


  const getIntialUserfeeds = useCallback(async () => {
    dispatch(resetPostStatevalue());
    setIsLoading(true);

    try {
      if (communityStateValue.mySnippets.length) {
        const myCommunities = communityStateValue.mySnippets.map((snippet) => snippet.communityId);

        const postsQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", myCommunities),
          // orderBy("voteStatus", "desc"),
          limit(PAGE_SIZE)
        );
        const postDocs = await getDocs(postsQuery);
        const newPosts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];

        if (postDocs.docs.length < PAGE_SIZE) {
          setHasMore(false); // No more posts to load
        }

        setLastVisible(
          postDocs.docs.length > 0
            ? postDocs.docs[postDocs.docs.length - 1]
            : null,
        );
        await setPostsValue(newPosts, true);
      }

    } catch (error) {
      console.log('failed to fetch initial user home feeds', error);
    } finally {
      setIsLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPostsValue]);

  const fetchUserHomePosts = useCallback(async () => {
    try {
      //prevent fetch if already loading
      if (isLoading || !hasMore) return;
      setIsLoading(true);

      if (communityStateValue.mySnippets.length) {
        const myCommunities = communityStateValue.mySnippets.map((snippet) => snippet.communityId);
        // get posts for this community

        let postsQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", myCommunities),
          // orderBy("voteStatus", "desc"),
          limit(PAGE_SIZE)
        );

        if (lastVisible) {
          postsQuery = query(postsQuery, startAfter(lastVisible));
        }
        const postDocs = await getDocs(postsQuery);
        const newPosts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];

        if (postDocs.docs.length < PAGE_SIZE) {
          setHasMore(false); // No more posts to load
        }

        setLastVisible(
          postDocs.docs.length > 0
            ? postDocs.docs[postDocs.docs.length - 1]
            : null,
        );
        await setPostsValue(newPosts, true);
      }
      else
        fetchNoUserHomePosts();

    } catch (error) {
      console.log("fetchPosts error: ", error instanceof Error ? error.message : "failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, hasMore, isLoading, lastVisible, setPostsValue, communityStateValue.mySnippets])


  const getUserPostVotes = async () => { }

  useEffect(() => {
    if (communityStateValue.initSnippetFetched) {
      getIntialUserfeeds(); // Load initial posts
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityStateValue.initSnippetFetched]);

  useEffect(() => {
    if (!user && !loadingUser) {
      getIntialNoUserfeeds(); // Load initial posts
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loadingUser]);

  useEffect(() => {
    const options = {
      root: null, // use the viewport as the root
      rootMargin: "0px", // no margin
      threshold: 0.1, // trigger when 10% of the element is visible
    };

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isLoading) {
          // Fetch more posts when the target element is intersecting with the viewport
          if (!user)
            fetchNoUserHomePosts();
          else {
            fetchUserHomePosts();
          }
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

  // useEffect(() => {
  //   const options = {
  //     root: null, // use the viewport as the root
  //     rootMargin: "0px", // no margin
  //     threshold: 0.1, // trigger when 10% of the element is visible
  //   };

  //   observer.current = new IntersectionObserver((entries) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting && !isLoading) {
  //         fetchposts(); // Fetch more posts when the target element is intersecting with the viewport
  //       }
  //     });
  //   }, options);

  //   if (observer.current && lastVisible) {
  //     const target = document.querySelector("#load-more-marker"); // marking the last element
  //     if (target) {
  //       observer.current.observe(target);
  //     }
  //   }

  //   return () => {
  //     if (observer.current) {
  //       observer.current.disconnect(); // Disconnect the observer when component unmounts
  //     }
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isLoading, lastVisible]);

  return (
    <div>

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
                isHomePage={true}
              />
            ))}
            <div id="load-more-marker" className="h-32"></div>{" "}
          </div>
        </>
      )}

      {
        (postStateValue.posts.length == 0 && !isLoading) && (
          <>
            <div className="mt-10 flex w-full flex-col items-center font-chillax text-lg font-medium">
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
  )
}

export default Homefeed