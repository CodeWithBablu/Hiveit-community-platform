import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CommunitiesState,
  Community,
  CommunitySnippet,
} from "../slices/communitySlice";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/clientApp";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { resetMySnippets, setAuthModalState, setCurrentCommunity, setInitSnippetFetched, setMyCommunitySnippets } from "../slices";
import { Toast } from "../lib/Toast";
import { useParams } from "react-router-dom";
import { timestampToMillis } from "@/lib/Utils";

const useCommunity = () => {
  const [user] = useAuthState(auth);
  const { communityId } = useParams();
  const dispatch = useDispatch();

  const userCommunities: CommunitiesState = useSelector(
    (state: { communitiesState: CommunitiesState }) => state.communitiesState,
  );


  useEffect(() => {
    if (!user) {
      dispatch(resetMySnippets());
      dispatch(setInitSnippetFetched({ initSnippetFetched: false }));
      return;
    }

    getMySnippets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (communityId && !userCommunities.currentCommunity) {
      getCommunityData(communityId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityId, userCommunities.currentCommunity]);

  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean,
  ) => {
    //check if user login --> if not show login model
    if (!user) {
      dispatch(setAuthModalState({ open: true, view: "login" }));
      return;
    }

    if (isJoined) leaveCommunity(communityData);
    else joinCommunity(communityData);
  };

  async function getCommunityData(communityId: string) {
    try {
      const communityDocRef = doc(firestore, `communities`, communityId);
      const communityDoc = await getDoc(communityDocRef);
      let updatedCurrCommunity = { id: communityDoc.id, ...communityDoc.data() } as Community;
      updatedCurrCommunity = { ...updatedCurrCommunity, createdAt: timestampToMillis(updatedCurrCommunity.createdAt as Timestamp) }
      dispatch(setCurrentCommunity({ currentCommunity: updatedCurrCommunity }));
    } catch (error) {
      console.log(error);
    }
  }

  async function getMySnippets() {
    const snippetCollectionRef = collection(
      firestore,
      `users/${user?.uid}/communitySnippets`,
    );

    try {
      //get user snippets
      const snippetDocs = await getDocs(snippetCollectionRef);
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));

      const updatedSnippets = await Promise.all(
        snippets.map(async (snippet) => {
          const { imageURL, communityId } = snippet;
          if (!imageURL) {
            const communityDoc = (await getDoc(doc(firestore, 'communities', communityId))).data();
            if (communityDoc?.imageURL) {
              await updateDoc(doc(firestore, `users/${user?.uid}/communitySnippets`, communityId), { imageURL: communityDoc.imageURL });
              return { ...snippet, imageURL: communityDoc.imageURL };
            }
          }
          return snippet;
        })
      );

      dispatch(setMyCommunitySnippets({ mySnippets: updatedSnippets as [CommunitySnippet] }));
      dispatch(setInitSnippetFetched({ initSnippetFetched: true }));
    } catch (error) {
      console.log("getCommunity Snippets error: ", error);
    }
  }

  const joinCommunity = async (communityData: Community) => {
    try {
      const batch = writeBatch(firestore);

      //add new snippet to user communitySnippets collection
      let docRef = doc(
        firestore,
        `users/${user?.uid}/communitySnippets`,
        communityData.id,
      );
      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || "",
        isModerator: user?.uid === communityData.creatorId
      };

      batch.set(docRef, newSnippet);

      //updating numofmembers++
      docRef = doc(firestore, `communities`, communityData.id);
      batch.update(docRef, {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      // update CommunitiesState.mySnippets
      dispatch(setMyCommunitySnippets({ mySnippets: [...userCommunities.mySnippets, newSnippet] as [CommunitySnippet] }));
    }
    catch (error) {
      console.log(
        "Joining community error : ",
        error instanceof Error ? error.message : String(error),
      );
      Toast("error", "Failed to Join community. Try again later", 4000);
    }
  };

  const leaveCommunity = async (communityData: Community) => {
    try {
      if (communityData.creatorId === user?.uid)
        return Toast("info", "Nice try, but you're the founding member!", 4000);

      const batch = writeBatch(firestore);

      //remove snippet from user communitySnippets collection
      let docRef = doc(
        firestore,
        `users/${user?.uid}/communitySnippets`,
        communityData.id,
      );
      batch.delete(docRef);

      //updating numofmembers--
      docRef = doc(firestore, `communities`, communityData.id);
      batch.update(docRef, {
        numberOfMembers: increment(-1),
      });

      await batch.commit();

      // update CommunitiesState.mySnippets
      dispatch(
        setMyCommunitySnippets({
          mySnippets: [
            ...userCommunities.mySnippets.filter(
              (snippet) => snippet.communityId != communityData.id,
            ),
          ] as [CommunitySnippet],
        }),
      );
    } catch (error) {
      console.log(
        "Leaving community error : ",
        error instanceof Error ? error.message : String(error),
      );
      Toast("error", "Failed to leave community. Try again later", 4000);
    }
  };

  return {
    userCommunities,
    onJoinOrLeaveCommunity,
  };
};

export default useCommunity;
