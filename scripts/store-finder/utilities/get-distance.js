const getDistanceMatrix = data =>
  new Promise((resolve, reject) => {
    const distanceService = new google.maps.DistanceMatrixService();
    distanceService.getDistanceMatrix(data, (response, status) => {
      if (status === 'OK') {
        resolve(response);
      } else {
        reject(response);
      }
    });
  });

export default async ({ origin, destinations }) => {
  try {
    const data = {
      origins: [origin],
      destinations: [...destinations],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.IMPERIAL
    };
    const result = await getDistanceMatrix(data);
    const elements = result.rows[0].elements;
    const distances = elements.map(
      element => element.distance && element.distance.text
    );
    return distances.filter(distance => distance);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
