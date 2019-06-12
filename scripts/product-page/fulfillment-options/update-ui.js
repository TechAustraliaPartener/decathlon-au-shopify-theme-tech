import { TOMORROW, IS_HIDDEN_CLASS, REMOVE, ADD } from './constants';
import { buildStoreTile, setClosestStoreInfo } from './build-ui';
import { getAvailableSelectedVariant } from '../product-data';

/**
 * Toggle the pickup option details (closest store for pickup) and the message
 * that prompts for product variant selections before showing a pickup store
 * @param {Object} params
 * @param {boolean} params.hide - Whether to show or hide pickup details, also
 * toggles display of the select product options message, which should show when
 * pickup details are hidden, or vice versa
 * @param {Object.<string, Element>} params.pickupOptionsEls - All of the elements for
 * this module
 * @param {Element} params.pickupOptionsEls.storePickupDetailsEl - The element that
 * shows store details
 * @param {Element} params.pickupOptionsEls.pickupDayEl - The element for showing
 * next available pickup day
 * @param {Element} params.pickupOptionsEls.selectForPickupOptionsMessageEl - The
 * element that contains the prompt to select product options before showing
 * pickup options
 */
const togglePickupStoreDetails = ({
  hide,
  pickupOptionsEls: {
    storePickupDetailsEl,
    pickupDayEl,
    selectForPickupOptionsMessageEl
  }
}) => {
  const storeInfoClassListAction = hide ? ADD : REMOVE;
  const productSelectionClassListAction = hide ? REMOVE : ADD;
  // Toggle store pickup details
  storePickupDetailsEl.classList[storeInfoClassListAction](IS_HIDDEN_CLASS);
  // Toggle the pickup day
  pickupDayEl.classList[storeInfoClassListAction](IS_HIDDEN_CLASS);
  // Toggle the select product options message, the reverse of store pickup details
  selectForPickupOptionsMessageEl.classList[productSelectionClassListAction](
    IS_HIDDEN_CLASS
  );
};

/**
 * Hide pickup store details and show a message to select a valid product
 * variant
 * @param {Object.<string, Element>} pickupOptionsEls - All of the elements for
 * this module
 */
const hidePickupStoreDetails = pickupOptionsEls =>
  togglePickupStoreDetails({
    hide: true,
    pickupOptionsEls
  });

/**
 * Show pickup store details and hide a message to select a valid product
 * variant
 * @param {Object.<string, Element>} pickupOptionsEls - All of the elements for
 * this module
 */
const showPickupStoreDetails = pickupOptionsEls =>
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
 * @param {Object.<string, Element>} params.pickupOptionsEls All of the elements for
 * this module
 * @param {Element} params.pickupOptionsEls.storeTileListEl The store details blocks
 * for display in the drawer
 * @param {Element} params.pickupOptionsEls.userLocationZipcodeEl The element for displaying the user's
 * detected Zip Code
 * @param {Object | null} [params.selectedVariant] A selected product variant
 */
const updateDrawerUI = ({
  stores,
  zipcode,
  pickupOptionsEls: { storeTileListEl, userLocationZipcodeEl },
  selectedVariant
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
  if (selectedVariant) {
    // @TODO - implement
  }
};

/**
 * Update product fulfillment (store pickup) page UI elements
 * @param {Object} params
 * @param {Array} params.stores - A collection of store data
 * @param {Object.<string, Element>} params.pickupOptionsEls - All of the elements for
 * this module
 * @param {Element} params.pickupOptionsEls.storeAddress1El - The element for a store
 * address
 * @param {Element} params.pickupOptionsEls.storeCityEl - The element for a store city
 * @param {Element} params.pickupOptionsEls.pickupDayEl - The element for a pickup day
 * @param {Element} params.pickupOptionsEls.storePickupOptionsEl - The element that
 * contains all pickup options
 * @param {Object | null} [params.selectedVariant] A selected product variant
 */
const updatePageUI = ({
  stores,
  pickupOptionsEls,
  pickupOptionsEls: {
    storeAddress1El,
    storeCityEl,
    pickupDayEl,
    storePickupOptionsEl
  },
  selectedVariant
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
  if (selectedVariant) {
    // If an available product variant has been selected, show store details
    showPickupStoreDetails(pickupOptionsEls);
  } else {
    // Otherwise, hide store details
    hidePickupStoreDetails(pickupOptionsEls);
  }
};

/**
 * Initialize the updaters with store and location data, and DOM elements, and
 * return a function that takes in variant info to update the UI
 * @param {Object} params
 * @param {Array} params.stores - A collection of store data
 * @param {string} params.zipcode - User's zipcode
 * @param {Object.<string, Element>} params.pickupOptionsEls - All of the elements for
 * this module
 */
export const initUpdateUI = ({ stores, zipcode, pickupOptionsEls }) =>
  /**
   * Master function for updating product fulfillment options block in buybox
   * and the drawer content
   * @param {Object} params
   * @param {string} [params.id] - A variant ID
   * @param {string} [params.color] - A variant color
   * @param {string} [params.size] - A variant size
   */
  ({ id, color, size }) => {
    let selectedVariant = null;
    if (!id && color && size) {
      // Get selectedVariant object from color and size
      selectedVariant = getAvailableSelectedVariant({ color, size });
    }
    if (id) {
      // Get selectedVariant object from ID
      selectedVariant = getAvailableSelectedVariant({ id });
    }
    updatePageUI({ stores, pickupOptionsEls, selectedVariant });
    updateDrawerUI({
      stores,
      zipcode,
      pickupOptionsEls,
      selectedVariant
    });
  };
