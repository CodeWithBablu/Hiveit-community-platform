import { MenuItem } from "@chakra-ui/react";
import CreateCommunityModal from "../../Modal/CreateCommunity/CreateCommunityModal"
import { useState } from "react";


const addicon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>;

// type Props = {}

const Communities = () => {

  const [open, setOpen] = useState(false);

  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <MenuItem bgColor='transparent' className='gap-2 rounded-md hover:text-gray-100 hover:bg-zinc-900' onClick={() => setOpen(true)}>
        {addicon}
        <span className='text-lg font-medium font-poppins'>Create Community</span>
      </MenuItem>
    </>
  )
}

export default Communities