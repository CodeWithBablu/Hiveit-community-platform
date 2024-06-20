import { FileWithUrl } from "../components/Post/PostForm";
import { ALLOWED_FILE_TYPES, postError } from "../config/postConfig";
import { Toast, ToastType } from "./Toast";
import { Timestamp } from "firebase/firestore";
import moment from "moment";

export const isValidateFileType = (file: File) => {
  return ALLOWED_FILE_TYPES.includes(file.type);
};

export const getValidFiles = (filesSeleted: FileWithUrl[], files: File[]) => {
  let toast: { type: ToastType; message: string; duration: number } = {
    type: "info",
    message: "",
    duration: 0,
  };
  // validate files type
  const validFiles = files.filter((file) => {
    const size = file.size / (1024 * 1024);

    if (!isValidateFileType(file)) {
      toast = {
        ...toast,
        type: "info-bottom",
        message: postError["suppoted_file_type"],
        duration: 5000,
      };
      return false;
    }

    if (
      filesSeleted.length === 1 &&
      filesSeleted[0].type.includes("image") &&
      file.type.includes("video")
    ) {
      toast = {
        ...toast,
        type: "info-bottom",
        message: postError["images_are_allowed_in_gallary"],
        duration: 5000,
      };
      return false;
    }

    if (
      filesSeleted.length === 1 &&
      filesSeleted[0].type.includes("video") &&
      (file.type.includes("image") || file.type.includes("video"))
    ) {
      toast = {
        ...toast,
        type: "info-bottom",
        message: postError["remove_before_adding"],
        duration: 5000,
      };
      return false;
    }

    if (
      filesSeleted.length + files.length >= 2 &&
      file.type.includes("video")
    ) {
      toast = {
        ...toast,
        type: "info-bottom",
        message: postError["video_not_allowed_in_gallery"],
        duration: 5000,
      };
      return false;
    }

    if (size > 20) {
      toast = {
        ...toast,
        type: "error-bottom",
        message: postError["too_big"],
        duration: 5000,
      };
      return false;
    }

    return true;
  });

  if (toast.message.length)
    Toast(toast.type as ToastType, toast.message, toast.duration);

  return validFiles;
};

export function isValidURL(url: string) {
  const regex =
    /^(https?:\/\/)?(www\.)?((([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[^\s]*)?$/;

  return regex.test(url);
}

// Convert Firestore Timestamp to milliseconds
export const timestampToMillis = (timestamp: Timestamp): number => {
  return timestamp.seconds * 1000;
};
//

// Convert milliseconds to Firestore Timestamp
export const millisToTimestamp = (millis: number): Timestamp => {
  return Timestamp.fromMillis(millis);
};

export const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "... " : text;
};

type FormatType = 'date-time' | 'only-date';

export const formatPostDate = (timeFormat: FormatType, dateMillis: number): string => {
  const date = moment(dateMillis);
  let formatTime = "";

  if (timeFormat === 'date-time') {
    formatTime = date.format('MMM D, YYYY · h:mm A');
  }
  else if (timeFormat === 'only-date') {
    if (date.isSame(new Date(), "year")) {
      formatTime = date.format("MMM D"); // e.g., "June 16"
    } else {
      formatTime = date.format("MMM D, YYYY"); // e.g., "Nov 14, 2023"
    }
  }

  return formatTime
};
