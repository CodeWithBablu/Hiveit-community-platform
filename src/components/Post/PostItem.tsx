import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { Post } from "@/slices/postSlice";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { formatNumbers, formatPostDate, truncateText } from "@/lib/Utils";
import { RiChat1Line, RiShare2Line, RiThumbDownFill, RiThumbDownLine, RiThumbUpFill, RiThumbUpLine } from "@remixicon/react";
import Carousel from "./Carousel";
import DeletePopover from "./DeletePopOver";
import { Toast } from "@/lib/Toast";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentCommunity } from "@/slices";
import { CommunitiesState, Community } from "@/slices/communitySlice";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { Comment } from "./Comments/CommentItem";


type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  onVote: (e: React.MouseEvent<HTMLDivElement>, post: Post, vote: number, communityId: string) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
  onSelectPost?: (post: Post) => void;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  userIsCreator,
  userVoteValue,
  onVote,
  onDeletePost,
  onSelectPost,
}) => {
  const [masterImage, setMasterImage] = useState("");
  const [deletingPost, setDeletingPost] = useState<boolean>(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);


  const currentCommunity: Community | undefined = useSelector(
    (state: { communitiesState: CommunitiesState }) => state.communitiesState.currentCommunity,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const getPostmasterImage = async () => {
      const imageRef = doc(firestore, `users/${post.creatorId}`);
      const image = await getDoc(imageRef);
      const data = image.data();
      if (data && data.providerData[0].photoURL) {
        setMasterImage(data.providerData[0].photoURL);
      }
    };

    getPostmasterImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isOverlayOpen) {
      document.body.style.overflow = 'unset';
      return;
    }

    if (isOverlayOpen) {
      if (typeof window != 'undefined' && window.document) {
        document.body.style.overflow = 'hidden';
      }
    }
  }, [isOverlayOpen]);

  const navigate = useNavigate();
  // const isCommentsPage = location.pathname.includes('/comments')
  const singlePostPage = !onSelectPost;

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();// prevent propogating click event from child to parent( so that it does open the post)

    setDeletingPost(true);
    try {
      const success = await onDeletePost(post);
      if (!success) {
        throw new Error('Post refused to go. Try again');
      }

      Toast('success', 'Gone! Like it never existed', 3000);
      if (currentCommunity) {
        const updatedCurrCommunity = { ...currentCommunity, numberOfPosts: currentCommunity.numberOfPosts - 1 };
        dispatch(setCurrentCommunity({ currentCommunity: updatedCurrCommunity }));
      }
      if (singlePostPage)
        navigate(`/h/${post.communityId}`)
    } catch (error) {
      console.log('handleDelete error : ', error);
      Toast('error-bottom', error instanceof Error ? error.message : "Post refused to go. Try again", 4000)
    }
    setDeletingPost(false);
  };

  return (
    <main onClick={() => onSelectPost && onSelectPost(post)} className={`h-fit w-full ${singlePostPage ? '' : 'hover:bg-zinc-900/30 border-t-[1px] border-gray-800'} cursor-pointer`}>
      <div className="flex w-full px-4 py-3">
        {!singlePostPage && <div className="mr-2 w-[40px] shrink-0">
          <img
            className="h-[40px] w-[40px] rounded-full"
            src={masterImage ? masterImage : "/Hiveit.png"}
            alt=""
          />
        </div>}

        <div className="flex w-full flex-col gap-2">

          <div className="flex items-center gap-2 font-chillax text-gray-400">
            {singlePostPage && <div className="mr-2 w-[40px] shrink-0">
              <img
                className="h-[40px] w-[40px] rounded-full"
                src={masterImage ? masterImage : "/Hiveit.png"}
                alt=""
              />
            </div>}

            <span title={post.creatorDisplayName} className="font-medium text-gray-400/80">
              u/ {truncateText(post.creatorDisplayName, 20)}
            </span>{" "}
            {!singlePostPage && <>
              <span className="h-[3px] w-[2px] ml-2 rounded-full bg-zinc-400"></span>{" "}
              <span>{formatPostDate('only-date', post.createdAt as number)}</span>
            </>}
          </div>

          <h2 className="text-base sm:text-lg font-semibold text-gray-300">{post.title}</h2>

          {post.body && (
            <div className="w-full mb-3">
              <p className="text-sm whitespace-pre-wrap tracking-wide text-slate-300">
                {post.body}
              </p>
            </div>
          )}

          {post.link && (
            <div
              title={
                post.metaData?.title
                  ? post.metaData.title
                  : `link from u/${post.creatorDisplayName}`
              }
              onClick={(e) => { e.stopPropagation() }} className="w-full group mb-3 grid flex-grow grid-cols-[1fr_min-content] justify-between gap-3">
              <a
                target="_blank"
                href={post.link}
                className="grid-cols-1 self-center truncate text-ellipsis text-blue-600 decoration-blue-600/60 underline-offset-4 group-hover:underline hover:underline"
              >
                {post.link}
              </a>
              {post.metaData?.image && (
                <div className="inline-block w-44 grid-cols-1">
                  <img
                    className="h-full w-full flex-shrink-0 justify-items-end rounded-xl object-cover"
                    src={post.metaData.image}
                    alt=""
                  />
                </div>
              )}
            </div>
          )}

          {post.gallery && post.gallery.length > 0 && (
            <>
              <Carousel isOverlayOpen={isOverlayOpen} setIsOverlayOpen={setIsOverlayOpen} gallery={post.gallery} />

              {/* ////overlay footer */}
              {isOverlayOpen && (
                <div onClick={(e) => { e.stopPropagation() }} className={clsx(
                  {
                    "relative mt-2 w-full": !isOverlayOpen,
                    'fixed flex flex-col top-0 left-0 w-[100dvw] h-[100dvh] bg-blackAplha900 z-10': isOverlayOpen
                  }
                )}>
                  <Carousel isOverlayOpen={isOverlayOpen} setIsOverlayOpen={setIsOverlayOpen} gallery={post.gallery} />
                  <div className="flex items-center w-full shrink-0 h-16 px-3 sm:px-0 justify-between sm:gap-10 max-w-[600px] mx-auto">

                    <div className="flex items-center gap-2">
                      <div className={clsx(
                        'flex cursor-pointer items-center rounded-full',
                        {
                          'bg-pink-950/50': userVoteValue === 1,
                          'bg-indigo-950/70': userVoteValue === -1,
                        }
                      )}>
                        <motion.div whileTap={{ scale: 0.90 }} onClick={(e) => onVote(e, post, 1, post.communityId)} className="h-fit peer w-fit group rounded-full p-2 transition-all duration-200 ease-in hover:bg-pink-950/30">
                          {(userVoteValue !== 1) && <RiThumbUpLine
                            size={'1em'}
                            className={`text-[20px] sm:text-2xl text-gray-500/80 group-hover:text-pink-700`}
                          />}
                          {(userVoteValue === 1) && <RiThumbUpFill
                            size={'1em'}
                            className={`text-[20px] sm:text-2xl text-gray-500/80 group-hover:text-pink-700 fill-pink-700`}
                          />}
                        </motion.div>
                        <motion.div whileTap={{ scale: 0.90 }} onClick={(e) => onVote(e, post, -1, post.communityId)} className="h-fit peer w-fit group rounded-full p-2 transition-all duration-200 ease-in hover:bg-indigo-900/30">
                          {(userVoteValue !== -1) && <RiThumbDownLine
                            size={'1em'}
                            className={`text-[20px] sm:text-2xl text-gray-500/80 group-hover:text-indigo-500 ${userVoteValue === -1 && 'fill-indigo-500'}`}
                          />}
                          {(userVoteValue === -1) && <RiThumbDownFill
                            size={'1em'}
                            className={`text-[20px] sm:text-2xl text-gray-500/80 group-hover:text-indigo-500 fill-indigo-600`}
                          />}
                        </motion.div>
                      </div>
                      <span className="text-gray-500/80 text-sm sm:text-base font-medium text-gray-400">
                        {formatNumbers(post.voteStatus)}
                      </span>
                    </div>

                    <div className="group flex cursor-pointer items-center">
                      <div className="h-fit w-fit rounded-full p-2 transition-all duration-200 ease-in group-hover:bg-sky-900/30">
                        <RiChat1Line
                          size={'1em'}
                          className="text-gray-500/80 text-[20px] sm:text-2xl group-hover:text-sky-500"
                        />
                      </div>
                      <span className="text-gray-500/80 text-sm sm:text-base font-medium transition-all duration-200 ease-in group-hover:text-sky-500">
                        {formatNumbers(post.numberOfComments)}
                      </span>
                    </div>

                    <div className="flex gap-2 sm:ml-auto">
                      {userIsCreator && <DeletePopover isDeleting={deletingPost} handleDelete={handleDelete as (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | Comment) => void} />}

                      <div className="group flex cursor-pointer items-center">
                        <div className="h-fit w-fit rounded-full p-2 transition-all duration-200 ease-in group-hover:bg-blue-900/30">
                          <RiShare2Line
                            size={'1em'}
                            className="text-gray-500/80 text-[20px] sm:text-2xl group-hover:text-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </>
          )}

          {singlePostPage && <>
            <span className="font-chillax font-medium text-gray-500 mt-3">{formatPostDate('date-time', post.createdAt as number)}</span>
            <hr className="border-dimGray w-full mt-2" />
          </>}

          {/* ////post footer */}
          <div className="flex items-center w-full justify-between sm:gap-10">

            <div className="flex items-center gap-2">
              <div className={clsx(
                'flex cursor-pointer items-center rounded-full',
                {
                  'bg-pink-950/30': userVoteValue === 1,
                  'bg-indigo-950/50': userVoteValue === -1,
                }
              )}>
                <motion.div whileTap={{ scale: 0.90 }} onClick={(e) => onVote(e, post, 1, post.communityId)} className="h-fit peer w-fit group rounded-full p-2 transition-all duration-200 ease-in hover:bg-pink-950/30">
                  {(userVoteValue !== 1) && <RiThumbUpLine
                    size={'1em'}
                    className={`text-[20px] sm:text-2xl text-gray-500/80 group-hover:text-pink-700`}
                  />}
                  {(userVoteValue === 1) && <RiThumbUpFill
                    size={'1em'}
                    className={`text-[20px] sm:text-2xl text-gray-500/80 group-hover:text-pink-700 fill-pink-700`}
                  />}
                </motion.div>
                <motion.div whileTap={{ scale: 0.90 }} onClick={(e) => onVote(e, post, -1, post.communityId)} className="h-fit peer w-fit group rounded-full p-2 transition-all duration-200 ease-in hover:bg-indigo-900/30">
                  {(userVoteValue !== -1) && <RiThumbDownLine
                    size={'1em'}
                    className={`text-[20px] sm:text-2xl text-gray-500/80 group-hover:text-indigo-500 ${userVoteValue === -1 && 'fill-indigo-500'}`}
                  />}
                  {(userVoteValue === -1) && <RiThumbDownFill
                    size={'1em'}
                    className={`text-[20px] sm:text-2xl text-gray-500/80 group-hover:text-indigo-500 fill-indigo-600`}
                  />}
                </motion.div>
              </div>
              <span className="text-gray-500/80 text-sm sm:text-base font-medium text-gray-400">
                {formatNumbers(post.voteStatus)}
              </span>
            </div>

            <div className="group flex cursor-pointer items-center">
              <div className="h-fit w-fit rounded-full p-2 transition-all duration-200 ease-in group-hover:bg-sky-900/30">
                <RiChat1Line
                  size={'1em'}
                  className="text-gray-500/80 text-[20px] sm:text-2xl group-hover:text-sky-500"
                />
              </div>
              <span className="text-gray-500/80 text-sm sm:text-base font-medium transition-all duration-200 ease-in group-hover:text-sky-500">
                {formatNumbers(post.numberOfComments)}
              </span>
            </div>

            <div className="flex gap-2 sm:ml-auto">
              {userIsCreator && <DeletePopover isDeleting={deletingPost} handleDelete={handleDelete as (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | Comment) => void} />}

              <div className="group flex cursor-pointer items-center">
                <div className="h-fit w-fit rounded-full p-2 transition-all duration-200 ease-in group-hover:bg-blue-900/30">
                  <RiShare2Line
                    size={'1em'}
                    className="text-gray-500/80 text-[20px] sm:text-2xl group-hover:text-blue-500"
                  />
                </div>
              </div>
            </div>

          </div>

          {singlePostPage && <>
            <hr className="border-dimGray w-full mb-2" />
          </>}

        </div>
      </div>
    </main>
  );
};

export default PostItem;
