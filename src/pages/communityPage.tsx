import { Timestamp, doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { useParams } from "react-router-dom";
import { Community, CommunitySnippet } from "../slices/communitySlice";
import NotFound from "../components/Community/NotFound";
import useSWR from "swr";
import { Spinner } from "@chakra-ui/react";
import Header from "../components/Community/Header";
import PageLayout from "../components/Layout/PageLayout";
import Posts from "@/components/Post/Posts";
import { useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import { setCurrentCommunity, setRecentCommunities } from "@/slices";
import About from "@/components/Community/About";
import { timestampToMillis } from "@/lib/Utils";



const CommunityPage = () => {
  const { communityId } = useParams();

  const fetchCommunityData = useCallback(async (communityId: string) => {
    const communityDocRef = doc(firestore, "communities", communityId);
    const communityDoc = await getDoc(communityDocRef);
    if (communityDoc.exists()) {
      const newData = { id: communityId, ...communityDoc.data() } as Community;
      const storedCommunitySnippets: CommunitySnippet[] = JSON.parse(localStorage.getItem('recentCommunities') || '[]') || [];
      const newSnippet: CommunitySnippet = { communityId: newData.id, imageURL: newData.imageURL };
      const updatedRecentCommunities: CommunitySnippet[] = [newSnippet, ...storedCommunitySnippets.filter((snippet) => snippet.communityId !== newSnippet.communityId).slice(0, 4)];
      localStorage.setItem('recentCommunities', JSON.stringify(updatedRecentCommunities));
      dispatch(setRecentCommunities({ recentCommunities: updatedRecentCommunities }));
      return await JSON.parse(JSON.stringify(newData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <div className="border-x-[1px] border-dimGray">
              <Header communityData={communityData} />
              {communityData && <Posts communityData={communityData} />}
            </div>
          </>

          {/* //// Right Content */}
          <>
            <div className="sticky top-14 w-[350px] h-fit mt-14">
              <About communityData={communityData} />
            </div>
          </>
        </PageLayout>
      </div>
    </div>
  );
};

export default CommunityPage;
