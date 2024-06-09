import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Checkbox, Spinner } from "@chakra-ui/react"
import { RiGroupFill, RiEyeOffFill, RiLockPasswordFill } from "@remixicon/react";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { useState } from "react";
import { auth, firestore } from "../../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { Toast } from "../../../lib/Toast";

type Props = {
  open: boolean;
  handleClose: () => void;
}

const CreateCommunityModal = ({ open, handleClose }: Props) => {

  const [communityName, setCommunityName] = useState("");
  const [desc, setDesc] = useState("");
  const [communityType, setCommunityType] = useState("public");
  const [charsRemaining, setCharsRemaining] = useState(21);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [user] = useAuthState(auth);

  //// On Chnage method
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (event.target.value.length > 21) return;
    setCommunityName(event.target.value);
    setCharsRemaining(21 - event.target.value.length);
  }

  const onDescChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setError('');
    if (event.target.value.length > 400) return;
    setDesc(event.target.value);
  }

  //// Checkbox Logic
  const onCommunityTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommunityType(event.target.name);
  }

  //// create community method
  const handleCreateCommunity = async () => {
    if (error) setError('');
    // validate the community name
    const communityNameFormat = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
    if (communityNameFormat.test(communityName) || communityName.length < 3)
      return setError("Community names must be 3-21 characters long and can only include letters, numbers, or underscores.");

    if (desc.length > 400 || desc.length < 10)
      return setError("Description must be between 10 and 400 characters in length!!");


    setLoading(true);

    try {
      const communityDocRef = doc(firestore, 'communities', communityName);

      await runTransaction(firestore, async (transaction) => {

        // Task 1: Check if commmunityName is taken already
        const communityDoc = await transaction.get(communityDocRef);

        if (communityDoc.exists())
          throw new Error(`Oops!! u/${communityName} already taken 😢️ `);

        // Task 2: Create new community
        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          numberOfPosts: 0,
          privacyType: communityType,
          description: desc
        });

        // Task 3:Add communitySnippet to the moderator(owner of this community)
        transaction.set(doc(firestore, `users/${user?.uid}/communitySnippets`, communityName), {
          communityId: communityName,
          isModerator: true,
        });

      });

      Toast('success', "Community created successfully!!", 4000);
      handleClose();

    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError(String(error));
    }
    setLoading(false);
  }

  return (
    <>
      <Modal isOpen={open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent className="md:min-w-[700px]" borderRadius={10}>
          <ModalHeader>
            Create Community
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className=" flex flex-col gap-2">
            <span className=" text-gray-600 font-semibold text-lg">Community name 🥳️</span>

            <div className=" relative flex items-center">
              <span className=" absolute text-gray-400 text-lg font-medium font-dynapuff left-2">h/</span>
              <input value={communityName} onChange={onChange} type="text" className=" w-80 outline-none text-lg text-gray-500 font-poppins font-medium border-2 hover:border-sky-300 focus:border-sky-500 rounded-md py-2 px-8" />
            </div>

            <span className={`text-base font-dynapuff ${charsRemaining < 5 ? 'text-rose-400' : 'text-gray-500'}`}>{charsRemaining} Characters remaining</span>

            <div className="flex flex-col gap-2">
              <span className=" text-zinc-800 text-lg font-medium font-dynapuff">Description <span className="text-rose-500">*</span></span>
              <textarea value={desc} onChange={onDescChange} placeholder="desc..." className="resize-y w-full outline-none text-lg text-gray-500 font-poppins font-medium border-2 hover:border-sky-300 focus:border-sky-500 rounded-md py-2 px-2" />
              <span className={`text-base font-dynapuff ${desc.length > 400 ? 'text-rose-400' : 'text-gray-500'}`}>{desc.length > 400 ? `${desc.length}. Desc is too long` : `${desc.length}`}</span>
            </div>

            <h1 className=" font-poppins font-semibold">Community Type</h1>

            <Checkbox onChange={onCommunityTypeChange} isChecked={communityType === "public"} name="public">
              <div className=" ml-2">
                <div className=" flex items-center gap-2">
                  <RiGroupFill size={16} />
                  <h2 className=" font-poppins font-medium">Public</h2>
                </div>

                <h4 className=" text-gray-500">Anyone can view, posts or create new post and comment to the community</h4>
              </div>
            </Checkbox>

            <Checkbox onChange={onCommunityTypeChange} isChecked={communityType === "restricted"} name="restricted">
              <div className=" ml-2">
                <div className=" flex items-center gap-2">
                  <RiEyeOffFill size={16} />
                  <h2 className=" font-poppins font-medium">restricted</h2>
                </div>

                <h4 className=" text-gray-500">Anyone can view, posts or create new post and comment to the community</h4>
              </div>
            </Checkbox>

            <Checkbox onChange={onCommunityTypeChange} isChecked={communityType === "private"} name="private">
              <div className=" ml-2">
                <div className=" flex items-center gap-2">
                  <RiLockPasswordFill size={16} />
                  <h2 className=" font-poppins font-medium">Private</h2>
                </div>

                <h4 className=" text-gray-500">Anyone can view, posts or create new post and comment to the community</h4>
              </div>
            </Checkbox>

            <span className=" text-rose-500 min-h-5 font-poppins font-medium text-base">{error}</span>


          </ModalBody>

          <ModalFooter className=' bg-gray-900 rounded-b-[8px] text-white font-poppins font-medium gap-3'>

            <motion.button onClick={handleClose} whileTap={{ scale: 0.8 }} className={`rounded-md bg-rose-600 py-2 px-3`}>Cancel</motion.button>
            <div className="relative w-fit">
              <motion.button onClick={handleCreateCommunity} whileTap={{ scale: 0.8 }} type="submit" className={`rounded-md bg-blue-500 py-2 px-3 ${loading ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>Create Community</motion.button>
              {loading && <Spinner thickness='4px' className="absolute top-0 bottom-0 left-0 right-0 m-auto" />}
            </div>

          </ModalFooter>
        </ModalContent >
      </Modal >
    </>
  )
}

export default CreateCommunityModal