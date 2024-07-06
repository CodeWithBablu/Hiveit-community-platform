import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { getValidFiles } from "../../../../lib/Utils";
import { RiUploadCloud2Fill } from "@remixicon/react";
import { Action, FileWithUrl } from "../../PostForm";
import Gallery from "./Gallery";
import { storage } from "../../../../firebase/clientApp";
import { Toast } from "../../../../lib/Toast";
import { postError } from "../../../../config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Progress, Spinner } from "@chakra-ui/react";
import { User } from "firebase/auth";

type Props = {
  user: User;
  filesSelected: FileWithUrl[];
  dispatch: ({ type, payload }: Action) => void;
};

const FileInput = ({ user, filesSelected, dispatch }: Props) => {
  const fileInputBtn = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const uploadTempFiles = async (files: File[]) => {
    const tempFiles: FileWithUrl[] = [];
    setLoading(true);
    setProgress(0);

    if (filesSelected.length + files.length > 5) {
      Toast("info-bottom", postError["max_upload_limit_reached"], 4000);
      files = files.slice(0, 5 - filesSelected.length);
    }

    let totalFiles = files.length;
    let totalBytes = files.reduce((acc, file) => acc + file.size, 0);
    let bytesTransferred = 0;
    const prevBytesTransferred: { [key: string]: number } = {};

    for (const file of files) {
      const tempFileRef = ref(storage, `temp/${user.uid}/${file.name}`);
      const uploadTask = uploadBytesResumable(tempFileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          bytesTransferred +=
            snapshot.bytesTransferred - (prevBytesTransferred[file.name] || 0);
          const totalProgress = (bytesTransferred / totalBytes) * 100;
          prevBytesTransferred[file.name] = snapshot.bytesTransferred;
          setProgress(totalProgress);
        },
        (error) => {
          bytesTransferred -= prevBytesTransferred[file.name];
          totalBytes -= file.size;
          totalFiles--;
          console.error("upload failed: ", error);
        },
        async () => {
          const tempURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(tempURL);
          tempFiles.push({
            name: file.name,
            type: file.type,
            url: tempURL,
            caption: "",
            link: "",
          });
          if (tempFiles.length === totalFiles) {
            setLoading(false);
            addFilesToState(tempFiles);
            console.log("All files uploaded to temporary: ", tempFiles);
          }
        },
      );
    }
  };

  const addFilesToState = (files: FileWithUrl[]) => {
    dispatch({ type: "Add_files", payload: files });
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragActive(true);
    else if (e.type === "dragleave") setIsDragActive(false);
  };

  // triggers when file is selected with click
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (e.target.files && e.target.files[0]) {
        const files = Array.from(e.target.files);
        console.log("Files:", files);

        const validFiles = getValidFiles(filesSelected, files);
        await uploadTempFiles(validFiles);
        setIsDragActive(false);
        console.log("Valid Files:", validFiles);
      }
    } catch (error) {
      // already handled
    }
  };

  // triggers when files are dropped
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const files = Array.from(e.dataTransfer.files);

      if (files && files[0]) {
        const validFiles = getValidFiles(filesSelected, files);
        await uploadTempFiles(validFiles);
        setIsDragActive(false);
      }
    } catch (error) {
      //already handled
    }
  };

  return (
    <div className="relative min-h-36 sm:min-h-72 rounded-2xl font-chillax">
      <div
        id="drop_zone"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative flex flex-col place-content-center rounded-2xl border-2 ${isDragActive ? "border-dashed border-blue-600" : "border-dimGray"}`}
      >
        {!filesSelected.length ? (
          <div className="flex h-full min-h-52 sm:min-h-72 flex-col items-center justify-center gap-3">
            <h1 className="text-base font-medium sm:text-lg">
              Drag and Drop images or videos or{" "}
            </h1>
            <motion.span
              whileTap={{ scale: 0.9 }}
              onClick={() => fileInputBtn.current?.click()}
              className="cursor-pointer rounded-full bg-blue-950/50 p-3"
            >
              <RiUploadCloud2Fill className="text-blue-500" size={30} />
            </motion.span>
          </div>
        ) : (
          <Gallery
            inputRef={fileInputBtn}
            filesSelected={filesSelected}
            dispatch={dispatch}
          />
        )}
      </div>

      {loading && progress > 0 && (
        <div className="absolute inset-2 z-20 flex flex-col items-center justify-center gap-5 rounded-xl bg-blackAplha500 backdrop-blur-lg">
          <Spinner />
          <Progress
            aria-valuenow={progress}
            size="sm"
            className="z-30 mb-10 w-[50%] rounded-full"
            colorScheme="blue"
            backgroundColor={"whiteAlpha.200"}
            value={progress}
          />
        </div>
      )}

      <input
        ref={fileInputBtn}
        onChange={handleChange}
        multiple
        accept="image/jpeg, image/jpg, image/png, image/gif, video/mp4, video/mov"
        type="file"
        className="hidden"
      />
    </div>
  );
};

export default FileInput;
