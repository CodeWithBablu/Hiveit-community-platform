import { Timestamp, collection, doc, increment, setDoc, writeBatch } from 'firebase/firestore';
import React from 'react'
import DeletePopover from '../DeletePopOver';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { RiHeart3Fill, RiHeart3Line, RiShare2Line, RiThumbDownFill, RiThumbDownLine, RiThumbUpFill, RiThumbUpLine } from '@remixicon/react';
import { formatNumbers, formatPostDate, getAvatarCode, truncateText } from '@/lib/Utils';
import { firestore } from '@/firebase/clientApp';
import { avatars } from '@/config/avatar';

type CommentItemProps = {
  comment: Comment;
  isLiked: boolean;
  handleLike: (isLiked: boolean, comment: Comment) => void;
  onDeleteComment: (comment: Comment) => void;
  deletingComment: boolean;
  userId: string | null | undefined;
}

export type Comment = {
  id: string;
  creatorId: string;
  creatorImage: string | null;
  creatorDisplayName: string;
  communityId: string;
  postId: string;
  postTitle: string;
  text: string;
  numberOfLikes: number;
  createdAt: Timestamp;
}

export type LikedComment = {
  id: string;
  commentId: string;
  postId: string;
}

const CommentItem = ({ comment, isLiked, handleLike, onDeleteComment, deletingComment, userId }: CommentItemProps) => {

  return (
    <div className='flex w-full px-4 py-3 border-t-[1px] border-dimGray'>

      <div className="mr-2 w-[40px] h-[40px] shrink-0 bg-gradient-to-t from-gray-600 to-gray-900 to-80% rounded-full">
        <img
          className="h-[40px] w-[40px] rounded-full"
          src={comment.creatorImage ? comment.creatorImage : avatars[getAvatarCode(comment.creatorDisplayName)].url}
          alt="profile"
        />
      </div>

      <div className="flex w-full flex-col gap-1">

        <div className="flex items-center gap-2 font-chillax text-gray-400">

          <span title={comment.creatorDisplayName} className="font-medium text-gray-400/80">
            u/ {truncateText(comment.creatorDisplayName, 20)}
          </span>{" "}
          <>
            <span className="h-[3px] w-[2px] ml-2 rounded-full bg-zinc-400"></span>{" "}
            <span>{formatPostDate('only-date', comment.createdAt.seconds * 1000)}</span>
          </>
        </div>

        <div className="w-full mb-2">
          <p className="text-sm whitespace-pre-wrap font-poppins tracking-wide text-slate-200">
            {comment.text}
          </p>
        </div>

        {/* //// comment footer */}
        <div className="flex items-center w-full justify-between sm:gap-10">

          <div onClick={() => handleLike(isLiked, comment)} className="group flex cursor-pointer items-center">
            {!isLiked && <div className="h-fit w-fit rounded-full p-2 transition-all duration-200 ease-in group-hover:bg-pink-900/30">
              <RiHeart3Line
                size={'1em'}
                className="text-gray-500/80 text-[20px] sm:text-2xl group-hover:text-pink-500"
              />
            </div>}

            {isLiked && <div className="h-fit w-fit rounded-full p-2 transition-all duration-200 ease-in group-hover:bg-pink-900/30">
              <RiHeart3Fill
                size={'1em'}
                className="text-gray-500/80 text-[20px] sm:text-2xl fill-pink-600"
              />
            </div>}
            <span className="text-gray-500/80 text-sm sm:text-base font-medium transition-all duration-200 ease-in group-hover:text-pink-500">
              {formatNumbers(comment.numberOfLikes)}
            </span>
          </div>

          <div className="flex gap-2 sm:ml-auto">
            {(userId === comment.creatorId) &&
              <DeletePopover
                isDeleting={deletingComment}
                handleDelete={onDeleteComment as (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | Comment) => void}
                comment={comment}
              />}

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

    </div>
  )
}

export default CommentItem