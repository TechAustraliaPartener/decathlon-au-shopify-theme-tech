import formatStoreAddress from './format-store-address';

const getGeocode = address =>
  new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK') {
        resolve(results[0]);
      } else {
        reject(new Error(`Couldn't find the geocode of: ${address}`));
      }
    });
  });

export default async stores => {
  try {
    const locationData = stores.map(store => {
      const address = formatStoreAddress(store);
      return getGeocode(address);
    });

    const results = await Promise.all(locationData);
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
