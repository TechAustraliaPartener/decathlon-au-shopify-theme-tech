import { JS_PREFIX } from '../constants';

const JS_PRODUCT_FULFILLMENT_PREFIX = `${JS_PREFIX}ProductFulfillment-`;
const STORE_PICKUP_PREFIX = `${JS_PREFIX}StorePickup-`;

/**
 * Page (in buybox fulfillment section) selectors
 */
export const STORE_PICKUP_OPTIONS = `${JS_PRODUCT_FULFILLMENT_PREFIX}pickupOptions`;
export const STORE_PICKUP_DETAILS = `${JS_PRODUCT_FULFILLMENT_PREFIX}pickupDetails`;
export const PICKUP_DAY = `${JS_PRODUCT_FULFILLMENT_PREFIX}pickupDay`;
export const STORE_PICKUP_STORE = `${JS_PRODUCT_FULFILLMENT_PREFIX}pickupStore`;
export const STORE_PICKUP_CITY = `${JS_PRODUCT_FULFILLMENT_PREFIX}pickupCity`;
export const STORE_PICKUP_ADDRESS = `${JS_PRODUCT_FULFILLMENT_PREFIX}pickupAddress`;
export const SELECT_FOR_PICKUP_OPTIONS_MESSAGE = `${JS_PRODUCT_FULFILLMENT_PREFIX}selectForOptionsMessage`;

/**
 * Drawer store-list and location selectors
 */
export const STORE_PICKUP_LIST_SELECTOR = `${STORE_PICKUP_PREFIX}list`;
export const STORE_PICKUP_USER_ZIPCODE_SELECTOR = `${STORE_PICKUP_PREFIX}zipcode`;
export const STORE_PICKUP_USER_CITY_SELECTOR = `${STORE_PICKUP_PREFIX}city`;
export const STORE_PICKUP_USER_STATE_SELECTOR = `${STORE_PICKUP_PREFIX}stateCode`;
export const STORE_PICKUP_LOCATION_INPUT_TOGGLE = `${STORE_PICKUP_PREFIX}locationInputToggle`;
export const STORE_PICKUP_USE_GEOLOCATION = `${STORE_PICKUP_PREFIX}useGeolocation`;
export const STORE_PICKUP_USE_MY_LOCATION = `${STORE_PICKUP_PREFIX}useMyLocationText`;
export const STORE_PICKUP_LOADING_LOCATION = `${STORE_PICKUP_PREFIX}loadingLocationText`;
export const STORE_PICKUP_CUSTOMER_LOCATION = `${STORE_PICKUP_PREFIX}customerLocation`;
export const STORE_PICKUP_THUMBNAIL_IMAGE = `${STORE_PICKUP_PREFIX}thumbnailImage`;
export const STORE_PICKUP_VARIANT_SIZE = `${STORE_PICKUP_PREFIX}variantSize`;
export const STORE_PICKUP_VARIANT_COLOR = `${STORE_PICKUP_PREFIX}variantColor`;

/**
 * Acceptable radius gate of user's location to store locations (in miles)
 * NOTE: For testing purposes only, adjust the 100 (in miles) integer to an acceptable in range value
 * Value may also be injected when running or through env
 */
export const OUT_OF_AREA_THRESHOLD = process.env.OUT_OF_AREA_THRESHOLD || 100;

export const TOMORROW = 'tomorrow';
/**
 * @TODO - For future implementation, TODAY will be possible for pickup from
 * in-store inventory. Additionally, a range of days will be needed (likely
 * as an enum, to be conditioned by days from a warehouse to store, starting
 * with the current day)
 */

/**
 * Constants for updating classLists
 */
export const REMOVE = 'remove';
export const ADD = 'add';

/**
 * Re-export all higher-level constants
 */
export * from '../constants';
