import {
  RiAddLine,
  RiCircleLine,
  RiCloseCircleLine,
  RiCloseLine,
} from "@remixicon/react";
import { Action, FileWithUrl } from "../../PostForm";
import {
  ChangeEvent,
  Ref,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

type Props = {
  inputRef: RefObject<HTMLInputElement>;
  filesSelected: FileWithUrl[];
  dispatch: ({ type, payload }: Action) => void;
};

const Gallery = ({ inputRef, filesSelected, dispatch }: Props) => {
  const [currFileIndex, setCurrFileIndex] = useState<number>(0);

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
      scrollContainer.addEventListener("wheel", handleScroll, {
        passive: false,
      });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("wheel", handleScroll);
      }
    };
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.value.length > 180) return;
    const updatedFiles = filesSelected.map((file, index) => {
      if (index === currFileIndex)
        return { ...file, [e.target.name]: e.target.value };
      else return file;
    });
    dispatch({ type: "Update_files", payload: updatedFiles });
  };

  const handleDelete = (index: number) => {
    const updatedFiles = filesSelected.filter((_, idx) => idx !== index);

    // console.log('Updated files:', updatedFiles);

    if (currFileIndex >= index) {
      const newCurrFileIndex = currFileIndex === 0 ? 0 : currFileIndex - 1;
      setCurrFileIndex((prev) => {
        return prev === 0 ? 0 : prev - 1;
      });

    }

    dispatch({ type: "Delete_file", payload: index });
  };

  return (
    <div className="h-full w-full p-2 md:p-4">
      {filesSelected.length === 1 && filesSelected[0].type.includes("video") ? (
        <div className="relative flex h-full w-full justify-center">
          <video
            controls
            loop
            className="peer relative h-full w-full cursor-pointer object-cover"
            src={filesSelected[0].url}
          >
            can't load video
          </video>
          <span
            onClick={() => handleDelete(0)}
            className="absolute right-1 top-1 z-20 hidden cursor-pointer rounded-full bg-blackAplha700 p-1 backdrop-blur-sm hover:inline-block peer-hover:inline-block peer-focus:inline-block"
          >
            <RiCloseLine size={30} className="text-gray-500" />
          </span>
        </div>
      ) : (
        <div className="w-full">
          <div
            ref={scrollContainerRef}
            className="scroll-container no-scrollbar flex cursor-pointer items-center gap-5 overflow-x-scroll"
          >
            {filesSelected.map((file, index) => (
              <div key={index} className="relative">
                <div
                  onClick={() => setCurrFileIndex(index)}
                  className={`peer relative flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-lg ${currFileIndex === index ? "border-[1px] border-blue-600" : ""}`}
                >
                  <img
                    className={`rounded-lg object-cover ${currFileIndex === index ? "h-28 w-28" : "h-32 w-32"}`}
                    src={file.url}
                    alt=""
                  />
                </div>
                <span
                  onClick={() => handleDelete(index)}
                  className="absolute right-1 top-1 z-20 hidden cursor-pointer rounded-full bg-blackAplha700 p-1 backdrop-blur-sm hover:inline-block peer-hover:inline-block peer-focus:inline-block"
                >
                  <RiCloseLine size={30} className="text-gray-500" />
                </span>
              </div>
            ))}
            <div
              onClick={() => inputRef.current?.click()}
              className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-md border-[1px] border-dashed border-zinc-500"
            >
              <RiAddLine size={35} />
            </div>
          </div>

          <hr className="my-5 border-zinc-700" />

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="max-h-72 w-full md:min-h-60 md:w-1/2">
              <img
                className="h-full max-h-72 w-full rounded-xl object-contain"
                src={
                  filesSelected[currFileIndex]
                    ? filesSelected[currFileIndex].url
                    : ""
                }
                alt=""
              />
            </div>

            <div className="mb-4 flex h-full w-full flex-col md:mb-0 md:w-auto md:flex-grow">
              <div className="relative mt-4 flex w-full items-center justify-center font-medium">
                <input
                  name="caption"
                  onChange={onChange}
                  placeholder="Add a caption..."
                  value={filesSelected[currFileIndex].caption}
                  autoComplete="off"
                  className="relative w-[90%] rounded-xl border-[1px] border-gray-700 bg-transparent p-4 pr-20 font-medium outline-none focus-within:border-blue-700 md:w-full"
                  type="text"
                />
                {filesSelected[currFileIndex].caption && (
                  <span
                    className={`absolute right-[10%] text-xs font-semibold md:right-4 ${filesSelected[currFileIndex].caption.length > 170 ? "text-pink-500" : "text-gray-500"}`}
                  >
                    {filesSelected[currFileIndex].caption.length}/180
                  </span>
                )}
              </div>

              <div className="relative mt-4 flex w-full items-center justify-center font-medium">
                <input
                  onChange={onChange}
                  value={filesSelected[currFileIndex].link}
                  name="link"
                  autoComplete="off"
                  placeholder="Add a link..."
                  className="relative w-[90%] rounded-xl border-[1px] text-sky-500 border-gray-700 bg-transparent p-4 pr-20 font-medium outline-none focus-within:border-blue-700 md:w-full"
                  type="text"
                />
                {filesSelected[currFileIndex].link && (
                  <span
                    className={`absolute right-[10%] text-xs font-semibold md:right-4 ${filesSelected[currFileIndex].caption.length > 170 ? "text-pink-500" : "text-gray-500"}`}
                  >
                    {filesSelected[currFileIndex].link.length}/180
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
