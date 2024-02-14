
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';

import { signOut, User } from 'firebase/auth';

import { RiArrowDropDownLine, RiBardLine, RiLogoutBoxLine, RiProfileLine, RiUser4Line } from '@remixicon/react';
import { useDispatch } from 'react-redux';
import { auth } from '../../../firebase/clientApp';
import { resetCommunitiesState, setAuthModalState } from '../../../slices';

type Props = {
  user?: User | null;
}

const UserMenu = ({ user }: Props) => {

  const dispatch = useDispatch();

  const logout = () => {
    signOut(auth);
    dispatch(resetCommunitiesState());
  }

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        _hover={{ outline: "none", background: "gray.800" }}
        className=' mx-1 px-2 h-10 md:h-12 rounded-md'
      >
        <div className=' flex items-center space-x-1'>
          {
            user ?
              (
                <div className=' flex items-center space-x-1 justify-around'>
                  <img className='w-6 h-6 lg:w-8 lg:h-8 rounded-full shadow-2xl shadow-secondary' src="/profile.png" alt="" />

                  <div className='hidden lg:flex flex-col'>
                    <span className='hidden lg:inline-block'>{user.displayName || user.email?.split("@")[0]}</span>
                    <span className=' flex items-center text-sm text-gray-500'><RiBardLine size={20} className=" text-secondary" /> 1 Karma</span>
                  </div>

                </div>
              ) :
              (
                <RiUser4Line size={24} className="" />
              )
          }
          <RiArrowDropDownLine size={20} />
        </div>
      </MenuButton>
      <MenuList boxShadow={'0px 0px 10px 1px rgb(93 0 255 / 0.8 )'} padding={'0px 0px'} borderColor='gray.500' bgColor='blackAlpha.900' className=' flex flex-col items-center'>
        {
          user ?
            (
              <>
                <MenuItem bgColor='transparent' className='gap-2 rounded-md hover:text-indigo-200 hover:bg-zinc-900'>
                  <RiProfileLine size={28} className="" />
                  <span className=' text-lg font-medium font-poppins'>Profile</span>
                </MenuItem>
                <MenuItem bgColor='transparent' className='gap-2 rounded-md hover:text-indigo-200 hover:bg-zinc-900' onClick={logout}>
                  <RiLogoutBoxLine size={24} className="" />
                  <span className='text-lg font-medium font-poppins'>Logout</span>
                </MenuItem>
              </>
            ) :
            (
              <MenuItem bgColor='transparent' onClick={() => dispatch(setAuthModalState({ open: true, view: "login" }))} className='gap-2 rounded-md hover:text-indigo-200 hover:bg-zinc-900'>
                <RiLogoutBoxLine size={20} className="" />
                <span className='text-lg font-medium font-poppins'>Login</span>
              </MenuItem>

            )
        }

      </MenuList>
    </Menu>
  )
}

export default UserMenu