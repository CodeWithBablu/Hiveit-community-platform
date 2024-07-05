import { Community } from "@/slices/communitySlice";
import algoliasearch from "algoliasearch";

const searchClient = algoliasearch(import.meta.env.VITE_ALGOLIA_APP_ID, import.meta.env.VITE_ALGOLIA_ADMIN_KEY);
const index = searchClient.initIndex(import.meta.env.VITE_ALGOLIA_INDEX);

// Save data to Algolia
export const saveToAlgolia = async (communityData: Community) => {
  console.log(communityData);
  try {
    const object = {
      objectID: communityData.id,
      communityId: communityData.id,
      imageURL: communityData.imageURL || ""
    };
    await index.saveObject(object);
  } catch (error) {
    console.error('Error saving data to Algolia:', error);
  }
};

// Update data in Algolia
export const updateInAlgolia = async (communityData: Community, imageURL: string) => {
  try {
    await index.saveObject({
      objectID: communityData.id,
      communityId: communityData.id,
      imageURL
    });
  } catch (error) {
    console.error('Error updating data in Algolia:', error);
  }
};