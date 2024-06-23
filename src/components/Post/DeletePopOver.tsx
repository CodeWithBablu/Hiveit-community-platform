import { Popover, PopoverTrigger, Button, Portal, PopoverContent, PopoverHeader, PopoverCloseButton, PopoverBody, PopoverFooter, Spinner } from "@chakra-ui/react";
import { useRef } from "react";

const deleteicon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-5 w-5 sm:w-6 sm:h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);

type Props = {
  deletingPost: boolean,
  handleDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}
const DeletePopover = ({ deletingPost, handleDelete }: Props) => {
  const initRef = useRef(null)

  return (
    <Popover placement='bottom' initialFocusRef={initRef}>
      {({ isOpen, onClose }) => (
        <>
          <PopoverTrigger>
            <div onClick={(e) => { e.stopPropagation(); }} className="group flex cursor-pointer items-center">
              <div className="h-fit w-fit rounded-full p-2 transition-all duration-300 ease-in-out text-gray-500/80 hover:text-red-500 group-hover:bg-red-900/30">
                {deleteicon}
              </div>
            </div>
          </PopoverTrigger>

          <Portal>
            <PopoverContent onClick={(e) => { e.stopPropagation(); }} backgroundColor={"blackAlpha.700"} borderColor={"gray.700"} borderRadius={14} className="p-3 backdrop-blur-xl">
              <PopoverCloseButton className="text-gray-100 hover:bg-zinc-900" />
              <PopoverBody zIndex={80}>
                <h2 className="text-gray-200 z-[120] font-chillax font-medium text-base">
                  Wanna Trash this post?
                </h2>

                <div className="flex items-center mt-3 font-chillax font-semibold tracking-wide justify-end gap-3">

                  <button onClick={onClose} className="hover:bg-gray-800/60 py-2 px-4 rounded-xl text-gray-300">
                    Close
                  </button>

                  <button onClick={(e) => { handleDelete(e); onClose(); }} className="relative flex items-center justify-center bg-red-500 py-2 px-4 rounded-xl text-gray-300">
                    <span>Delete</span>
                    {deletingPost && <Spinner className="absolute" size={'md'} thickness="4px" speed="0.65s" color="gray.800" />}
                  </button>

                </div>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </>
      )}
    </Popover>
  )
}

export default DeletePopover;