import { Timestamp, doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { useParams } from "react-router-dom";
import { CommunitiesState, Community } from "../slices/communitySlice";
import NotFound from "../components/Community/NotFound";
import useSWR from "swr";
import { Spinner } from "@chakra-ui/react";
import Header from "../components/Community/Header";
import PageLayout from "../components/Layout/PageLayout";
import Posts from "@/components/Post/Posts";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setCurrentCommunity } from "@/slices";
import About from "@/components/Community/About";
import { timestampToMillis } from "@/lib/Utils";

const fetchCommunityData = async (communityId: string) => {
  const communityDocRef = doc(firestore, "communities", communityId);
  const communityDoc = await getDoc(communityDocRef);
  if (communityDoc.exists()) {
    const newData = { id: communityId, ...communityDoc.data() };
    return await JSON.parse(JSON.stringify(newData));
  }
};

const CommunityPage = () => {
  const { communityId } = useParams();
  const {
    data: communityData,
    error,
    isLoading,
  } = useSWR<Community>(communityId, fetchCommunityData);


  const dispatch = useDispatch();

  useEffect(() => {
    if (communityData) {
      const updatedCurrCommunity = { ...communityData, createdAt: timestampToMillis(communityData.createdAt as Timestamp) } as Community;
      dispatch(setCurrentCommunity({ currentCommunity: updatedCurrCommunity }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityData]);

  if (isLoading)
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-zinc-950">
        <Spinner className="" size={"xl"} thickness="7px" color="blue" />
      </div>
    );

  if (!communityData || error) {
    return <NotFound />;
  }

  return (
    <div className="bg-zinc-950">
      <div>
        {/* flex flex-col max-w-7xl m-auto xl:border-x-[1px] border-zinc-600 shadow-[0px_0px_30px_0px_rgba(124 ,45 ,18,0.5)]*/}
        <PageLayout>
          {/* //// Left content */}
          <>
            <div>
              <Header communityData={communityData} />
              {communityData && <Posts communityData={communityData} />}
            </div>
          </>

          {/* //// Right Content */}
          <>
            <div className="sticky top-14 w-full max-w-[350px] h-fit mt-14">
              <About communityData={communityData} />
            </div>
          </>
        </PageLayout>
      </div>
    </div>
  );
};

export default CommunityPage;
