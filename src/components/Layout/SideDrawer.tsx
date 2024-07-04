import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, useDisclosure } from '@chakra-ui/react'
import { RiMenu4Line } from '@remixicon/react';
import Sidebar from './Sidebar';


const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <RiMenu4Line onClick={onOpen} className='cursor-pointer' size={30} />
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
      >
        <DrawerContent backgroundColor={"blackAlpha.800"} className='backdrop-blur-xl' overflowX={'hidden'}>
          <DrawerCloseButton className='text-gray-400' />

          <DrawerBody className='overflow-x-hidden overflow-y-scroll'>
            <Sidebar isDrawer={true} />
          </DrawerBody>

        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer