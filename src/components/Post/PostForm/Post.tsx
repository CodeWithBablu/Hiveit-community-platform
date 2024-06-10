import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Payload } from "../../../config/postConfig";


type Props = {
  body: string;
  setBody: Dispatch<SetStateAction<Payload>>
}

const Post = ({ body, setBody }: Props) => {

  const handlechange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setBody((prev) => ({ ...prev, body: e.target.value }));
  }

  return (
    <div className=" flex flex-col gap-4">
      <textarea name="body"
        value={body}
        onChange={handlechange}
        placeholder="Body"
        className=" w-full p-4 bg-transparent rounded-xl outline-none border-[1px] border-gray-700 focus-within:border-blue-700" rows={8}>
      </textarea>
      <span className={`text-base font-dynapuff ${body.length > 800 ? 'text-rose-500' : 'text-gray-500'}`}>{body.length > 800 ? `${body.length}. Body is too long` : `${body.length}`}</span>

    </div>
  )
}

export default Post