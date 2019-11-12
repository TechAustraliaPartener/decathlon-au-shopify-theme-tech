export default () =>
  new Promise((resolve, reject) => {
    const data = window.masterStoresVisual;

    data.length > 0
      ? resolve(data)
      : reject(new Error('Stores data array is empty.'));
  });
