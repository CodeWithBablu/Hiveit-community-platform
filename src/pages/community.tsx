import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { firestore } from '../firebase/clientApp';
import { useParams } from 'react-router-dom';
import { Community } from '../slices/communitySlice';
import NotFound from '../components/Community/NotFound';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import Header from '../components/Community/Header';
import PageLayout from '../components/Layout/PageLayout';

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

const Community = () => {

  const { communityId } = useParams();
  const { data: communityData, error, isLoading } = useSWR<Community>(communityId, fetchCommunityData);

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
        {/* flex flex-col max-w-7xl m-auto xl:border-x-[1px] border-zinc-600 */}
        <PageLayout>
          {/* //// Left content */}
          <>
            <div>
              <Header communityData={communityData} />
            </div>
          </>
          {/* //// Right Content */}
          <><div>RHS</div></>
        </PageLayout>
      </div>
    </div>
  )
}

export default Community

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