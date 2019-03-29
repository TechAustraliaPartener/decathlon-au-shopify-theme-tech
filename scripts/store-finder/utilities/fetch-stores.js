import storesData from '../data/stores';

export default async function() {
  try {
    const stores = await storesData();
    return stores;
  } catch (error) {
    console.error('Error fetch stores: ', error);
    throw error;
  }
}
