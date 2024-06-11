import toast, { ToastPosition } from "react-hot-toast";
import { RiCloseCircleLine, RiInformationLine, RiCheckFill, RiCloseLine } from "@remixicon/react";

type ToastConfig = {
  type: ToastType;
  position: string;
  textColor: string;
  Icon: unknown,
  bgPrimary: string;
}

export type ToastType = "success" | "error" | "info" | "info-bottom" | "error-bottom";


const tostConfig = {
  'success': {
    type: 'success',
    Icon: <RiCheckFill className="w-7 h-7 font-semibold text-green-500" />,
    position: 'top-center',
    textColor: 'text-green-500',
    bgPrimary: 'bg-success',
  },
  'error': {
    type: 'error',
    Icon: <RiCloseCircleLine className="w-7 h-7 font-semibold text-rose-500" />,
    position: 'top-center',
    textColor: 'text-rose-500',
    bgPrimary: 'bg-error',
  },
  'error-bottom': {
    type: 'error-bottom',
    Icon: <RiCloseCircleLine className="w-7 h-7 font-semibold text-rose-500" />,
    position: 'bottom-right',
    textColor: 'text-rose-500',
    bgPrimary: 'bg-error',
  },
  'info': {
    type: 'info',
    Icon: <RiInformationLine className="w-7 h-7 font-semibold text-blue-500" />,
    position: 'top-center',
    textColor: 'text-blue-500',
    bgPrimary: 'bg-info',
  },
  'info-bottom': {
    type: 'info-bottom',
    Icon: <RiInformationLine className="w-7 h-7 font-semibold text-blue-500" />,
    position: 'bottom-right',
    textColor: 'text-blue-500',
    bgPrimary: 'bg-info',
  },
}



export const Toast = (toastType: ToastType, message: string, duration: number) => {
  console.log(toastType);
  const config = tostConfig[toastType] as ToastConfig;
  console.log(config);
  toast.custom(
    (t) => (
      <div className={`flex items-center justify-between min-w-[90%] sm:min-w-[400px] max-w-[90%] md:max-w-[600px] ${config.bgPrimary} min-h-14 p-3 rounded-md overflow-hidden backdrop-blur-xl`}>
        <div className="h-full w-fit pr-3">
          <>{config.Icon}</>
        </div>

        <div className="flex flex-1 flex-col text-lg">
          <h3 className={`${config.textColor} font-poppins font-medium capitalize`}>{config.type.split('-')[0]}</h3>
          <h4 className="text-gray-50 ">{message}</h4>
        </div>

        <span className="h-full w-fit">
          <RiCloseLine onClick={() => toast.dismiss(t.id)} className={`w-8 h-8 cursor-pointer rounded-full ${config.textColor} hover:bg-zinc-800/20`} />
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

