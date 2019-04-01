export default latLng =>
  new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ latLng }, (results, status) => {
      if (status === 'OK') {
        resolve(results[0]);
      } else {
        reject(new Error(`Could not find the reverse geocode of: ${latLng}`));
      }
    });
  });
