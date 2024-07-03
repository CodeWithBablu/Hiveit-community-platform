import { auth, firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import { DocumentData, QueryDocumentSnapshot, collection, doc, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { PostSkeleton } from "../Ui/Skeletons";
import PostItem from "../Post/PostItem";
import { Post, PostState, PostVote } from "@/slices/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { resetPostStatevalue, setHasMore, setPostVotes } from "@/slices";
import useCommunity from "@/hooks/useCommunity";
import { Spinner } from "@chakra-ui/react";


const PAGE_SIZE = 3;

const Homefeed = () => {

  const [user, loadingUser] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const { userCommunities: communityStateValue } = useCommunity();

  const { filter: sortBy, hasMore } = useSelector((state: { postState: PostState }) => state.postState);


  const { postStateValue, setPostsValue, onSelectPost, onVote, OnDeletePost } = usePosts();
  const dispatch = useDispatch();

  const getIntialNoUserfeeds = useCallback(async () => {
    dispatch(resetPostStatevalue());
    setIsLoading(true);

    try {
      let postsQuery = query(
        collection(firestore, "posts"),
        limit(PAGE_SIZE)
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
      await setPostsValue(newPosts, true);

    } catch (error) {
      console.log('failed to fetch initil home feeds', error);
    } finally {
      setIsLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const fetchNoUserHomePosts = useCallback(async () => {
    try {
      //prevent fetch if already loading
      if (isLoading || !hasMore) return;
      setIsLoading(true);

      // get posts for this community
      let postsQuery = query(
        collection(firestore, "posts"),
        limit(PAGE_SIZE)
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
      await setPostsValue(newPosts, true);
    } catch (error) {
      console.log("fetchPosts error: ", error instanceof Error ? error.message : "failed to fetch posts");
    } finally {
      setIsLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isLoading, lastVisible, sortBy]);


  const getIntialUserfeeds = useCallback(async () => {
    dispatch(resetPostStatevalue());
    setIsLoading(true);

    try {
      if (communityStateValue.mySnippets.length) {
        const myCommunities = communityStateValue.mySnippets.map((snippet) => snippet.communityId);

        let postsQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", myCommunities),
          limit(PAGE_SIZE)
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

        await setPostsValue(newPosts, true);
      }
      else
        getIntialNoUserfeeds();

    } catch (error) {
      console.log('failed to fetch initial user home feeds', error);
    } finally {
      setIsLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, communityStateValue.mySnippets]);


  const fetchUserHomePosts = useCallback(async () => {
    try {
      //prevent fetch if already loading
      if (isLoading || !hasMore) return;
      setIsLoading(true);

      if (communityStateValue.mySnippets.length) {
        const myCommunities = communityStateValue.mySnippets.map((snippet) => snippet.communityId);

        let postsQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", myCommunities),
          limit(PAGE_SIZE)
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
  }, [hasMore, isLoading, lastVisible, sortBy, communityStateValue.mySnippets]);


  const getUserPostVotes = async () => {
    try {
      const postIds = postStateValue.posts.map(post => post.id);
      const postsVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where('postId', 'in', postIds)
      );

      const postVoteDocs = await getDocs(postsVotesQuery);
      const postVotes = postVoteDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      dispatch(setPostVotes({ postVotes: postVotes as PostVote[] }))
    } catch (error) {
      console.log('get user postValue error: ', error);
    }
  }


  // load userFeeds
  useEffect(() => {
    if (communityStateValue.initSnippetFetched) {
      getIntialUserfeeds(); // Load initial posts
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityStateValue.initSnippetFetched, sortBy]);

  //load no userFeeds
  useEffect(() => {
    if (!user && !loadingUser) {
      getIntialNoUserfeeds(); // Load initial posts
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loadingUser, sortBy]);


  useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes();

    return () => {
      dispatch(setPostVotes({ postVotes: [] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, postStateValue.posts]);


  useEffect(() => {
    const options = {
      root: null, // use the viewport as the root
      rootMargin: "0px", // no margin
      threshold: 0.1, // trigger when 10% of the element is visible
    };

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting && !isLoading) {
          // Fetch more posts when the target element is intersecting with the viewport
          if (!user) {
            await fetchNoUserHomePosts(); // Load initial posts
          }
          else {
            await fetchUserHomePosts();
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
  }, [isLoading, lastVisible, user]);



  if (isLoading && !postStateValue.posts.length) {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-zinc-950">
        <Spinner className="" size={"xl"} thickness="7px" color="blue" />
      </div>
    );
  }

  return (
    <div>
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

      {isLoading &&
        <div className="flex w-full flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
        </div>
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