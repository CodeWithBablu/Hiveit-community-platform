import { Payload } from "@/config/postConfig";
import { isValidURL } from "@/lib/Utils";
import clsx from "clsx";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

type Props = {
  link: string;
  setPayload: Dispatch<SetStateAction<Payload>>;
};

const Link = ({ link, setPayload }: Props) => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPayload((prev) => ({ ...prev, link: e.target.value }));
  };

  return (
    <div className="flex w-full flex-col items-center gap-5 py-5">
      <div className="relative mt-4 flex w-full flex-col justify-center gap-3 font-medium">
        <input
          onChange={onChange}
          value={link}
          name="link"
          autoComplete="off"
          placeholder="Add a link..."
          className="relative w-[90%] rounded-xl border-[1px] border-gray-700 bg-transparent p-4 pr-20 font-medium outline-none focus-within:border-blue-700 md:w-full"
          type="text"
        />

        <span
          className={clsx(
            "p-4 pt-2 text-[14px] font-medium tracking-wider text-rose-500 md:right-4",
            {
              "hidden text-transparent":
                (link.length <= 200 && isValidURL(link)) || link.length == 0,
              "inline-block":
                (link.length > 200 || !isValidURL(link)) && link.length !== 0,
            },
          )}
        >
          link doesn't look right
        </span>
      </div>
    </div>
  );
};

export default Link;
