import { avatars } from '@/config/avatar';
import { getAvatarCode, truncateText } from '@/lib/Utils';
import { setAuthModalState } from '@/slices';
import { CircularProgress, CircularProgressLabel, Spinner } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux';

type CommentInputProps = {
  commentText: string;
  setCommentText: Dispatch<SetStateAction<string>>;
  user: User | null | undefined;
  createLoading: boolean;
  onCreateComment: (commentText: string, user: User) => void;
}

const CommentInput = ({ commentText, setCommentText, user, createLoading, onCreateComment }: CommentInputProps) => {

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 200) return;
    setCommentText(e.target.value);
  }

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to correctly calculate new scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set height to scrollHeight to adjust the textarea size
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [commentText]);



  return (
    <div className='px-4'>

      {user ? (
        <>
          <h2 className='text-sm text-slate-500'>comment as <span className='text-sky-500'>@{truncateText((user.displayName || user.email?.split('@')[0]) as string, 40)}</span></h2>

          <div className='flex items-center mt-3'>
            <div className="mr-2 w-[40px] shrink-0 self-start bg-gradient-to-t from-gray-600 to-gray-900 to-80% rounded-full">
              <img
                className="h-[40px] w-[40px] rounded-full"
                src={user.photoURL ? user.photoURL : avatars[getAvatarCode(user.displayName || user.email?.split('@')[0] as string)].url}
                alt=""
              />
            </div>

            <div className='sticky bottom-0 flex flex-col gap-3 w-full mb-10'>

              <textarea ref={textareaRef} value={commentText} onChange={handleChange} name="comment" id="comment" className='pb-14 no-scrollbar resize-none w-full bg-transparent outline-none py-3 px-4 focus:border-blue-800 font-poppins tracking-wide text-gray-200' placeholder='Post your comment...'></textarea>

              <div className='absolute bottom-2 w-full flex items-center gap-2 pr-2 justify-end transition-all duration-300'>
                {commentText.length > 0 && <CircularProgress size={commentText.length >= 195 ? '38px' : '28px'} trackColor='gray.700' thickness={commentText.length >= 195 ? '6px' : '10px'} value={(commentText.length * 100) / 200} color={commentText.length == 200 ? ('red.500') : (commentText.length >= 195 ? 'yellow.400' : 'cyan.600')}>
                  {commentText.length >= 195 && <CircularProgressLabel fontSize={'14px'} className='text-gray-400 font-poppins'>{200 - commentText.length}</CircularProgressLabel>}
                </CircularProgress>}

                <div className='relative flex items-center justify-center'>
                  <button onClick={() => onCreateComment(commentText, user)} className={`text-gray-200 bg-blue-600 px-4 py-2 rounded-full transition-all duration-300 ease-in ${commentText.length === 0 && 'opacity-40 pointer-events-none'}`}>comment</button>
                  {createLoading && <Spinner className='absolute' size={'sm'} thickness='3px' color='gray.300' speed='0.75s' />}
                </div>

              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='py-2 mb-6 flex items-center justify-between'>
          <span className='text-gray-400'>Login or Signup to leave a comment</span>

          <div className='font-chillax font-medium space-x-3 cursor-pointer'>
            <button onClick={() => dispatch(setAuthModalState({ open: true, view: "login" }))} className='border-[1px] border-blue-600 text-gray-200 px-4 py-1 rounded-full'>Login</button>
            <button onClick={() => dispatch(setAuthModalState({ open: true, view: "signup" }))} className='bg-blue-600 px-4 py-1 rounded-full'>Signup</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommentInput