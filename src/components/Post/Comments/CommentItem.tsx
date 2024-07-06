import { Timestamp } from 'firebase/firestore';
import React from 'react'
import DeletePopover from '../DeletePopOver';
import clsx from 'clsx';
import { RiHeart3Fill, RiHeart3Line, RiShare2Line } from '@remixicon/react';
import { formatNumbers, getAvatarCode, timeAgo, truncateText } from '@/lib/Utils';
import { avatars } from '@/config/avatar';
import { useNavigate } from 'react-router-dom';

type CommentItemProps = {
  comment: Comment;
  isLiked: boolean;
  handleLike: (isLiked: boolean, comment: Comment) => void;
  onDeleteComment: (comment: Comment) => void;
  deletingComment: boolean;
  userId: string | null | undefined;
  isProfilePage?: boolean;
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

const CommentItem = ({ comment, isLiked, handleLike, onDeleteComment, deletingComment, userId, isProfilePage }: CommentItemProps) => {

  const navigate = useNavigate();

  return (
    <div className='flex w-full px-4 py-3 border-t-[1px] border-dimGray'>

      <div className="mr-2 w-[40px] h-[40px] shrink-0 bg-gradient-to-b from-gray-700 to-gray-900 to-80% rounded-full">
        <img
          className="h-[40px] w-[40px] rounded-full"
          src={comment.creatorImage ? comment.creatorImage : avatars[getAvatarCode(comment.creatorDisplayName)].url}
          alt="profile"
        />
      </div>

      <div className="flex w-full flex-col gap-1">

        <div className="flex items-baseline flex-wrap gap-2 font-chillax text-gray-400">

          {!isProfilePage && <span title={comment.creatorDisplayName} className="font-medium text-gray-400/80 cursor-pointer hover:text-indigo-500">
            u/ {truncateText(comment.creatorDisplayName, 20)}
          </span>}

          {isProfilePage && <span title={comment.communityId} onClick={() => navigate(`/h/${comment.communityId}`)} className="font-medium text-gray-400/80 cursor-pointer hover:text-indigo-500">
            h/ {truncateText(comment.communityId, 20)}
          </span>}

          <span className="h-[4px] w-[4px] mx-1 rounded-full bg-gray-400/80"></span>

          {!isProfilePage &&
            <>
              <span className='font-poppins text-sm'>{timeAgo(comment.createdAt.seconds * 1000)}</span>
            </>
          }
          {isProfilePage &&
            <h2 className=' mb-2 text-[16px] text-gray-100 font-medium hover:text-blue-500 hover:underline underline-offset-4 cursor-pointer'>{comment.postTitle}</h2>
          }
        </div>

        {isProfilePage &&
          <>
            <span className='font-poppins mb-2 text-sm text-gray-400'><span className='text-gray-100 font-medium'>{truncateText(comment.creatorDisplayName, 20)}</span> commented {timeAgo(comment.createdAt.seconds * 1000)}</span>
            <hr className='border-dimGray' />
          </>
        }

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