// import { useReducer, useState } from "react"
// import FileInput from "./FileInput";

// // type Props = {}

// export type FileWithUrl = {
//   name: string;
//   getUrl: string;
//   size: number;
//   error?: boolean | undefined;
// }

// export type State = FileWithUrl[];

// export type Action = {
//   type: 'Add_files',
//   payload: FileWithUrl[];
// }

// const fileHandler = (state: State, action: Action) => {
//   switch (action.type) {
//     case 'Add_files': {
//       return [...state, ...action.payload];
//     }
//   }
// }

// const ImageUpload = () => {

//   const [filesSelected, dispatch] = useReducer(fileHandler, []);

//   return (
//     <div>
//       <FileInput filesSelected={filesSelected} dispatch={dispatch} />
//     </div>
//   )
// }

// export default ImageUpload
