export type FileCategoryType = "community_image" | "community_bgImage";


export type Usertype = {
  id: string;
  uid: string;
  displayName: 'Noob Cobra',
  email: 'thefakeme123456@gmail.com',
  providerData: [
    {
      providerId: 'google.com'
      photoURL: string | null;
      email: string,
      phoneNumber: number | null,
    }
  ],
}