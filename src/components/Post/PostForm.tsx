import { motion } from "framer-motion"
import { Spinner } from "@chakra-ui/react";

import TabItem from "./TabItem";
import { ChangeEvent, useState } from "react";
import Post from "./PostForm/Post";
import ImageUpload from "./PostForm/FileUpload/ImageUpload";
import { Payload, formTabs } from "../../config/postConfig";

const PostForm = () => {

  const [title, setTitle] = useState("");
  const [titleSize, setTitleSize] = useState(0);
  const [loading, setLoading] = useState(false);

  const [payload, setPayload] = useState<Payload>({ type: 'post' });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 80)
      return;

    setTitle((prev) => (e.target.value));
    setTitleSize((prev) => prev = e.target.value.length);
  }


  return (
    <div className="flex flex-col gap-2 px-2">
      <h1 className="text-2xl w-fit font-chillax font-medium font-noto bg-clip-text text-transparent bg-gradient-to-r from-gray-300 from-30% to-80% to-rose-500">Create a post</h1>

      <div className=" flex flex-col gap-3 wrapper py-2 px-2 sm:px-3 rounded-xl border-[1px] border-blue-950/60">
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

        <div className="flex flex-col px-2 py-4 sm:py-6 gap-4">

          <div className="relative flex items-center justify-end">
            <input value={title} onChange={onChange} name="title" placeholder="Title" className=" p-4 w-full pr-20 font-medium bg-transparent rounded-xl outline-none border-[1px] border-gray-700 focus-within:border-blue-700" type="text" />
            <span className={`absolute right-4 text-xs font-semibold ${titleSize > 75 ? 'text-red-500/90' : 'text-gray-500'}`}>{titleSize}/80</span>
          </div>

          {payload.type === 'post' && <Post body={payload.body || ""} setBody={setPayload} />}
          {payload.type === 'media' && <ImageUpload />}
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