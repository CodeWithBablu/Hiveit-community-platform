import PageLayout from "@/components/Layout/PageLayout"
import { auth, firestore } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { FileCategoryType, Usertype } from "@/lib/Definations";
import useSelectFile from "@/hooks/useSelectFile";
import { avatars } from "@/config/avatar";
import { getAvatarCode } from "@/lib/Utils";
import Comments from "@/components/Post/Comments/Comments";
import { Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, or, query, where } from "firebase/firestore";

const camera = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
</svg>;


const ProfilePage = () => {
  const [user, loadingUser] = useAuthState(auth);
  const [profileUser, setProfileUser] = useState<Usertype | null>(null);
  const [fileCategory, setFileCategory] = useState<FileCategoryType | null>(null);
  const fileSelectorRef = useRef<HTMLInputElement>(null);

  const { onSelectFile } = useSelectFile();

  const { username } = useParams();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // if (!fileCategory && !currentCommunity) return;

    // if (fileCategory === 'community_image')
    //   onSelectFile(e, 'community_image', currentCommunity as Community);
    // else
    //   onSelectFile(e, 'community_bgImage', currentCommunity as Community);
  }

  const getUser = useCallback(async () => {
    if (username) {
      const userQuery = query(
        collection(firestore, 'users'),
        or(
          where("displayName", "==", username),
          where("email", "==", `${username}@gmail.com`)
        )
      );
      const userDocs = await getDocs(userQuery);
      const profileUserDoc = userDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0];
      if (profileUserDoc)
        setProfileUser(profileUserDoc as Usertype);
    }
  }, [username]);

  useEffect(() => {
    if (!loadingUser && username) {
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, loadingUser]);

  if (loadingUser && !profileUser)
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-zinc-950">
        <Spinner className="" size={"xl"} thickness="7px" color="blue" />
      </div>
    );

  let photoURL = "";
  if (profileUser && profileUser.providerData[0].photoURL)
    photoURL = profileUser.providerData[0].photoURL;

  return (
    <div className="bg-zinc-950">
      <div>
        {/* flex flex-col max-w-7xl m-auto xl:border-x-[1px] border-zinc-600 shadow-[0px_0px_30px_0px_rgba(124 ,45 ,18,0.5)]*/}
        <PageLayout>
          {/* //// Left content */}
          <>
            <div className="border-x-[1px] border-dimGray w-full">

              <div className="flex items-center gap-12 px-4 py-3">

                <div className="relative  bg-zinc-950 w-fit rounded-full">
                  <img
                    className="h-20 w-20 rounded-full md:h-[110px] md:w-[110px] object-cover bg-gradient-to-b from-gray-700 to-gray-950 to-80%"
                    src={photoURL ? photoURL : '/profile.png'}
                    alt="communty bg Image"
                  />
                  {/* {(!user || !user.photoURL) && <img
                      className="h-20 w-20 rounded-full md:h-[110px] md:w-[110px] object-cover bg-gradient-to-b from-gray-700 to-gray-950 to-80%"
                      src={user ? avatars[getAvatarCode(user.displayName || user.email?.split('@')[0] as string)].url : "/profile.png"}
                      alt="communty bg Image"
                    />} */}

                  {<motion.div whileTap={{ scale: 0.80 }} onClick={() => { setFileCategory('community_image'); fileSelectorRef.current?.click() }} title="change community background image" className="absolute bottom-1 -right-4 md:bottom-5 md:-right-5 cursor-pointer text-gray-200 bg-gray-500/30 backdrop-blur-xl rounded-full p-3">
                    {camera}
                  </motion.div>}

                  <input ref={fileSelectorRef} onChange={handleFileChange} id="file-upload" type="file" className="hidden" accept="image/x-png,image/gif,image/jpeg,image/webp" />
                </div>

                <div className="flex flex-col gap-1">
                  <h1 className="text-gray-200 text-2xl sm:text-4xl font-chillax font-medium">{profileUser?.displayName || profileUser?.email?.split('@')[0]}</h1>
                  <h2 className="text-slate-400 text-base sm:text-xl">u/{profileUser?.displayName || profileUser?.email?.split('@')[0]}</h2>
                </div>
              </div>

              {profileUser && <Comments user={user} profileUser={profileUser} />}


            </div>
          </>

          {/* //// Right Content */}
          <>
            <div className="sticky top-14 w-[350px] h-fit mt-14">
              {/* <ProfileInfo /> */}
              <h2>profile Info</h2>
            </div>
          </>
        </PageLayout>
      </div>
    </div>
  )
}

export default ProfilePage