import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Payload } from "../../../config";

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
        rows={8}
        className="w-full rounded-xl border-[1px] no-scrollbar border-dimGray text-sm sm:text-base bg-transparent p-4 outline-none focus-within:border-blue-700"
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
