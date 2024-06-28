import useDirectory from '@/hooks/useDirectory';
import { MenuItem } from '@chakra-ui/react';
import React from 'react'
import { useNavigate } from 'react-router-dom';

type MenuListItemProps = {
  displayText: string;
  link: string;
  imageURL?: string;
}

function MenuListItem({ displayText, link, imageURL }: MenuListItemProps) {
  const { onSelectMenuItem } = useDirectory();

  return (
    <MenuItem
      zIndex={10}
      bgColor="transparent"
      className="gap-2 rounded-md hover:bg-blue-700 hover:text-gray-100"
      onClick={() => onSelectMenuItem({
        displayText,
        link,
        imageURL
      })}
    >
      <img className='w-8 h-8 rounded-full shadow-[0px_0px_20px_0px_rgba(225,225,225,0.3)]' src={imageURL ? imageURL : '/profile.png'} alt="community" />

      <span className="font-poppins ml-2 text-sm font-medium">
        {displayText}
      </span>
    </MenuItem>
  )
}

export default MenuListItem