import React from "react";
import { Item, Payload } from "../../config/postConfig";

type Props = {
  item: Item;
  selected: boolean;
  setPayload: React.Dispatch<React.SetStateAction<Payload>>;
}

const TabItem = ({ item, selected, setPayload }: Props) => {

  const onCLick = () => {
    setPayload((prev: Payload) => ({ ...prev, type: item.type }));
  }

  return (
    <div onClick={onCLick} className=" flex flex-col flex-grow flex-shrink-0 font-chillax font-medium cursor-pointer px-2 py-2 rounded-md hover:bg-blue-950/30">
      <div className={`flex items-center text-base md:text-lg gap-2 transition-all duration-300 ease-in-out ${selected ? 'text-blue-600' : ''}`}>
        <>{item.icon}</>
        <span>{item.title}</span>
      </div>
      <hr className={`mt-2 w-[70%] border-b-2 border-blue-600 rounded-full ${selected ? 'visible' : 'hidden'}`} />
    </div>
  )
}

export default TabItem