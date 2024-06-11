import { RiLink, RiImageCircleLine, RiReceiptLine, RiMenu4Fill } from "@remixicon/react"

export const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'video/mp4', 'video/mov', 'video/quicktime'];

export type Item = {
  title: string;
  icon: unknown;
  type: "post" | "media" | "link" | "poll";
}

// export type PostForm = {
//   title: string;
//   postType: "post" | "image_video" | "link" | "poll";
//   body?: string;
//   image?: [string];
//   video?: string;
//   poll?: [string];
// }


export interface Payload {
  type: "post" | "media" | "link" | "poll";
  body?: string;
  gallery?: string[];
  link?: string;
}

export const formTabs: Item[] = [
  {
    title: 'Post',
    type: 'post',
    icon: <RiReceiptLine size={22} />,
  },
  {
    title: 'Images & Video',
    type: 'media',
    icon: <RiImageCircleLine size={22} />,
  },
  {
    title: 'Link',
    type: 'link',
    icon: <RiLink size={22} />,
  },
  {
    title: 'Poll',
    type: 'poll',
    icon: <RiMenu4Fill size={22} />,
  }
];


export const postError = {
  'video_not_allowed_in_gallery': "Videos aren’t supported within galleries...yet 🥶️",
  'suppoted_file_type': "Sorry, we accept only images (.png, .jpeg, .gif) and videos (.mp4, .mov)",
  'too_big': "File Exceeds size limit (15 MB) 🥶️",
  'max_upload_limit_reached': "You can upload a maximum of 5 files at a time. 🥶️",
  'remove_before_adding': "Remove video first 🥶️",
  'images_are_allowed_in_gallary': "Only images are supported in gallary 🥶️",
}