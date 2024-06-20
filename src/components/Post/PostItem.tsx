import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { Post } from "@/slices/postSlice";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { formatPostDate, truncateText } from "@/lib/Utils";
import { RiChat1Line, RiHeart2Line, RiShare2Line } from "@remixicon/react";
import Carousel from "./Carousel";
import DeletePopover from "./DeletePopOver";
import { Toast } from "@/lib/Toast";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentCommunity } from "@/slices";
import { CommunitiesState, Community } from "@/slices/communitySlice";


const dislikeicon = (stroke = "black", fill = "white") => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={fill}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke={stroke}
        className="h-6 w-6 hover:stroke-rose-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
        />
      </svg>
    </>
  );
};


type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  onSelectPost: () => void;
  onVote: () => void;
  onDeletePost: (post: Post) => Promise<boolean>;
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
  const [deletingPost, setDeletingPost] = useState(false);

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


  const handleDelete = async () => {
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
    } catch (error) {
      console.log('handleDelete error : ', error);
      Toast('error-bottom', error instanceof Error ? error.message : "Post refused to go. Try again", 4000)
    }
    setDeletingPost(false);
  };

  return (
    <main className="h-full w-full border-t-[1px] border-gray-700">
      <div className="flex w-full px-4 py-3">
        <div className="mr-2 w-[40px] shrink-0">
          <img
            className="h-[40px] w-[40px] rounded-full"
            src={masterImage ? masterImage : "/Hiveit.png"}
            alt=""
          />
        </div>

        <div className="flex w-full flex-col gap-2">

          <div className="flex items-center gap-2 font-chillax text-gray-400">
            <a title={post.creatorDisplayName} className="font-medium text-gray-400/80">
              u/ {truncateText(post.creatorDisplayName, 20)}
            </a>{" "}
            <span className="h-[2px] w-[2px] rounded-full bg-zinc-200"></span>{" "}
            <span>{formatPostDate('only-date', post.createdAt as number)}</span>
          </div>

          <h2 className="text-base sm:text-lg font-semibold text-gray-300">{post.title}</h2>

          {post.body && (
            <p className="text-sm tracking-wide text-gray-400">
              {post.body}
            </p>
          )}

          {post.link && (
            <div className="grid flex-grow grid-cols-[1fr_min-content] justify-between gap-3">
              <a
                target="_blank"
                href={post.link}
                title={
                  post.metaData?.title
                    ? post.metaData.title
                    : `link from u/${post.creatorDisplayName}`
                }
                className="grid-cols-1 self-center truncate text-ellipsis text-blue-600 decoration-blue-600/60 underline-offset-4 hover:underline"
              >
                {post.link}
              </a>
              {post.metaData?.image && (
                <div className="inline-block w-36 grid-cols-1">
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
            <Carousel gallery={post.gallery} />
          )}

          {/* //// post footer */}
          <div className="flex items-center w-full gap-10">

            <div className="group flex cursor-pointer items-center">
              <div className="h-fit w-fit rounded-full p-2 transition-all duration-200 ease-in group-hover:bg-sky-900/30">
                <RiChat1Line
                  size={25}
                  className="text-gray-500/80 group-hover:text-sky-500"
                />
              </div>
              <span className="text-gray-500/80 transition-all duration-200 ease-in group-hover:text-sky-500">
                {post.numberOfComments}
              </span>
            </div>

            <div className="group flex cursor-pointer items-center">
              <div className="h-fit w-fit rounded-full p-2 transition-all duration-200 ease-in group-hover:bg-red-900/30">
                <RiHeart2Line
                  size={25}
                  className="text-gray-500/80 group-hover:text-red-500"
                />
              </div>
              <span className="text-gray-500/80 transition-all duration-200 ease-in group-hover:text-red-500">
                {post.voteStatus}
              </span>
            </div>

            <div className="flex gap-2 ml-auto">
              <DeletePopover deletingPost={deletingPost} handleDelete={handleDelete} />

              <div className="group flex cursor-pointer items-center">
                <div className="h-fit w-fit rounded-full p-2 transition-all duration-200 ease-in group-hover:bg-blue-900/30">
                  <RiShare2Line
                    size={25}
                    className="text-gray-500/80 group-hover:text-blue-500"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default PostItem;
