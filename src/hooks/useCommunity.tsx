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
  collection,
  doc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import { setAuthModalState, setCommunitiesState } from "../slices";
import { Toast } from "../lib/Toast";

const useCommunity = () => {
  const [user] = useAuthState(auth);
  const dispatch = useDispatch();
  const userCommunities: CommunitiesState = useSelector(
    (state: { communitiesState: CommunitiesState }) => state.communitiesState,
  );

  useEffect(() => {
    if (user) getMySnippets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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

  async function getMySnippets() {
    const snippetCollectionRef = collection(
      firestore,
      `users/${user?.uid}/communitySnippets`,
    );

    try {
      //get user snippets
      const snippetDocs = await getDocs(snippetCollectionRef);
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      dispatch(
        setCommunitiesState({ mySnippets: snippets as [CommunitySnippet] }),
      );
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
        imageUrl: communityData.imageURL || "",
      };

      batch.set(docRef, newSnippet);

      //updating numofmembers++
      docRef = doc(firestore, `communities`, communityData.id);
      batch.update(docRef, {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      // update CommunitiesState.mySnippets
      dispatch(
        setCommunitiesState({
          mySnippets: [...userCommunities.mySnippets, newSnippet] as [
            CommunitySnippet,
          ],
        }),
      );
    } catch (error) {
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
        setCommunitiesState({
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
