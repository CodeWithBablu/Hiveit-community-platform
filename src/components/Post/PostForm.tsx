import { RiFileList3Line, RiLink, RiImageCircleLine, RiChatPollLine } from "@remixicon/react"
import TabItem from "./TabItem";
import { ChangeEvent, useState } from "react";
import Post from "./PostForm/Post";
import ImageUpload from "./PostForm/ImageUpload";
import { formTabs, PostForm } from "../../config/postConfig";


const PostForm = () => {

  const [selected, setSelected] = useState(formTabs[0].title);
  const [post, setPost] = useState<PostForm>({
    title: "",
    postType: "post",
  });

  const [titleSize, setTitleSize] = useState(0);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {

    if (event.target.value.length > 80)
      return;

    setPost((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));

    setTitleSize((prev) => prev = event.target.value.length);
  }


  return (
    <div className="flex flex-col gap-2 px-2">
      <h1 className="text-xl w-fit font-semibold font-noto bg-clip-text text-transparent bg-gradient-to-r from-gray-300 from-30% to-80% to-rose-500">Create a post</h1>

      <div className=" flex flex-col gap-3 wrapper py-2 px-2 sm:px-6 rounded-md bg-zinc-900">
        <div className=" flex w-full gap-4 overflow-x-scroll no-scrollbar">
          {
            formTabs.map((tabItem) =>
              <TabItem key={tabItem.title}
                item={tabItem}
                selected={tabItem.title === selected}
                setSelected={setSelected}
                setPostType={() => setPost((prev) => ({ ...prev, postType: tabItem.type }))} />
            )
          }
        </div>
        <div className="flex flex-col px-2 gap-4">

          <div className="relative flex items-center justify-end">
            <input value={post.title} onChange={onChange} name="title" placeholder="Title" className=" p-2 w-full pr-20 bg-zinc-800 rounded-md outline-none border-[1px] border-zinc-600 focus-within:border-gray-400 " type="text" />
            <span className={`absolute right-4 text-xs font-semibold ${titleSize > 75 ? 'text-rose-500' : 'text-gray-400'}`}>{titleSize}/80</span>
          </div>

          {post.postType === 'post' && <Post />}
          {post.postType === 'image_video' && <ImageUpload />}
        </div>
      </div>

    </div>
  )
}

export default PostForm