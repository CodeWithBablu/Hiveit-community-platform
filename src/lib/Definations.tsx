import { Timestamp } from "firebase/firestore";

export type FileCategoryType = "community_image" | "community_bgImage" | "user_image";


export type Usertype = {
  id: string;
  uid: string;
  displayName: 'Noob Cobra',
  email: 'thefakeme123456@gmail.com',
  createdAt: Timestamp,
  providerData: [
    {
      providerId: 'google.com'
      photoURL: string | null;
      email: string,
      phoneNumber: number | null,
    }
  ],
}