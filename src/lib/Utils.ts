import { ALLOWED_FILE_TYPES, postError } from "../config/postConfig";
import { Toast } from "./Toast";

export const validateFileType = (file: File) => {
  return ALLOWED_FILE_TYPES.includes(file.type);
}


export const getValidFiles = (files: File[]) => {
  let toast = { type: '', message: '', duration: 0, }
  // validate files type 
  const validFiles = files.filter((file) => {

    if (files.length === 1 && !validateFileType(file)) {
      toast = {
        ...toast,
        type: 'info-bottom', message: postError['suppoted_file_type'], duration: 30000,
      }
      return false;
    }
    else if (files.length >= 2 && file.type.includes('video')) {
      toast = {
        ...toast,
        type: 'error-bottom', message: postError['video_not_allowed_in_gallery'], duration: 30000,
      }
      return false;
    }

    return true;
  });

  if (toast.message.length)
    Toast(toast.type, toast.message, toast.duration);

  return validFiles;

}