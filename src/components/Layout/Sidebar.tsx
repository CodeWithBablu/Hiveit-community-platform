import useCommunity from '@/hooks/useCommunity';
import { RiAddLine, RiHome2Line, RiReceiptLine } from '@remixicon/react'
import { truncateText } from '@/lib/Utils';
import { Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel } from '@chakra-ui/react';
import { CommunitiesState, CommunitySnippet } from '@/slices/communitySlice';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateCommunityModelOpen, setRecentCommunities } from '@/slices';
import useDirectory from '@/hooks/useDirectory';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CreateCommunityModal from '../Modal/CreateCommunity/CreateCommunityModal';

type Props = {
  isDrawer: boolean;
  handleClose?: () => void;
}

const Sidebar = ({ isDrawer, handleClose }: Props) => {

  const { userCommunities: { mySnippets } } = useCommunity();
  const { toggleMenuOpen } = useDirectory();
  const { recentCommunities } = useSelector((state: { communitiesState: CommunitiesState }) => state.communitiesState);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const storedCommunitySnippets: CommunitySnippet[] = JSON.parse(localStorage.getItem('recentCommunities') || '[]') || [];
    dispatch(setRecentCommunities({ recentCommunities: storedCommunitySnippets }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const scrollToTop = () => {
    console.log("hr");
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`${isDrawer ? 'flex w-full' : 'hidden xl:flex w-[276px]'} mt-14 sticky top-14 text-sm flex-col gap-2 p-3 h-fit max-h-[calc(100dvh-7rem)] overflow-y-scroll shrink-0 rounded-xl`}>

      <div className='flex flex-col gap-2'>
        {/* <CreateCommunityModal open={open} handleClose={() => setOpen(false)} /> */}

        <div onClick={() => { (handleClose && handleClose()); navigate("/") }} className='z-50 px-3 py-3 text-gray-300 hover:bg-zinc-900/70 rounded-lg cursor-pointer flex items-center gap-3'><RiHome2Line /> Home</div>
        <div onClick={() => { dispatch(setCreateCommunityModelOpen(true)); (handleClose && handleClose()); }} className='px-3 py-3 text-gray-300 hover:bg-zinc-900/70 rounded-lg cursor-pointer flex items-center gap-3'><RiAddLine /> Create Community</div>
        <div onClick={() => { (handleClose && handleClose()); scrollToTop(); toggleMenuOpen(); }} className='px-3 py-3 text-gray-300 hover:bg-zinc-900/70 rounded-lg cursor-pointer flex items-center gap-3'><RiReceiptLine /> Create Post</div>
      </div>

      <hr className='border-zinc-900 my-3' />

      <Accordion defaultIndex={[0, 1, 2]} allowMultiple>

        <AccordionItem border={'none'}>
          <h2>
            <AccordionButton padding={'12px 12px'} _hover={{ backgroundColor: '#1d4ed8', textColor: "gray.100" }} className='text-gray-500 font-medium hover:bg-zinc-900/70 rounded-lg'>
              <div className="tracking-wide">
                MODERATING
              </div>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel padding={'unset'} >
            {mySnippets.filter(snippet => snippet.isModerator).map((snippet, index) => (
              <Link to={`/h/${snippet.communityId}`} key={index} className='mt-2 flex items-center cursor-pointer gap-3 px-3 py-2 hover:bg-zinc-900/70 rounded-xl'>
                <img className='w-[30px] h-[30px] shadow-[0px_0px_10px_0px_rgba(225,225,225,0.3)] object-cover rounded-full' src={snippet.imageURL ? snippet.imageURL : '/profile.png'} alt="comm img" />
                <span className='text-gray-300 text-sm tracking-wide'>h/{truncateText(snippet.communityId, 15)}</span>
              </Link>
            ))}
          </AccordionPanel>
        </AccordionItem>

        <hr className='border-zinc-900 my-3' />

        <AccordionItem border={'none'}>
          <h2>
            <AccordionButton padding={'12px 12px'} _hover={{ backgroundColor: '#1d4ed8', textColor: "gray.100" }} className='text-gray-500 font-medium hover:bg-zinc-900/70 rounded-lg'>
              <div className="tracking-wide">
                COMMUNITIES
              </div>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel padding={'unset'}>
            {mySnippets.filter(snippet => !snippet.isModerator).map((snippet, index) => (
              <Link to={`/h/${snippet.communityId}`} key={index} className='mt-2 flex items-center cursor-pointer gap-3 px-3 py-2 hover:bg-zinc-900/70 rounded-xl'>
                <img className='w-[30px] h-[30px] shadow-[0px_0px_10px_0px_rgba(225,225,225,0.3)] object-cover rounded-full' src={snippet.imageURL ? snippet.imageURL : '/profile.png'} alt="comm img" />
                <span className='text-gray-300 text-sm tracking-wide'>h/{truncateText(snippet.communityId, 15)}</span>
              </Link>
            ))}
          </AccordionPanel>
        </AccordionItem>

        <hr className='border-zinc-900 my-3' />

        <AccordionItem border={'none'}>
          <h2>
            <AccordionButton padding={'12px 12px'} _hover={{ backgroundColor: '#1d4ed8', textColor: "gray.100" }} className='text-gray-500 font-medium hover:bg-zinc-900/70 rounded-lg'>
              <div className="tracking-wide">
                RECENT
              </div>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel padding={'unset'}>
            {recentCommunities.map((snippet, index) => (
              <Link to={`/h/${snippet.communityId}`} key={index} className='mt-2 flex items-center cursor-pointer gap-3 px-3 py-2 hover:bg-zinc-900/70 rounded-xl'>
                <img className='w-[30px] h-[30px] shadow-[0px_0px_10px_0px_rgba(225,225,225,0.3)] object-cover rounded-full' src={snippet.imageURL ? snippet.imageURL : '/profile.png'} alt="comm img" />
                <span className='text-gray-300 text-sm tracking-wide'>h/{truncateText(snippet.communityId, 15)}</span>
              </Link>
            ))}
          </AccordionPanel>
        </AccordionItem>

      </Accordion>

      {/* <div className='h-[1000px] bg-rose-100'></div> */}
    </div>
  )
}

export default Sidebar