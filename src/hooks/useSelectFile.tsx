import { updateInAlgolia } from "@/config/algoliaFunctions";
import { firestore, storage } from "@/firebase/clientApp";
import { FileCategoryType, Usertype } from "@/lib/Definations";
import { Toast } from "@/lib/Toast";
import { changeCommunityImages, setRecentCommunities } from "@/slices";
import { Community, CommunitySnippet } from "@/slices/communitySlice";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ChangeEvent, useState } from "react"
import { useDispatch } from "react-redux";


function useSelectFile() {

  const [selectedFile, setSelectedFile] = useState<string>('');
  const dispatch = useDispatch();

  const onSelectFile = async (e: ChangeEvent<HTMLInputElement>, fileCategory: (FileCategoryType | "") = "", data: Community | string) => {

    if (fileCategory.length == 0 && !data) return;
    e.preventDefault();
    e.stopPropagation();

    try {
      if (e.target.files && e.target.files[0]) {
        const file = Array.from(e.target.files)[0];
        const fileExtension = file.name.split('.').pop();
        let newFileName = "";
        let downloadURL = ""

        if (typeof data !== 'string') {
          // Generate new file name with the same extension
          if (fileCategory === 'community_image')
            newFileName = `communityImage.${fileExtension}`;
          else if (fileCategory === 'community_bgImage')
            newFileName = `communityBgImage.${fileExtension}`;

          // Create a storage reference with the new file name
          const storageRef = ref(storage, `communities/${data.id}/${newFileName}`);
          const snapshot = await uploadBytes(storageRef, file);
          downloadURL = await getDownloadURL(snapshot.ref);

          const communityDocRef = doc(firestore, `communities/${data.id}`);
          const communitySnippetDocRef = doc(firestore, `users/${data.creatorId}/communitySnippets/${data.id}`);

          await updateDoc(communityDocRef, {
            ...(fileCategory === 'community_image' && { imageURL: downloadURL }),
            ...(fileCategory === 'community_bgImage' && { bgImageURL: downloadURL }),
          });

          if (fileCategory === "community_image") {
            await updateDoc(communitySnippetDocRef, {
              imageURL: downloadURL,
            });
          }

          dispatch(changeCommunityImages({ fileCategory: fileCategory as FileCategoryType, url: downloadURL }));

          if (fileCategory === 'community_image') {
            await updateInAlgolia(data, downloadURL);
            const storedCommunitySnippets: CommunitySnippet[] = JSON.parse(localStorage.getItem('recentCommunities') || '[]') || [];
            const newSnippet: CommunitySnippet = { communityId: data.id, imageURL: downloadURL };
            const updatedRecentCommunities: CommunitySnippet[] = [newSnippet, ...storedCommunitySnippets.filter((snippet) => snippet.communityId !== newSnippet.communityId).slice(0, 4)];
            localStorage.setItem('recentCommunities', JSON.stringify(updatedRecentCommunities));
            dispatch(setRecentCommunities({ recentCommunities: updatedRecentCommunities }));
          }
        }
        else {
          const userId = data;
          newFileName = `userImg.${fileExtension}`;
          // Create a storage reference with the new file name
          const storageRef = ref(storage, `users/${userId}/${newFileName}`);
          const snapshot = await uploadBytes(storageRef, file);
          downloadURL = await getDownloadURL(snapshot.ref);

          const userDocRef = doc(firestore, `users/${userId}`);
          const userDocSnap = await getDoc(userDocRef);

          if (!userDocSnap.exists()) return;
          const userDoc = { id: userDocSnap.id, ...userDocSnap.data() } as Usertype;
          userDoc.providerData[0].photoURL = downloadURL;

          await updateDoc(userDocRef, {
            ...userDoc,
          });
        }

        console.log(downloadURL);
        setSelectedFile(downloadURL);
      }
      else
        return Toast('info-bottom', "oops didn't get the file", 3000);
    } catch (error) {
      return Toast('error-bottom', 'failed to upload image', 3000);
    }
  }


  return {
    selectedFile,
    setSelectedFile,
    onSelectFile
  }
}

export default useSelectFile