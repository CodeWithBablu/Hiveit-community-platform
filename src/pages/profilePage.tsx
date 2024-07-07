import PageLayout from "@/components/Layout/PageLayout"
import { auth, firestore } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Usertype } from "@/lib/Definations";
import useSelectFile from "@/hooks/useSelectFile";
import { avatars } from "@/config/avatar";
import { getAvatarCode } from "@/lib/Utils";
import Comments from "@/components/Post/Comments/Comments";
import { Spinner, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, DocumentData, getDocs, limit, or, orderBy, query, QueryDocumentSnapshot, startAfter, where } from "firebase/firestore";
import { RiChat1Line, RiReceiptLine } from "@remixicon/react";
import { useDispatch, useSelector } from "react-redux";
import { Post, PostState, PostVote } from "@/slices/postSlice";
import usePosts from "@/hooks/usePosts";
import { resetPostStatevalue, setHasMore, setPostVotes } from "@/slices";
import PostItem from "@/components/Post/PostItem";
import { PostSkeleton } from "@/components/Ui/Skeletons";
import CreatePostLink from "@/components/Community/CreatePostLink";

const camera = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
</svg>;

const PAGE_SIZE = 3;

const ProfilePage = () => {
  const [user, loadingUser] = useAuthState(auth);
  const [profileUser, setProfileUser] = useState<Usertype | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);

  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const fileSelectorRef = useRef<HTMLInputElement>(null);

  const { filter: sortBy, hasMore } = useSelector((state: { postState: PostState }) => state.postState);

  const { postStateValue, setPostsValue, onVote, OnDeletePost, onSelectPost } = usePosts();
  const { selectedFile, onSelectFile } = useSelectFile();



  const dispatch = useDispatch();
  const { username } = useParams();
  const navigate = useNavigate();


  const fetchposts = useCallback(async () => {
    try {
      //prevent fetch if already loading
      if (isLoading || !hasMore) return;
      setIsLoading(true);

      let postsQuery = query(
        collection(firestore, "posts"),
        where("creatorId", "==", user?.uid),
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
  }, [sortBy, hasMore, isLoading, lastVisible, user?.uid]);

  const getIntialPosts = useCallback(async () => {
    dispatch(resetPostStatevalue());
    setIsLoading(true);

    let postsQuery = query(
      collection(firestore, "posts"),
      where("creatorId", "==", user?.uid),
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
  }, [sortBy, user?.uid]);

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

  const getUser = useCallback(async () => {
    setIsProfileLoading(true);
    try {
      if (username) {
        const userQuery = query(
          collection(firestore, 'users'),
          or(
            where("displayName", "==", username),
            where("email", "==", `${username}@gmail.com`)
          )
        );
        const userDocs = await getDocs(userQuery);
        const profileUserDoc = userDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0];
        if (profileUserDoc)
          setProfileUser(profileUserDoc as Usertype);
      }
    } catch (error) {
      console.log("getUser error: ", error);
    } finally {
      setIsProfileLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (!user) return;

    getIntialPosts(); // Load initial posts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, sortBy]);


  useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes();
    console.log("pop")
    return () => {
      // dispatch(resetPostStatevalue());
      dispatch(setPostVotes({ postVotes: [] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, postStateValue.posts]);

  useEffect(() => {
    if (!loadingUser && username) {
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, loadingUser]);


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


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!profileUser?.uid) return;
    onSelectFile(e, 'user_image', profileUser?.uid as string);
  }

  if (loadingUser && !profileUser)
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-zinc-950">
        <Spinner className="" size={"xl"} thickness="7px" color="blue" />
      </div>
    );

  let photoURL = "";
  if (profileUser) {
    if (profileUser.providerData[0].photoURL)
      photoURL = profileUser.providerData[0].photoURL;
    else
      photoURL = avatars[getAvatarCode(profileUser?.displayName || profileUser?.email?.split('@')[0] as string)].url;
  }
  else
    photoURL = "/profile.png";

  if (!isProfileLoading && !profileUser) {
    return (
      <div className="bg-zinc-950 py-10 px-3 overflow-hidden">
        <div className="flex flex-col items-center justify-center text-base sm:text-2xl font-chillax font-medium text-gray-200 w-full">
          <img className="w-44 h-44 mb-5 md:w-auto md:h-auto object-cover" src="/notfound.png" alt="not found" />

          <h2 className="text-red-600">User does not exist!! 😢😢</h2>
          <h2 className="animate-pulse">Please confirm the username and try again</h2>

          <button onClick={() => navigate("/")} className="py-2 px-6 bg-blue-700 rounded-full mt-5">Home</button>
        </div>
      </div>
    );
  }

  if (profileUser) {
    return (
      <div className="bg-zinc-950">
        {/* flex flex-col max-w-7xl m-auto xl:border-x-[1px] border-zinc-600 shadow-[0px_0px_30px_0px_rgba(124 ,45 ,18,0.5)]*/}
        <PageLayout>
          {/* //// Left content */}
          <>
            <div className="border-x-[1px] border-dimGray w-full">

              {/* //// header */}
              {(!isProfileLoading && profileUser) ? (
                <div className="flex items-center gap-12 px-4 py-3">

                  <div className="relative  bg-zinc-950 w-fit rounded-full">
                    <img
                      className="h-20 w-20 rounded-full md:h-[110px] md:w-[110px] object-cover bg-gradient-to-b from-gray-700 to-gray-950 to-80%"
                      src={selectedFile ? selectedFile : photoURL}
                      alt="communty bg Image"
                    />

                    {<motion.div whileTap={{ scale: 0.80 }} onClick={() => { fileSelectorRef.current?.click() }} title="change community background image" className="absolute bottom-1 -right-4 md:bottom-5 md:-right-5 cursor-pointer text-gray-200 bg-gray-500/30 backdrop-blur-xl rounded-full p-3">
                      {camera}
                    </motion.div>}

                    <input ref={fileSelectorRef} onChange={handleFileChange} id="file-upload" type="file" className="hidden" accept="image/x-png,image/gif,image/jpeg,image/webp" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <h1 className="text-gray-200 text-2xl sm:text-4xl font-chillax font-medium">{profileUser?.displayName || profileUser?.email?.split('@')[0]}</h1>
                    <h2 className="text-slate-400 text-base sm:text-xl">u/{profileUser?.displayName || profileUser?.email?.split('@')[0]}</h2>
                  </div>

                </div>
              ) : (
                <div className="flex h-40 items-center justify-center bg-zinc-950">
                  <Spinner className="" size={"xl"} thickness="7px" color="blue" />
                </div>
              )}

              {/* //// Tabs */}
              <div className="no-scrollbar flex gap-4 overflow-x-scroll w-full">
                <Tabs position='relative' variant='unstyled' className="w-full">
                  <TabList className="mt-5 px-4">
                    <Tab justifyContent={"start"} className="gap-3 w-fit"><RiReceiptLine size={22} /> Posts</Tab>
                    <Tab justifyContent={"start"} className="gap-3 w-fit"><RiChat1Line size={22} /> Comments</Tab>
                  </TabList>
                  <TabIndicator mt='-1.5px' height='2px' bg='#2563eb' borderRadius='1px' />

                  <TabPanels>

                    <TabPanel padding={'auto 0px'}>
                      <div className="flex flex-col flex-grow w-full">

                        <CreatePostLink />

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
                    </TabPanel>

                    <TabPanel padding={'auto 0px'} marginTop={'30px'}>
                      {profileUser && <Comments user={user} profileUser={profileUser} />}
                    </TabPanel>

                  </TabPanels>
                </Tabs>
              </div>


            </div>
          </>

          {/* //// Right Content */}
          <>
            <div className="sticky top-14 w-[350px] h-fit mt-14">
              {/* <ProfileInfo /> */}
              <h2>profile Info</h2>
            </div>
          </>
        </PageLayout>
      </div>
    )
  }

}

export default ProfilePage