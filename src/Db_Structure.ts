// option 1
// const COMMUNITIES = [{
//   id: "commId",
//   /*
//   createdAt:
//   numberOfmembers:
//   */
//   users: ["userId1", "userId2", "userId3", ".....", "userId11222152"],
// }]

// const USER = [{
//   id: "userId1",
//   /*
//   name:
//   photoUrl:
//   email:
//   */
//   communities: ["commId1", "commId2"],
// }]

// option 2  Sql Approach
// create separate table for mapping user and community
// const USER_COMMUNITY = [
//   {
//     userId: "userId1",
//     communityId: "commId2",
//   },
//   {
//     userId: "userId1",
//     communityId: "commId1",
//   }]

// option 3
const USER = [
  {
    id: "userId1",
    /*
  userData
  */
    communitySnippets: [
      {
        communityId: "commId1",
        photoUrl: "...",
      },
      {
        communityId: "commId2",
        photoUrl: "...",
      },
    ],
  },
];

const COMMUNITIES = [
  {
    id: "commId1",
    numOfMembers: 25364,
  },
];
