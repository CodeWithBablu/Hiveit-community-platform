import React from 'react'
import SortbyMenu from './SortbyMenu'
import { useNavigate, useParams } from 'react-router-dom';
import useDirectory from '@/hooks/useDirectory';
import { RiAddLine } from '@remixicon/react';


const CreatePostLink = () => {
  const { toggleMenuOpen } = useDirectory();
  const navigate = useNavigate();
  const { communityId } = useParams();

  const onClick = () => {
    // Could check for user to open auth modal before redirecting to submit
    if (communityId) {
      navigate(`/h/${communityId}/submit`);
      return;
    }
    // Open directory menu to select community to post to
    toggleMenuOpen();
  };

  return (
    <div className="my-5 flex w-full items-center justify-between px-2">
      <SortbyMenu />
      <button
        onClick={onClick}
        className="flex items-center gap-2 rounded-full px-4 py-3 text-base text-gray-200 ring-[1px] hover:bg-zinc-900/50 ring-gray-500"
      >
        <RiAddLine size={20} /> Create post
      </button>
    </div>
  )
}

export default CreatePostLink