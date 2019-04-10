import storesData from '../data/stores';
import getStoreHours from './get-store-hours';

export default async function() {
  try {
    const stores = await storesData();
    const storesWithHours = stores.map(store => {
      const storeHours = getStoreHours(store.id);
      return {
        ...store,
        street2: storeHours
      };
    });
    return storesWithHours;
  } catch (error) {
    console.error('Error fetch stores: ', error);
    throw error;
  }
}
