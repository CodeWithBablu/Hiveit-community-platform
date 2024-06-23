import { firestore, storage } from "@/firebase/clientApp";
import { FileCategoryType } from "@/lib/Definations";
import { Toast } from "@/lib/Toast";
import { changeCommunityImages } from "@/slices";
import { Community } from "@/slices/communitySlice";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ChangeEvent, useState } from "react"
import { useDispatch } from "react-redux";


function useSelectFile() {

  const [selectedFile, setSelectedFile] = useState<string>('');
  const dispatch = useDispatch();

  const onSelectFile = async (e: ChangeEvent<HTMLInputElement>, fileCategory: (FileCategoryType | "") = "", communityData: Community) => {

    if (fileCategory.length == 0 && !communityData) return;
    e.preventDefault();
    e.stopPropagation();

    try {
      if (e.target.files && e.target.files[0]) {
        const file = Array.from(e.target.files)[0];
        const fileExtension = file.name.split('.').pop();
        let newFileName = "";
        // Generate new file name with the same extension
        if (fileCategory === 'community_image')
          newFileName = `communityImage.${fileExtension}`;
        else if (fileCategory === 'community_bgImage')
          newFileName = `communityBgImage.${fileExtension}`;

        // Create a storage reference with the new file name
        const storageRef = ref(storage, `communities/${communityData.id}/${newFileName}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const communityDocRef = doc(firestore, `communities/${communityData.id}`);
        await updateDoc(communityDocRef, {
          ...(fileCategory === 'community_image' && { imageURL: downloadURL }),
          ...(fileCategory === 'community_bgImage' && { bgImageURL: downloadURL }),
        });
        dispatch(changeCommunityImages({ fileCategory: fileCategory as FileCategoryType, url: downloadURL }))
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