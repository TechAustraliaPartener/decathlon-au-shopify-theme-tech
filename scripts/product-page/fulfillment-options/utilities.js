/**
 * Add distance-related fields to store objects
 *
 * @param {Object} data The Decathlon stores and corresponding distances
 * @param {Array} data.stores A collection of store locations
 * @param {Array} data.distances A collection of distance calculations
 * @returns {Array} A collection of stores
 */
const formatStores = ({ stores, distances }) =>
  stores
    // Add required additional fields
    .map((store, i) => ({
      ...store,
      distance: distances[i],
      distanceFloat: parseFloat(distances[i].replace(/,/g, ''), 10)
    }));

/**
 * Get stores within a distance threshold, based on
 * @param {Object} data The Decathlon stores and corresponding distances
 * @param {Array} data.stores A collection of store locations
 * @param {number} data.threshold A value to gauge whether a store is within
 * allowed radius of a customer to be displayed as a pickup option
 * @returns {Array} A collection of stores
 */
const getStoresWithinDistanceThreshold = ({ stores, threshold }) =>
  stores.filter(
    // Determine if the store is within an acceptable distance
    store => store.distanceFloat <= threshold
  );

/**
 * Get and sort stores within a distance threshold, from nearest to farthest
 * @param {Object} data The Decathlon stores and corresponding distances
 * @param {Array} data.stores A collection of store locations
 * @param {Array} data.distances A collection of distance calculations
 * @param {string | number} data.threshold A value to gauge whether a store is within
 * allowed radius of a customer to be displayed as a pickup option
 * @returns {Array} A collection of stores, sorted by distance
 */
export const getDistanceSortedStores = ({ stores, distances, threshold }) => {
  const storesWithinDistanceThreshold = getStoresWithinDistanceThreshold({
    stores: formatStores({ stores, distances }),
    threshold
  });
  return storesWithinDistanceThreshold.sort(
    // Rearrange the stores from nearest to farthest
    (a, b) => a.distanceFloat - b.distanceFloat
  );
};
