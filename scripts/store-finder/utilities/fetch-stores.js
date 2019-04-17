import storesData from '../data/stores';
import getStoreHours from './get-store-hours';

export default async function() {
  try {
    const stores = await storesData();
    const storesWithHours = stores.map(store => {
      const storeHours = getStoreHours(store.id);
      return {
        ...store,
        // Street 2 field used for hours data in ShipHawk setup.
        // @TODO When updating for final API decision from DE, change to 'today'
        street2: storeHours.today,
        tomorrow: storeHours.tomorrow
      };
    });
    return storesWithHours;
  } catch (error) {
    console.error('Error fetch stores: ', error);
    throw error;
  }
}
