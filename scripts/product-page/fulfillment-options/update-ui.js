import { TOMORROW, IS_HIDDEN_CLASS, REMOVE, ADD } from './constants';
import { buildStoreTile, setClosestStoreInfo } from './build-ui';

/**
 * @TODO This function will be refined and used in a future PR
 *
 * Toggle the pickup option details (closest store for pickup) and the message
 * that prompts for product variant selections before showing a pickup store
 * @param {Object} params
 * @param {boolean} params.hide - Whether to show or hide pickup details, also
 * toggles display of the select product options message, which should show when
 * pickup details are hidden, or vice versa
 * @param {Object<Element>} params.pickupOptionsEls - All of the elements for
 * this module
 * @param {Element} pickupOptionsEls.storePickupDetailsEl - The element that
 * shows store details
 * @param {Element} pickupOptionsEls.selectForPickupOptionsMessageEl - The
 * element that contains the prompt to select product options before showing
 * pickup options
 */
const togglePickupStoreDetails = ({
  hide,
  pickupOptionsEls: { storePickupDetailsEl, selectForPickupOptionsMessageEl }
}) => {
  const storeInfoClassListAction = hide ? ADD : REMOVE;
  const productSelectionClassListAction = hide ? REMOVE : ADD;
  // Toggle store pickup details
  storePickupDetailsEl.classList[storeInfoClassListAction](IS_HIDDEN_CLASS);
  // Toggle the select product options message, the reverse of store pickup details
  selectForPickupOptionsMessageEl.classList[productSelectionClassListAction](
    IS_HIDDEN_CLASS
  );
};

/**
 * Hide pickup store details and show a message to select a valid product
 * variant
 * @TODO - Use and remove ESLint disable comments
 * @param {Object<Element>} pickupOptionsEls - All of the elements for
 * this module
 */
/* eslint-disable no-unused-vars */
const hidePickupStoreDetails = pickupOptionsEls =>
  /* eslint-enable */
  togglePickupStoreDetails({
    hide: true,
    pickupOptionsEls
  });

/**
 * Show pickup store details and hide a message to select a valid product
 * variant
 * @TODO - Use and remove ESLint disable comments
 * @param {Object<Element>} pickupOptionsEls - All of the elements for
 * this module
 */
/* eslint-disable no-unused-vars */
const showPickupStoreDetails = pickupOptionsEls =>
  /* eslint-enable */
  togglePickupStoreDetails({
    hide: false,
    pickupOptionsEls
  });

/**
 * Toggle the fulfillment (store pickup) options block
 * @param {Element} storePickupOptionsEl - The fulfillment/store-pickup options
 * element
 */
const showPickupOption = storePickupOptionsEl => {
  storePickupOptionsEl.classList.remove(IS_HIDDEN_CLASS);
};

/**
 * Update product fulfillment (store pickup) drawer UI elements
 *
 * @param {Object} params The Decathlon stores and user's location
 * @param {Array} params.stores A collection of store data
 * @param {string} params.zipcode User's zipcode
 * @param {Object<Element>} pickupOptionsEls All of the elements for
 * this module
 * @param {Element} pickupOptionsEls.storeTileListEl The store details blocks
 * for display in the drawer
 * @param {Element} userLocationZipcodeEl The element for displaying the user's
 * detected Zip Code
 */
export const updateDrawerUI = ({
  stores,
  zipcode,
  pickupOptionsEls: { storeTileListEl, userLocationZipcodeEl }
}) => {
  if (stores.length === 0) {
    // @TODO No stores are within range, remove pickup "options", prevent pickup drawer altogether
    return;
  }
  if (stores.length > 0) {
    storeTileListEl.innerHTML = buildStoreTile(stores);
  }
  if (zipcode) {
    userLocationZipcodeEl.innerText = zipcode;
  }
};

/**
 * Update product fulfillment (store pickup) page UI elements
 * @param {Object} params
 * @param {Array} params.stores - A collection of store data
 * @param {Object<Element>} params.pickupOptionsEls - All of the elements for
 * this module
 * @param {Element} pickupOptionsEls.storeAddress1El - The element for a store
 * address
 * @param {Element} pickupOptionsEls.storeCityEl - The element for a store city
 * @param {Element} pickupOptionsEls.pickupDayEl - The element for a pickup day
 * @param {Element} pickupOptionsEls.storePickupOptionsEl - The element that
 * contains all pickup options
 */
export const updatePageUI = ({
  stores,
  pickupOptionsEls,
  pickupOptionsEls: {
    storeAddress1El,
    storeCityEl,
    pickupDayEl,
    storePickupOptionsEl
  }
}) => {
  if (stores.length === 0) {
    // No stores are within range, do not display fulfillment (pickup) options
    return;
  }
  // Get the first store (they are sorted closest first)
  const closestStore = stores[0];
  // Update the store info in the fulfillment section of the page
  setClosestStoreInfo({
    store: closestStore,
    storeAddress1El,
    storeCityEl
  });
  pickupDayEl.innerHTML = TOMORROW;
  showPickupOption(storePickupOptionsEl);
  /**
   * @TODO - Implement logic coming from product swatch selection
   * Listener for swatch selection ->
   * - showPickupStoreDetails(pickupOptionsEls);
   * - hidePickupStoreDetails(pickupOptionsEls);
   */
};
