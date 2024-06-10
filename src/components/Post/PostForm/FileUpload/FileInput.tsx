import { motion } from "framer-motion"
import { Action } from "./ImageUpload"
import { useRef, useState } from "react";
import { getValidFiles } from "../../../../lib/Utils";
import PreviewContainer from "./PreviewContainer";
import { RiUploadCloud2Fill } from "@remixicon/react";

type Props = {
  filesSelected: File[],
  dispatch: ({ type, payload }: Action) => void;
}

const FileInput = ({ filesSelected, dispatch }: Props) => {

  const fileInputBtn = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);


  const addFilesToState = (files: File[]) => {
    dispatch({ type: 'Add_files', payload: files });
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover')
      setIsDragActive(true);
    else if (e.type === 'dragleave')
      setIsDragActive(false);
  }

  // triggers when file is selected with click
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation();

    try {
      if (e.target.files && e.target.files[0]) {
        const files = Array.from(e.target.files);
        console.log("Files:", files);

        const validFiles = getValidFiles(files);
        addFilesToState(validFiles);
        setIsDragActive(false);
        console.log("Valid Files:", validFiles);
      }
    } catch (error) {
      // already handled
    }
  }

  // triggers when files are dropped
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const files = Array.from(e.dataTransfer.files);
      console.log("Files:", files);

      if (files && files[0]) {
        const validFiles = getValidFiles(files);
        addFilesToState(validFiles);
        setIsDragActive(false);
        console.log("Valid Files:", validFiles);
      }
    } catch (error) {
      //already handled
    }
  }


  return (

    <div>
      <div className=" relative min-h-72 font-chillax">
        <div id="drop_zone"
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`absolute flex inset-0 place-content-center rounded-2xl border-2 ${isDragActive ? ' border-dashed border-blue-600' : 'border-gray-700'}`}>
          {
            !filesSelected.length ? (
              <div className="  flex items-center gap-3">
                <h1 className=" font-medium text-lg">Drag and Drop images or videos or </h1>
                <motion.span whileTap={{ scale: 0.9 }} onClick={() => fileInputBtn.current?.click()} className="bg-blue-950/50 rounded-full p-3 cursor-pointer"><RiUploadCloud2Fill className="text-blue-500" size={30} /></motion.span>
              </div>
            ) : (
              <PreviewContainer filesSelected={filesSelected} dispatch={dispatch} />
            )
          }
        </div>

        <input
          ref={fileInputBtn}
          onChange={handleChange}
          multiple
          accept="image/jpeg, image/jpg, image/png, image/gif, video/mp4, video/mov"
          type="file"
          className="hidden"
        />
      </div>
    </div>
  )
}

export default FileInput