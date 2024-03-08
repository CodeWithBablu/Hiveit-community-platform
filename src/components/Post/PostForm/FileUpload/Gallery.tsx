import { useEffect, useState } from "react";
import { Action } from "./ImageUpload";
import { RiAddLine } from "@remixicon/react";

type Props = {
  filesSelected: File[],
  dispatch: ({ type, payload }: Action) => void;
}

const Gallery = ({ filesSelected, dispatch }: Props) => {

  const [filesWithURL, setFilesWithURL] = useState<{ id: number, url: string }[] | []>([]);

  useEffect(() => {
    generatePreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesSelected])

  function generatePreview() {
    let id = 0;
    const newFilesWithURL = filesSelected.map(file => {
      return {
        id: id++,
        url: URL.createObjectURL(file),
      }
    });
    console.log(newFilesWithURL);
    setFilesWithURL(newFilesWithURL);
  }

  return (
    <div className=" w-full p-2 md:p-3">
      <div className=" flex items-center gap-3 overflow-x-scroll no-scrollbar cursor-pointer">
        {
          filesWithURL.map((file) => (
            <div className=" flex-shrink-0 w-28 h-28 rounded-md">
              <img className=" rounded-md w-full h-full object-cover" src={file.url} alt="" />
            </div>
          ))
        }
        <div className=" flex flex-shrink-0 justify-center items-center  w-28 h-28 rounded-md border-[1px] border-dashed border-zinc-500">
          <RiAddLine size={35} />
        </div>
      </div>
    </div>
  )
}

export default Gallery