import { motion } from "framer-motion"
import { Action } from "./ImageUpload"
import { useRef, useState } from "react";
import { Toast, validateFileType } from "../../../lib/Utils";
import { ALLOWED_FILE_TYPES, postError } from "../../../config/postConfig";

type Props = {
  filesSelected: File[],
  dispatch: ({ type, payload }: Action) => void;
}

const FileInput = ({ filesSelected, dispatch }: Props) => {

  const fileInputBtn = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover')
      setIsDragActive(true);
    else if (e.type === 'dragleave')
      setIsDragActive(false);
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    console.log(files);

    if (files && files[0]) {
      // validate files type 
      const validFiles = files.filter((file) => {
        if (files.length >= 2 && file.type.includes('video')) {
          console.log("Video");
          Toast('error_bottom', postError['video_not_allowed_in_gallery'], 4000);
          return false;
        }
        return validateFileType(file);
      });

      // Shows toast message
      Toast('error_bottom', postError['suppoted_file_type'], 3000);
    }
  }


  return (

    <div>
      {
        filesSelected.length == 0 ? (
          <div className=" relative min-h-80 ">
            <div id="drop_zone"
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`absolute inset-0 flex place-content-center rounded-xl border-2 border-dashed ${isDragActive ? ' border-indigo-300' : 'border-zinc-500'}`}>
              <div className="  flex items-center gap-3">
                <h1 className=" font-medium">Drag and drop images or </h1>
                <motion.button onClick={() => fileInputBtn.current?.click()} whileTap={{ scale: 0.9 }} className=" text-gray-800 font-semibold bg-gradient-to-tr hover:bg-gradient-to-bl from-gray-200 from-30% to-cyan-600 py-1 px-3 rounded-2xl">Upload</motion.button>
              </div>
            </div>

            <input
              ref={fileInputBtn}
              multiple
              accept="image/jpeg, image/jpg, image/png, .gif, .mp4, .mov"
              type="file"
              className="hidden"
            />
          </div>

        ) : (
          <>
          </>
        )
      }
    </div>
  )
}

export default FileInput