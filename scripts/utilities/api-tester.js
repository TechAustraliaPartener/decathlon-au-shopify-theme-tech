// @ts-check

import { getStorefrontAPITested, setStorefrontAPITestedState } from './storage';
import { testStorefrontAPI } from '../shared/custom-checkout/queries';

/**
 * 1. Check to see if the Storefront API has been tested (health check), and the
 *    result persisted (it is set to eventually expire and eventually be
 *    re-tested)
 * 2. If there is no persisted test result, query the API and persist the result
 * 3. Return the result
 * @returns {Promise<boolean>} Storefront API has been tested recently
 * and is working
 */
export const persistedStorefrontAPITest = async () => {
  let storefrontAPIWorks = getStorefrontAPITested();
  if (storefrontAPIWorks === null) {
    storefrontAPIWorks = await testStorefrontAPI();
    setStorefrontAPITestedState(storefrontAPIWorks);
  }
  return storefrontAPIWorks;
};
