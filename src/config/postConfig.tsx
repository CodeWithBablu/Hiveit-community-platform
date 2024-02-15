import { RiFileList3Line, RiLink, RiImageCircleLine, RiChatPollLine } from "@remixicon/react"


export const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', '.gif', 'video/mp4', 'video/mov'];

export type Item = {
  title: string;
  icon: unknown;
  type: "post" | "image_video" | "link" | "poll";
}

export type PostForm = {
  title: string;
  postType: "post" | "image_video" | "link" | "poll";
  body?: string;
  image?: [string];
  video?: string;
  poll?: [string];
}

export const formTabs: Item[] = [
  {
    title: 'Post',
    type: 'post',
    icon: <RiFileList3Line size={22} />,
  },
  {
    title: 'Images & Video',
    type: 'image_video',
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
    icon: <RiChatPollLine size={22} />,
  }
];


export const postError = {
  'video_not_allowed_in_gallery': "Videos aren’t supported within galleries...yet 🥶️",
  'suppoted_file_type': "Sorry, we accept only images (.png, .jpeg, .gif) and videos (.mp4, .mov)",
  'remove_video_from_gallery': "Sorry video aren't supported in gallery yet",
}