import { Item } from "./PostForm"

type Props = {
  item: Item;
  selected: boolean;
  setSelected: (state: string) => void;
  setPostType: () => void;
}

const TabItem = ({ item, selected, setSelected, setPostType }: Props) => {

  const onCLick = () => {
    setSelected(item.title);
    setPostType();
  }

  return (
    <div onClick={onCLick} className=" flex flex-col flex-grow flex-shrink-0 font-medium cursor-pointer px-2 py-2 rounded-md hover:bg-blackAplha500">
      <div className={`flex items-center text-xs md:text-[14px] gap-2 ${selected ? 'text-indigo-300' : ''}`}>
        <>{item.icon}</>
        <span>{item.title}</span>
      </div>
      <hr className={`mt-1 w-[70%] border-b-2 border-indigo-200 rounded-full ${selected ? 'visible' : 'hidden'}`} />
    </div>
  )
}

export default TabItem