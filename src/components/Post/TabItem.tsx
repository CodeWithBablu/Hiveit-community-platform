import React from "react";
import { Item, Payload } from "../../config/postConfig";

type Props = {
  item: Item;
  selected: boolean;
  setPayload: React.Dispatch<React.SetStateAction<Payload>>;
};

const TabItem = ({ item, selected, setPayload }: Props) => {
  const onCLick = () => {
    setPayload((prev: Payload) => ({ ...prev, type: item.type }));
  };

  return (
    <div
      onClick={onCLick}
      className="flex flex-shrink-0 flex-grow cursor-pointer flex-col rounded-md px-2 py-2 font-chillax font-medium hover:bg-blue-950/30"
    >
      <div
        className={`flex items-center gap-2 text-base transition-all duration-300 ease-in-out md:text-lg ${selected ? "text-blue-600" : ""}`}
      >
        <>{item.icon}</>
        <span>{item.title}</span>
      </div>
      <hr
        className={`mt-2 w-[70%] rounded-full border-b-2 border-blue-600 ${selected ? "visible" : "hidden"}`}
      />
    </div>
  );
};

export default TabItem;
