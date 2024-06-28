import { motion } from "framer-motion";
import { Spinner } from "@chakra-ui/react";

import TabItem from "./TabItem";
import { ChangeEvent, useReducer, useState } from "react";
import Postbody from "./PostForm/Postbody";
import { MetaData, Payload, formTabs } from "../../config/postConfig";
import FileInput from "./PostForm/FileUpload/FileInput";
import { User } from "firebase/auth";
import clsx from "clsx";
import Poll from "./PostForm/Poll";
import Link from "./PostForm/Link";
import axios from "axios";
import { Toast } from "@/lib/Toast";
import { isValidURL } from "@/lib/Utils";
import { Post } from "@/slices/postSlice";
import { useNavigate, useParams } from "react-router-dom";
import {
  DocumentReference,
  Timestamp,
  addDoc,
  collection,
  doc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "@/firebase/clientApp";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { FirebaseError } from "firebase/app";

export type FileWithUrl = {
  name: string;
  type: string;
  url: string;
  caption: string;
  link: string;
};

export type State = {
  files: FileWithUrl[];
};

export type Action =
  | { type: "Add_files"; payload: FileWithUrl[] }
  | { type: "Update_files"; payload: FileWithUrl[] }
  | { type: "Delete_file"; payload: number };

const fileHandler = (state: State, action: Action) => {
  switch (action.type) {
    case "Add_files":
      return {
        ...state,
        files: [...state.files, ...action.payload],
      };

    case "Update_files":
      return {
        ...state,
        files: action.payload,
      };

    case "Delete_file": {
      const updatedFiles = state.files.filter(
        (_, idx) => idx !== action.payload,
      );
      return {
        ...state,
        files: [...updatedFiles],
      };
    }

    default:
      return state;
  }
};

const PostForm = ({ user, communityImageURL }: { user: User, communityImageURL?: string }) => {
  const [title, setTitle] = useState("");
  const [titleSize, setTitleSize] = useState(0);
  const [loading, setLoading] = useState(false);

  const [payload, setPayload] = useState<Payload>({ type: "post" });
  const [filesState, dispatch] = useReducer(fileHandler, { files: [] });

  const { communityId } = useParams();
  const navigate = useNavigate();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 200) return;

    setTitle((prev) => e.target.value);
    setTitleSize((prev) => (prev = e.target.value.length));
  };

  const fetchMetadata = async (url: string) => {
    let res;
    let metaData: MetaData = {};
    try {
      res = await axios.post(`https://metaminion.vercel.app/fetch-metadata/`, {
        url,
      });
      if (res.data.isMetaDataFound) {
        metaData = res.data.metadata;
      }

      return metaData;
    } catch (error) {
      return {};
    }
  };

  const handleSubmit = async () => {
    if (!communityId)
      return Toast("error-bottom", "please go back to home", 4000);

    setLoading(true);
    const newPost: Post = {
      communityId: communityId as string,
      communityImgURL: communityImageURL || "",
      creatorId: user.uid,
      creatorDisplayName: user.email!.split("@")[0],
      type: payload.type,
      title: title,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };

    if (payload.type === "link") {
      if (!payload.link || payload.link.length === 0) {
        return Toast("info-bottom", "link not provided", 4000);
      }

      if (payload.link && !isValidURL(payload.link)) {
        return Toast("info-bottom", "link doesn't look right", 4000);
      }

      const metaData = await fetchMetadata(payload.link || "");
      newPost.link = payload.link;
      newPost.metaData = metaData;
    }

    if (payload.type === "post") {
      newPost.body = payload.body || "";
    }

    if (payload.type === "poll") {
      return Toast("info-bottom", "coming soon...", 4000);
    }

    if (payload.type === "media" && filesState.files.length === 0) {
      return Toast(
        "info-bottom",
        "please upload images/video to make post shine",
        4000,
      );
    }

    try {
      //store the post in db
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
      //increase numofposts count
      const communityDocRef = doc(firestore, "communities", communityId);
      await updateDoc(communityDocRef, {
        numberOfPosts: increment(1),
      });

      //check if files needs to be uploaded
      if (payload.type === "media") {
        await uploadFiles(postDocRef, filesState.files);
        removeTempFiles();
      }

      Toast(
        "success",
        "Your post is live! Time to watch the upvotes roll in! 🎉🎉",
        5000,
      );
      navigate(`/h/${communityId}`);
    } catch (error) {
      if (error instanceof FirebaseError) console.log(error.message);
      return Toast(
        "error-bottom",
        error instanceof FirebaseError
          ? FIREBASE_ERRORS[error.message as keyof typeof FIREBASE_ERRORS]
          : "failed to create post. Try again later 😭😞",
        4000,
      );
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (
    postDocRef: DocumentReference,
    files: FileWithUrl[],
  ) => {
    //move files from temp location to finalize location
    const gallery: FileWithUrl[] = [];

    for (const file of files) {
      const storageRef = ref(storage, `posts/${postDocRef.id}/${file.name}`);
      const blob = await (await fetch(file.url)).blob();
      // Upload the file
      const snapshot = await uploadBytes(storageRef, blob);
      // Get the download URL after the file is uploaded
      const downloadURL = await getDownloadURL(snapshot.ref);
      gallery.push({ ...file, url: downloadURL });
    }

    if (gallery.length > 0) {
      await updateDoc(postDocRef, {
        gallery: gallery,
      });
    } else
      Toast(
        "error-bottom",
        "failed to create post. Try again later 😭😞",
        4000,
      );
  };

  const removeTempFiles = async () => {
    try {
      const storageRef = ref(storage, `temp/${user.uid}`);
      const listResult = await listAll(storageRef);
      const deletePromises = listResult.items.map((itemRef) =>
        deleteObject(itemRef),
      );
      await Promise.all(deletePromises);
    } catch (error) {
      return;
    }
  };

  return (
    <div className="mb-10 mt-16 flex flex-col gap-2 px-2">
      <h1 className="mb-3 h-12 w-fit bg-gradient-to-r from-gray-300 from-30% to-rose-500 to-80% bg-clip-text font-chillax text-2xl font-medium text-transparent">
        Create a post
      </h1>

      <div className="wrapper flex h-full flex-col gap-3 rounded-xl border-[1px] border-blue-900 px-2 py-2 sm:px-3">
        <div className="no-scrollbar flex w-full gap-4 overflow-x-scroll">
          {formTabs.map((tabItem) => (
            <TabItem
              key={tabItem.title}
              item={tabItem}
              selected={tabItem.type === payload.type}
              setPayload={setPayload}
            />
          ))}
        </div>

        <div className="flex h-full flex-col gap-4 px-2 py-4 sm:py-6">
          <div className="relative mt-8 flex items-center">
            <input
              value={title}
              onChange={onChange}
              name="title"
              placeholder="title"
              className="peer relative w-full rounded-xl border-[1px] border-gray-700 bg-transparent p-4 pr-20 font-medium placeholder-transparent outline-none focus-within:border-blue-700"
              type="text"
            />
            <label
              htmlFor="title"
              className="duration-400 absolute -top-8 left-0 text-lg tracking-wider text-gray-200 transition-all ease-out peer-placeholder-shown:left-4 peer-placeholder-shown:top-auto peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-focus:-top-8 peer-focus:left-0 peer-focus:text-lg peer-focus:text-gray-200"
            >
              Title <span className="text-rose-500">*</span>
            </label>
            <span
              className={`absolute right-4 text-xs font-semibold ${titleSize > 180 ? "text-red-500/90" : "text-gray-500"}`}
            >
              {titleSize}/200
            </span>
          </div>

          {payload.type === "post" && (
            <Postbody body={payload.body || ""} setPayload={setPayload} />
          )}
          {payload.type === "media" && (
            <FileInput
              user={user}
              filesSelected={filesState.files}
              dispatch={dispatch}
            />
          )}
          {payload.type === "link" && (
            <Link link={payload.link || ""} setPayload={setPayload} />
          )}
          {payload.type === "poll" && <Poll />}
        </div>

        <div className="relative flex items-center self-end">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSubmit}
            type="submit"
            className={clsx(
              `rounded-xl px-8 py-3 text-lg font-medium transition-all duration-300`,
              {
                "pointer-events-none bg-gray-900/80 text-gray-400":
                  !title || loading,
                "bg-blue-600 text-gray-100": title || !loading,
              },
            )}
          >
            Post
          </motion.button>
          {loading && (
            <Spinner
              thickness="3px"
              className="absolute left-0 right-0 m-auto"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PostForm;
