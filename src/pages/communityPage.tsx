import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { firestore } from '../firebase/clientApp';
import { useNavigate, useParams } from 'react-router-dom';
import { Community } from '../slices/communitySlice';
import NotFound from '../components/Community/NotFound';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import Header from '../components/Community/Header';
import PageLayout from '../components/Layout/PageLayout';
import SortbyMenu from '../components/Community/SortbyMenu';
import { RiAddLine } from '@remixicon/react';

type Props = {
  communities: string;
}

const fetchCommunityData = async (communityId: string) => {
  const communityDocRef = doc(firestore, 'communities', communityId);
  const communityDoc = await getDoc(communityDocRef);
  if (communityDoc.exists()) {
    const newData = { id: communityId, ...communityDoc.data() }
    return await JSON.parse(JSON.stringify(newData));
  }
}

const CommunityPage = () => {

  const { communityId } = useParams();
  const { data: communityData, error, isLoading } = useSWR<Community>(communityId, fetchCommunityData);

  const navigate = useNavigate();

  if (isLoading || !communityData)
    return (
      <div className=' flex justify-center items-center min-h-[600px] bg-zinc-950'>
        <Spinner className='' size={'xl'} thickness='7px' color='blue' />
      </div>
    )

  if (error) {
    return <NotFound />
  }

  return (
    <div className=' bg-zinc-950'>
      <div>
        {/* flex flex-col max-w-7xl m-auto xl:border-x-[1px] border-zinc-600 shadow-[0px_0px_30px_0px_rgba(124 ,45 ,18,0.5)]*/}
        <PageLayout>
          {/* //// Left content */}
          <>
            <div>
              <Header communityData={communityData} />
              <div className='mt-10 w-full flex justify-between items-center'>
                <SortbyMenu />
                <button onClick={() => navigate(`submit`)} className='text-base font-semibold ring-[1px] ring-orange-600 shadow-[0px_0px_15px_0px_rgba(124,45,18,0.8)] rounded-full flex items-center gap-2 px-3 py-3'><RiAddLine size={20} /> Create post</button>
              </div>
            </div>
          </>
          {/* //// Right Content */}
          <><div>RHS</div></>
        </PageLayout>
      </div>
    </div>
  )
}

export default CommunityPage

// const [communityData, setCommunityData] = useState<Community | undefined>();

// useEffect(() => {
//   const fetcher = async () => {
//     console.log(communityId);
//     const communityDocRef = doc(firestore, 'communities', communityId as string);
//     const communityDoc = await getDoc(communityDocRef);

//     if (communityDoc.exists()) {
//       const newData = { id: communityId, ...communityDoc.data() }
//       console.log(communityDoc)
//       setCommunityData(JSON.parse(JSON.stringify(newData)));
//     }
//   }
//   fetcher();
// }, [communityId]);