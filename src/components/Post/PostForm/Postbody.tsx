import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Payload } from "../../../config/postConfig";

type Props = {
  body: string;
  setPayload: Dispatch<SetStateAction<Payload>>;
};

const Postbody = ({ body, setPayload }: Props) => {
  const handlechange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setPayload((prev) => ({ ...prev, body: e.target.value }));
  };

  return (
    <div className="flex flex-col gap-4">
      <textarea
        name="body"
        value={body}
        onChange={handlechange}
        placeholder="Body"
        className="w-full rounded-xl border-[1px] border-gray-700 bg-transparent p-4 outline-none focus-within:border-blue-700"
        rows={8}
      ></textarea>
      <span
        className={`font-dynapuff text-base ${body.length > 800 ? "text-rose-500" : "text-gray-500"}`}
      >
        {body.length > 800
          ? `${body.length}. Body is too long`
          : `${body.length}`}
      </span>
    </div>
  );
};

export default Postbody;
