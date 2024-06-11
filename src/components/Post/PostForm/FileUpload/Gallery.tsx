import { RiAddLine, RiCircleLine, RiCloseCircleLine, RiCloseLine } from "@remixicon/react";
import { Action, FileWithUrl } from "../../PostForm";
import { ChangeEvent, useEffect, useRef, useState } from "react";

type Props = {
  filesSelected: FileWithUrl[],
  dispatch: ({ type, payload }: Action) => void;
}

const Gallery = ({ filesSelected, dispatch }: Props) => {

  const [currFileIndex, setCurrFileIndex] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (scrollContainerRef.current) {
        // Prevent default vertical scrolling
        e.preventDefault();
        // Scroll horizontally based on deltaY value
        scrollContainerRef.current.scrollLeft += e.deltaY;
        scrollContainerRef.current.scrollLeft += e.deltaX;
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('wheel', handleScroll, { passive: false });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('wheel', handleScroll);
      }
    };
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    dispatch({ type: '' })
  }

  console.log(filesSelected);
  return (
    <div className=" w-full h-full p-2 md:p-4">
      {
        filesSelected.length === 1 && filesSelected[0].type.includes('video') ? (
          <div className="flex justify-center w-full h-full bg-blue-950">
            <video controls className="w-full h-full object-cover" src={filesSelected[0].url}>
              can't load video
            </video>
          </div>
        ) : (

          <div className=" w-full">

            <div ref={scrollContainerRef} className=" flex items-center gap-5 scroll-container overflow-x-scroll no-scrollbar cursor-pointer">
              {
                filesSelected.map((file, index) => (
                  <div onClick={() => setCurrFileIndex(index)} key={index} className={`relative flex justify-center items-center flex-shrink-0  w-32 h-32 rounded-lg ${currFileIndex === index ? ' border-[1px] border-blue-600' : ''}`}>
                    <img className={`peer rounded-lg object-cover  ${currFileIndex === index ? 'w-28 h-28' : 'w-32 h-32'}`} src={file.url} alt="" />
                    <span className="absolute hidden hover:inline-block peer-hover:inline-block peer-focus:inline-block top-1 right-1 rounded-full bg-blackAplha700 backdrop-blur-sm p-1 cursor-pointer"><RiCloseLine size={30} className=" text-gray-500" /></span>
                  </div>
                ))
              }
              <div className=" flex flex-shrink-0 justify-center items-center w-28 h-28 rounded-md border-[1px] border-dashed border-zinc-500">
                <RiAddLine size={35} />
              </div>
            </div>

            <hr className="border-gray-600 my-5" />

            <div className="flex flex-col md:flex-row gap-3">
              <div className="w-full min-h-60 max-h-72 md:w-1/2">
                <img className="rounded-xl w-full h-full object-contain" src={filesSelected[currFileIndex].url} alt="" />
              </div>

              <div className="flex flex-col w-full h-full md:flex-grow md:w-auto">
                <div className="relative flex items-center w-full mt-4 font-medium">
                  <input onChange={onChange} name="caption" placeholder="Add a caption..." value={filesSelected[currFileIndex].caption} className=" relative p-4 w-full pr-20 font-medium bg-transparent rounded-xl outline-none border-[1px] border-gray-700 focus-within:border-blue-700" type="text" />
                  {filesSelected[currFileIndex].caption && <span className={`absolute right-4 text-xs font-semibold ${filesSelected[currFileIndex].caption.length > 180 ? 'text-red-500/90' : 'text-gray-500'}`}>{filesSelected[currFileIndex].caption.length}/180</span>}
                </div>

                <div className="relative flex items-center w-full mt-4 font-medium">
                  <input value={filesSelected[currFileIndex].link} onChange={onChange} name="link" placeholder="Add a link..." className=" relative p-4 w-full pr-20 font-medium bg-transparent rounded-xl outline-none border-[1px] border-gray-700 focus-within:border-blue-700" type="text" />
                </div>
              </div>
            </div>

          </div>
        )
      }

    </div>
  )
}

export default Gallery