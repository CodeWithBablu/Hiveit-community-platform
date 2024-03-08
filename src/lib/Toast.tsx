import toast, { ToastPosition } from "react-hot-toast";
import { RiCloseLine } from "@remixicon/react";


const tostConfig: { [key: string]: { [key: string]: number | string } } = {
  success: {
    type: 'success',
    position: 'top-center',
    textColor: 'text-green-500',
    bgPrimary: 'bg-green-500',
    bgSecondary: 'bg-success',
  },
  error: {
    type: 'error',
    position: 'top-center',
    textColor: 'text-rose-500',
    bgPrimary: 'bg-rose-500',
    bgSecondary: 'bg-error',
  },
  info: {
    type: 'info',
    position: 'top-center',
    textColor: 'text-blue-500',
    bgPrimary: 'bg-blue-500',
    bgSecondary: 'bg-info',
  },
  'info-bottom': {
    type: 'info-bottom',
    position: 'bottom-center',
    textColor: 'text-blue-500',
    bgPrimary: 'bg-blue-500',
    bgSecondary: 'bg-info',
  },
  'error-bottom': {
    type: 'error-bottom',
    position: 'bottom-center',
    textColor: 'text-rose-500',
    bgPrimary: 'bg-rose-500',
    bgSecondary: 'bg-error',
  }
}

export const Toast = (toastType: string, message: string, duration: number) => {

  const config = tostConfig[toastType];
  toast.custom(
    (t) => (
      <div className={` md:max-w-[800px] flex items-center min-h-14 ${config.textColor} rounded-sm overflow-hidden`} >
        <div className={`w-2 h-full ${config.bgPrimary}`}> </div>
        <div className={` flex flex-grow gap-3 items-center h-full p-2 ${config.bgSecondary} border-none backdrop-blur-md`}>
          <span>{message}</span>
        </div>
        <span onClick={() => toast.dismiss(t.id)} className={`hover:bg-zinc-800/80 ${config.bgSecondary} h-full p-1 cursor-pointer`}>
          <RiCloseLine size={22} />
        </span>
      </div>
    ),
    {
      duration: duration,
      position: config.position as ToastPosition,
    },

  );

  return;
}

