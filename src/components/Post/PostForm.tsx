import { motion } from "framer-motion"
import { Spinner } from "@chakra-ui/react";

import TabItem from "./TabItem";
import { ChangeEvent, useReducer, useState } from "react";
import Post from "./PostForm/Post";
import { Payload, formTabs } from "../../config/postConfig";
import FileInput from "./PostForm/FileUpload/FileInput";
import { User } from "firebase/auth";
import clsx from "clsx";

export type FileWithUrl = {
  name: string;
  type: string;
  url: string;
  caption: string;
  link: string;
}


export type State = {
  files: FileWithUrl[]
};

export type Action =
  { type: 'Add_files', payload: FileWithUrl[] } |
  { type: 'Update_files'; payload: FileWithUrl[] } |
  { type: 'Delete_file'; payload: number };



const fileHandler = (state: State, action: Action) => {
  switch (action.type) {
    case 'Add_files':
      return {
        ...state,
        files: [...state.files, ...action.payload],
      };

    case 'Update_files':
      return {
        ...state,
        files: action.payload,
      };

    case 'Delete_file': {
      const updatedFiles = state.files.filter((_, idx) => idx !== action.payload);
      return {
        ...state,
        files: [...updatedFiles],
      };
    }

    default:
      return state;
  }
};

const PostForm = ({ user }: { user: User }) => {

  const [title, setTitle] = useState("");
  const [titleSize, setTitleSize] = useState(0);
  const [loading, setLoading] = useState(false);

  const [payload, setPayload] = useState<Payload>({ type: 'post' });
  const [filesState, dispatch] = useReducer(fileHandler, { files: [] });


  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 200)
      return;

    setTitle((prev) => (e.target.value));
    setTitleSize((prev) => prev = e.target.value.length);
  }


  return (
    <div className="flex flex-col gap-2 px-2 mb-10">
      <h1 className="text-2xl mb-3 w-fit h-full font-chillax font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-300 from-30% to-80% to-rose-500">Create a post</h1>

      <div className=" flex flex-col gap-3 h-full wrapper py-2 px-2 sm:px-3 rounded-xl border-[1px] border-blue-900/60">
        <div className=" flex w-full gap-4 overflow-x-scroll no-scrollbar">
          {
            formTabs.map((tabItem) =>
              <TabItem key={tabItem.title}
                item={tabItem}
                selected={tabItem.type === payload.type}
                setPayload={setPayload} />
            )
          }
        </div>

        <div className="flex flex-col px-2 py-4 sm:py-6 gap-4 h-full">

          <div className="relative flex items-center mt-8">
            <input value={title} onChange={onChange} name="title" placeholder="title" className="peer relative p-4 w-full pr-20 font-medium bg-transparent placeholder-transparent rounded-xl outline-none border-[1px] border-gray-700 focus-within:border-blue-700" type="text" />
            <label htmlFor="title" className="absolute text-lg left-0 -top-8 text-gray-200 transition-all duration-400 ease-out peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-placeholder-shown:left-4 peer-placeholder-shown:top-auto peer-focus:left-0 peer-focus:-top-8 peer-focus:text-gray-200 tracking-wider peer-focus:text-lg">Title <span className="text-rose-500">*</span></label>
            <span className={`absolute right-4 text-xs font-semibold ${titleSize > 180 ? 'text-red-500/90' : 'text-gray-500'}`}>{titleSize}/200</span>
          </div>

          {payload.type === 'post' && <Post body={payload.body || ""} setBody={setPayload} />}
          {payload.type === 'media' && <FileInput user={user} filesSelected={filesState.files} dispatch={dispatch} />}
        </div>

        <div className="relative flex items-center self-end">
          <motion.button whileTap={{ scale: 0.9 }} type="submit" className={clsx(
            `px-8 py-3 font-medium text-lg rounded-xl text-gray-100`,
            {
              'opacity-30 pointer-events-none': !title || loading,
              'opacity-100 bg-blue-600': title || !loading
            }
          )}>Post</motion.button>
          {loading && <Spinner thickness='3px' className="absolute left-0 right-0 m-auto" />}
        </div>
      </div>

    </div>
  )
}

export default PostForm