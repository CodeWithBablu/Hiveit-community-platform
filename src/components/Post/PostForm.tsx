import { motion } from "framer-motion"
import { Spinner } from "@chakra-ui/react";

import TabItem from "./TabItem";
import { ChangeEvent, useReducer, useState } from "react";
import Post from "./PostForm/Post";
import { Payload, formTabs } from "../../config/postConfig";
import FileInput from "./PostForm/FileUpload/FileInput";
import { User } from "firebase/auth";

export type FileWithUrl = {
  name: string;
  type: string;
  url: string;
  caption: string;
  link: string;
}


export type State = FileWithUrl[];

export type Action = {
  type: 'Add_files',
  payload: FileWithUrl[];
}


const fileHandler = (state: State, action: Action) => {
  switch (action.type) {
    case 'Add_files': {
      return [...state, ...action.payload];
    }
  }
}

const PostForm = ({ user }: { user: User }) => {

  const [title, setTitle] = useState("");
  const [titleSize, setTitleSize] = useState(0);
  const [loading, setLoading] = useState(false);

  const [payload, setPayload] = useState<Payload>({ type: 'post' });
  const [filesSelected, dispatch] = useReducer(fileHandler, []);


  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 200)
      return;

    setTitle((prev) => (e.target.value));
    setTitleSize((prev) => prev = e.target.value.length);
  }


  return (
    <div className="flex flex-col gap-2 px-2 mb-10">
      <h1 className="text-2xl mb-3 w-fit h-full font-chillax font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-300 from-30% to-80% to-rose-500">Create a post</h1>

      <div className=" flex flex-col gap-3 h-full wrapper py-2 px-2 sm:px-3 rounded-xl border-[1px] border-blue-600/60">
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
          {payload.type === 'media' && <FileInput user={user} filesSelected={filesSelected} dispatch={dispatch} />}
        </div>

        <div className="relative flex items-center self-end">
          <motion.button whileTap={{ scale: 0.9 }} type="submit" className={`px-8 py-3 font-medium text-lg rounded-xl bg-blue-600 text-gray-100 ${loading ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>Post</motion.button>
          {loading && <Spinner thickness='3px' className="absolute left-0 right-0 m-auto" />}
        </div>
      </div>

    </div>
  )
}

export default PostForm