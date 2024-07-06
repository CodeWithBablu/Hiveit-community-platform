import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Checkbox,
  Spinner,
} from "@chakra-ui/react";
import {
  RiGroupFill,
  RiEyeOffFill,
  RiLockPasswordFill,
} from "@remixicon/react";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { useState } from "react";
import { auth, firestore } from "../../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { Toast } from "../../../lib/Toast";
import { useNavigate } from "react-router-dom";
import useDirectory from "@/hooks/useDirectory";
import { saveToAlgolia } from "@/config/algoliaFunctions";
import { Community } from "@/slices/communitySlice";

type Props = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModal = ({ open, handleClose }: Props) => {
  const [communityName, setCommunityName] = useState("");
  const [desc, setDesc] = useState("");
  const [communityType, setCommunityType] = useState("public");
  const [charsRemaining, setCharsRemaining] = useState(21);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [user] = useAuthState(auth);
  const { toggleMenuOpen } = useDirectory();

  const navigate = useNavigate();

  //// On Change method
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (event.target.value.length > 21) return;
    setCommunityName(event.target.value);
    setCharsRemaining(21 - event.target.value.length);
  };

  const onDescChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setError("");
    if (event.target.value.length > 400) return;
    setDesc(event.target.value);
  };

  //// Checkbox Logic
  const onCommunityTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCommunityType(event.target.name);
  };

  //// create community method
  const handleCreateCommunity = async () => {
    if (error) setError("");
    // validate the community name
    const communityNameFormat = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
    if (communityNameFormat.test(communityName) || communityName.length < 3)
      return setError(
        "Community names must be 3-21 characters long and can only include letters, numbers, or underscores.",
      );

    if (desc.length > 400 || desc.length < 10)
      return setError(
        "Description must be between 10 and 400 characters in length!!",
      );

    setLoading(true);

    try {
      const communityDocRef = doc(firestore, "communities", communityName);

      const newCommunity = {
        creatorId: user?.uid,
        createdAt: serverTimestamp(),
        numberOfMembers: 1,
        numberOfPosts: 0,
        privacyType: communityType,
        description: desc,
      }

      await runTransaction(firestore, async (transaction) => {
        // Task 1: Check if commmunityName is taken already
        const communityDoc = await transaction.get(communityDocRef);

        if (communityDoc.exists())
          throw new Error(`Oops!! h/${communityName} already taken 😢️ `);



        // Task 2: Create new community
        transaction.set(communityDocRef, newCommunity);

        // Task 3:Add communitySnippet to the moderator(owner of this community)
        transaction.set(
          doc(firestore, `users/${user?.uid}/communitySnippets`, communityName),
          {
            communityId: communityName,
            isModerator: true,
          },
        );
      });

      await saveToAlgolia({ id: communityName, ...newCommunity } as Community);
      setCommunityName("");
      navigate(`/h/${communityName}`);
      toggleMenuOpen();
      Toast("success", "Community created successfully!!", 4000);
      handleClose();
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError(String(error));
    }
    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent backgroundColor={"blackAlpha.800"} className="md:min-w-[700px] backdrop-blur-2xl font-poppins" borderRadius={10}>
          <ModalHeader className="text-lime-600 tracking-wide">Create Community</ModalHeader>
          <ModalCloseButton className="text-gray-400" />
          <ModalBody className="flex flex-col gap-2">
            <span className="text-lg font-medium font-poppins text-gray-300">
              Community name <span className="text-rose-600">*</span>
            </span>

            <div className="relative flex items-center bg-transparent">
              <span className="font-poppins absolute left-2 text-lg font-medium text-gray-400">
                h/
              </span>
              <input
                value={communityName}
                onChange={onChange}
                type="text"
                className="w-80 rounded-md border-2 px-8 py-2 font-poppins text-lg font-medium text-gray-400 bg-transparent outline-none border-dimGray hover:border-blue-700 focus:border-blue-700"
              />
            </div>

            <span className={`text-base mb-3 ${charsRemaining < 5 ? "text-rose-600" : "text-gray-500"}`}>
              {charsRemaining} Characters remaining
            </span>


            <div className="flex flex-col gap-2">
              <span className="text-lg font-medium text-gray-300">
                Description <span className="text-rose-600">*</span>
              </span>
              <textarea
                value={desc}
                onChange={onDescChange}
                placeholder="desc..."
                className="w-full resize-y rounded-md border-2 px-2 py-2 font-poppins bg-transparent text-gray-400 border-dimGray text-lg font-medium outline-none hover:border-blue-700 focus:border-blue-700"
              />
              <span
                className={`font-dynapuff text-base ${desc.length > 400 ? "text-rose-600" : "text-gray-500"}`}
              >
                {desc.length > 400
                  ? `${desc.length}. Desc is too long`
                  : `${desc.length}`}
              </span>
            </div>

            <h1 className="text-gray-300 font-medium">Community Type</h1>

            <Checkbox
              onChange={onCommunityTypeChange}
              isChecked={communityType === "public"}
              name="public"
            >
              <div className="ml-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <RiGroupFill size={16} />
                  <h2 className="font-medium">Public</h2>
                </div>

                <h4 className="text-gray-500">
                  Anyone can view, posts or create new post and comment to the
                  community
                </h4>
              </div>
            </Checkbox>

            <Checkbox
              onChange={onCommunityTypeChange}
              isChecked={communityType === "restricted"}
              name="restricted"
            >
              <div className="ml-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <RiEyeOffFill size={16} />
                  <h2 className="font-medium">restricted</h2>
                </div>

                <h4 className="text-gray-500">
                  Anyone can view, posts or create new post and comment to the
                  community
                </h4>
              </div>
            </Checkbox>

            <Checkbox
              onChange={onCommunityTypeChange}
              isChecked={communityType === "private"}
              name="private"
            >
              <div className="ml-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <RiLockPasswordFill size={16} />
                  <h2 className="font-medium">Private</h2>
                </div>

                <h4 className="text-gray-500">
                  Anyone can view, posts or create new post and comment to the
                  community
                </h4>
              </div>
            </Checkbox>

            <span className="min-h-5 font-poppins text-base font-medium text-rose-600">
              {error}
            </span>
          </ModalBody>

          <ModalFooter className="gap-3 rounded-b-[8px] font-poppins font-medium text-white">
            <motion.button
              onClick={handleClose}
              whileTap={{ scale: 0.8 }}
              className={`rounded-full px-4 py-3 text-rose-600 hover:bg-rose-950/50`}
            >
              Close
            </motion.button>
            <div className="relative w-fit">
              <motion.button
                onClick={handleCreateCommunity}
                whileTap={{ scale: 0.8 }}
                type="submit"
                className={`rounded-full bg-blue-700 px-6 py-3 ${loading ? "pointer-events-none opacity-30" : "opacity-100"}`}
              >
                Create Community
              </motion.button>
              {loading && (
                <Spinner
                  thickness="4px"
                  className="absolute bottom-0 left-0 right-0 top-0 m-auto"
                />
              )}
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal >
    </>
  );
};

export default CreateCommunityModal;
