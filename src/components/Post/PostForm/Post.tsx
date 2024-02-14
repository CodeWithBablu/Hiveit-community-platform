import { Spinner } from "@chakra-ui/react";
import { motion } from "framer-motion"

type Props = {
  // loading: boolean;
}

const Post = () => {

  const loading = false;

  return (
    <div className=" flex flex-col gap-4">
      <textarea name="body"
        placeholder="Text (optional)"
        className=" w-full p-2 bg-zinc-800 rounded-md outline-none border-[1px] border-zinc-600 focus-within:border-gray-400" rows={5}>
      </textarea>
      <div className="relative flex items-center self-end">
        <motion.button whileTap={{ scale: 0.9 }} type="submit" className={` w-24 text-white py-1 font-semibold rounded-md bg-indigo-500 ${loading ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>Post</motion.button>
        {loading && <Spinner thickness='3px' className="absolute left-0 right-0 m-auto" />}
      </div>
    </div>
  )
}

export default Post