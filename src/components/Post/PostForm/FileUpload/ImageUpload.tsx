import { useReducer, useState } from "react"
import FileInput from "./FileInput";

// type Props = {}


// export type FileWithUrl = {
//   getUrl: string;
//   size: number;
//   error?: boolean | undefined;
// }

const addFilesToInput = () => ({
  type: 'Add_files' as const,
  payload: [] as File[],
})
// type Action = ReturnType<typeof addFilesToInput>;

export type State = File[];

export type Action = {
  type: 'Add_files',
  payload: File[];
}


const fileHandler = (state: State, action: Action) => {
  switch (action.type) {
    case 'Add_files': {
      return [...state, ...action.payload];
    }
  }
}

const ImageUpload = () => {

  const [filesSelected, dispatch] = useReducer(fileHandler, []);

  return (
    <div>
      <FileInput filesSelected={filesSelected} dispatch={dispatch} />
    </div>
  )
}

export default ImageUpload