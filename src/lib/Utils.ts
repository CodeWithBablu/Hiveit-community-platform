import toast from "react-hot-toast";
import { ALLOWED_FILE_TYPES } from "../config/postConfig"

export const validateFileType = (file: File) => {
  return ALLOWED_FILE_TYPES.includes(file.type);
}


const Style = {
  borderRadius: '10px',
  fontSize: 14,
  fontWeight: 800,
  'max-width': '800px',
  backgroundColor: '#e5e7eb',
}

export const Toast = (toastType: string, message: string, duration: number) => {
  switch (toastType) {
    case 'succes': {
      toast.error(message, {
        duration: 3000,
        style: Style,
      });
    }
      break;
    case 'error': {
      toast.error(message, {
        duration: 3000,
        style: Style,
      });
    }
      break;
    case 'error_bottom': {
      toast.error(message, {
        position: "bottom-center",
        duration: duration,
        style: Style
      })
    }
      break;
    default:
      console.log('Invalid Toast Message Type');
  }
}