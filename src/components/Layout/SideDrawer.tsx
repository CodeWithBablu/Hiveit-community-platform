import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, useDisclosure } from '@chakra-ui/react'
import { RiMenu4Line } from '@remixicon/react';
import Sidebar from './Sidebar';
import { useState } from 'react';


const SideDrawer = () => {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <RiMenu4Line onClick={() => setIsOpen(true)} className='cursor-pointer' size={30} />
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={() => setIsOpen(false)}
      >
        <DrawerContent backgroundColor={"blackAlpha.800"} className='backdrop-blur-xl' overflowX={'hidden'}>
          <DrawerCloseButton className='text-gray-400' />

          <DrawerBody className='overflow-x-hidden overflow-y-scroll'>
            <Sidebar isDrawer={true} handleClose={handleClose} />
          </DrawerBody>

        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer