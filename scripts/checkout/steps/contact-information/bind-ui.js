import {
  pickupToggleBtn,
  shipToggleBtn,
  continueBtn,
  pickupLocationList,
  pickupContent,
  mapImage,
  company,
  userFirstName,
  userLastName,
  userAddress1,
  userAddress2,
  userCity,
  userZip,
  userPhone,
  userEmail,
  loadingImage,
  loadingOverlay
} from './ui-elements';
import STATE from '../../state';
import SELECTORS from './selectors';
import { DELIVERY_METHODS } from '../../constants';
import updateUI from './update-ui';
import fetchStores from '../../../store-finder/utilities/fetch-stores';
import {
  sessionStorageAvailable,
  setObjectInSessionStorage
} from '../../../utilities/storage';
import { getCurrentLocation } from '../../../utilities/location';
import { showElements, hideElements, elementExists } from '../../ui-helpers';
import config from '../../config';

console.log(STATE);

const { CLASSES, SHOP_ID, PICKUP_SHIPPING_METHOD, STOREFRONT_API_KEY } = config;

const clearShippingForm = () => {
  company.value = '';
  userAddress1.value = '';
  userAddress2.value = '';
  userCity.value = '';
  userZip.value = '';
};

/**
 * Binds click event to location cards separately
 * since they are dynamically added after the DOM is
 * loaded. This function is called after the fetch to
 * ShipHawk resolves and store list is built in the DOM.
 */
const bindLocations = () => {
  const pickupLocations = document.querySelectorAll(SELECTORS.PICKUP_LOCATION);

  pickupLocations.forEach(location => {
    location.addEventListener('click', function(e) {
      // Is this card already active?
      if (!this.classList.contains(CLASSES.ACTIVE_PICKUP_LOCATION)) {
        // Find the currently active card
        const activeLocation = document.querySelector(
          SELECTORS.ACTIVE_PICKUP_LOCATION
        );

        // Make currently active card inactive
        if (activeLocation !== null) {
          activeLocation.classList.remove(CLASSES.ACTIVE_PICKUP_LOCATION);
        }

        // Make this card active
        this.classList.add(CLASSES.ACTIVE_PICKUP_LOCATION);

        // Get the ShipHawk ID of this store
        const pickupStore = this.getAttribute('data-id');

        // Update global state with pickup store
        STATE.pickupStore = pickupStore;

        // Set preferred store in sessionStorage
        if (sessionStorageAvailable) {
          setObjectInSessionStorage('pickup_store', pickupStore);
        }

        // Update map image
        if (elementExists(mapImage)) {
          mapImage.src = window[pickupStore];
        }

        // Enable Continue Button
        if (elementExists(document.querySelector('.js-de-payment-continue'))) {
          document
            .querySelector('.js-de-payment-continue')
            .classList.remove(CLASSES.DISABLED_BUTTON);
        }
      }
    });
  });
};

/**
 * Hides In Store Pickup UI for users outside of California and
 * reveals a link to optionally un-hide In Store Pickup UI
 * @param  {object} currentLocation ipStack response
 */
const updateLocationUI = currentLocation => {
  showElements([loadingOverlay, loadingImage]);
  if (deliveryMethod === 'Click &amp; Collect') {
    pickupDefaultUpdate();
    showElements([pickupContent]);
  } else {
    hideElements([loadingOverlay, loadingImage]);
  }
  /*
  showElements([pickupToggleBtn, shipToggleBtn]);
    if (STATE.deliveryMethod === DELIVERY_METHODS.PICKUP) {
      showElements([pickupContent]);
    }

  if (
    currentLocation.region_name === 'New South Wales' ||
    currentLocation.region_name === 'Victoria' ||
    STATE.deliveryMethod === DELIVERY_METHODS.PICKUP
  ) {
    showElements([pickupToggleBtn, shipToggleBtn]);
    if (STATE.deliveryMethod === DELIVERY_METHODS.PICKUP) {
      showElements([pickupContent]);
    }
  } else {
    showElements([document.querySelector('.de-visit-cal-container')]);
    document
      .querySelector('.de-visit-cal-btn')
      .addEventListener('click', event => {
        showElements([pickupToggleBtn, shipToggleBtn, pickupContent]);
        STATE.deliveryMethod = DELIVERY_METHODS.PICKUP;
        pickupToggleBtn.classList.toggle(CLASSES.ACTIVE_SHIPPICK_BTN);
        shipToggleBtn.classList.toggle(CLASSES.ACTIVE_SHIPPICK_BTN);
        if (sessionStorageAvailable) {
          setObjectInSessionStorage('delivery_method', DELIVERY_METHODS.PICKUP);
        }
        updateUI();
        hideElements([document.querySelector('.de-visit-cal-container')]);
      });
  }
  */
};

/**
 * Callback for fetch to ShipHawk. Takes the locations and
 * builds the HTML for the store cards and appends them to the
 * locations UL in the DOM.
 * @param  {Object} locations data from ShipHawk
 */
const buildStoreList = locations => {
  for (const location of locations) {
    // Check to see if this is the active store so we can add active class
    const activeCard = location.id === STATE.pickupStore || false;

    if (activeCard) {
      console.log(location);
      console.log(location.fullHours);
      // Build card
      const locationNode = document.createElement('li');
      const readyText =
        location.name === 'Moorabbin'
          ? 'Pickup: Ready In 24 Hours'
          : 'Pickup: Ready In 2 Hours';
      locationNode.classList.add('de-u-size1of2');
      locationNode.innerHTML = `
        <div class="js-de-pickup-location de-pickup-location de-u-spaceEnds02 ${
          activeCard ? CLASSES.ACTIVE_PICKUP_LOCATION : ''
        }"
        data-id="${location.id}"
        data-name="${location.name}"
        data-street1="${location.street1}"
        data-city="${location.city}"
        data-state="${location.state}"
        data-zip="${location.zip}">
        <p class="de-pickup-location-time de-u-textBlack de-u-textSemibold de-u-textGrow1">${readyText}</p>
        <p><span class="de-pickup-location-name de-u-textSemibold de-u-textBlack">${
          location.name
        }</span> ${location.street1}</p>

        <p class="de-pickup-location-hours de-u-textShrink2 ${ location.tooltip_hours ? 'tooltip-opener' : '' }">${
          location.street2
        }</p>
        ${ location.tooltip_hours ?
          `<div class="hours-tooltip">
            <ul class="tooltip-content">${ location.fullHours }</ul>
          </div>`
        : '' }
      </div>`;

      // Insert card
      pickupLocationList.appendChild(locationNode);
    }
  }

  // Now that the cards are built, bind onclick functionality
  bindLocations();

  // Get ipstack location promise, Update UI based on results
  getCurrentLocation.then(function(currentLocation) {
    updateLocationUI(currentLocation);
  });
};

/**
 * Gathers selected store location data and sends to checkout
 * object as the shipping address with graphql call
 * @return calls next step in graphql chain: updateEmail
 */
const updateCheckout = () => {
  // Get "checkout_secret" from meta tags to use in construction of GID
  // @TODO move to config
  const checkoutKey = document
    .querySelector('[name="shopify-checkout-authorization-token"]')
    .getAttribute('content');

  fillStoreData();
};

const pickupDefaultUpdate = () => {
  var checkoutKey = document
    .querySelector('[name="shopify-checkout-authorization-token"]')
    .getAttribute('content');

  fillStoreData();
};

const fillStoreData = () => {
  // Collect selected store location data and user input
  var selectedStore = document.querySelector(SELECTORS.ACTIVE_PICKUP_LOCATION);

  var checkoutAddressData = {};

  checkoutAddressData.first_name = userFirstName.value;
  checkoutAddressData.last_name = userLastName.value;
  checkoutAddressData.phone = userPhone.value;

  checkoutAddressData.company = selectedStore.dataset.name;
  checkoutAddressData.address1 = selectedStore.dataset.street1;
  checkoutAddressData.address2 = selectedStore.dataset.street2 || '';
  checkoutAddressData.city = selectedStore.dataset.city;
  checkoutAddressData.country = 'Australia';
  checkoutAddressData.province = selectedStore.dataset.state;
  checkoutAddressData.zip = selectedStore.dataset.zip;

  for (var key in checkoutAddressData) {
    console.log(key, checkoutAddressData[key]);
    $('[name="checkout[shipping_address][' + key + ']"]').val(
      checkoutAddressData[key]
    );
  }
};

/**
 * Updates checkout object with In Store Pickup shipping method
 * using graphql, then redirects to payment page
 * @param  {string} checkoutGID Shopify graphql ID of checkout
 * @param  {string} checkoutKey checkout secret uses to construct checkout URL
 * @TODO make shipping rate dynamic when Decathlon provides unique practices
 * for each store.
 */
const updateShippingMethod = (checkoutGID, checkoutKey) => {
  console.log('updateShippingMethod to pickup');
  fetch(`/api/graphql`, {
    method: 'POST',
    headers: {
      'x-shopify-storefront-access-token': STOREFRONT_API_KEY,
      'content-type': 'application/json'
    },
    /* eslint-disable graphql/template-strings, no-useless-escape */
    body: `{\"query\":\"mutation checkoutShippingLineUpdate($checkoutId: ID!, $shippingRateHandle: String!) {\\n  checkoutShippingLineUpdate(checkoutId: $checkoutId, shippingRateHandle: $shippingRateHandle) {\\n    checkout {\\n      id\\n      webUrl\\n    }\\n    checkoutUserErrors {\\n      code\\n      field\\n      message\\n    }\\n  }\\n}\",\"variables\":{\"checkoutId\":\"${checkoutGID}\",\"shippingRateHandle\":\"${PICKUP_SHIPPING_METHOD}\"},\"operationName\":\"checkoutShippingLineUpdate\"}`
    /* eslint-enable */
  })
    .then(res => res.json())
    .then(data => {
      console.log(3, JSON.stringify(data));
      //alert('Please feel free to check out the console logs for the GraphQL API responses, or check the Network tab for the requests themselves');
      const checkoutURL = `/${SHOP_ID}/checkouts/${window.Shopify.Checkout.token}?key=${checkoutKey}`;
      window.location.href = checkoutURL;
    });
};

const bindUI = () => {
  /**
   * On load checks hidden Company field for auto-populated pickup store data.
   * If true, form clears
   */

  if (STATE.deliveryMethod === DELIVERY_METHODS.SHIP) {
    const regexDEC = new RegExp(/San Francisco|Emeryville|Oakland/);
    if (elementExists(company)) {
      if (regexDEC.test(company.value)) {
        clearShippingForm();
      }
    }
  }

  // Clear form if store data is pre-populating

  /**
   * Bind the toggle buttons.
   * Some of these procedures may move to updateUI
   */
  pickupToggleBtn.addEventListener('click', event => {
    event.preventDefault();
    STATE.deliveryMethod = DELIVERY_METHODS.PICKUP;
    pickupToggleBtn.classList.toggle(CLASSES.ACTIVE_SHIPPICK_BTN);
    shipToggleBtn.classList.toggle(CLASSES.ACTIVE_SHIPPICK_BTN);
    if (sessionStorageAvailable) {
      setObjectInSessionStorage('delivery_method', DELIVERY_METHODS.PICKUP);
    }
    updateUI();
  });

  shipToggleBtn.addEventListener('click', event => {
    // Will find a better way here when location API is finalized
    const regexDEC = new RegExp(/San Francisco|Emeryville|Oakland/);
    if (elementExists(company)) {
      if (regexDEC.test(company.value)) {
        clearShippingForm();
      }
    }
    STATE.deliveryMethod = DELIVERY_METHODS.SHIP;
    pickupToggleBtn.classList.toggle(CLASSES.ACTIVE_SHIPPICK_BTN);
    shipToggleBtn.classList.toggle(CLASSES.ACTIVE_SHIPPICK_BTN);
    if (sessionStorageAvailable) {
      setObjectInSessionStorage('delivery_method', DELIVERY_METHODS.SHIP);
    }
    updateUI();
  });

  /**
   * Update map if preferred store is selected on load.
   * This probably needs to move.
   */
  if (elementExists(mapImage)) {
    if (STATE.pickupStore === null) {
      mapImage.src = window.defaultMap;
    } else {
      mapImage.src = window[STATE.pickupStore];
    }
  }

  /**
   * Add second Continue button for Pickup (straight to Payment)
   * Needs refactoring.
   */
  const paymentBtnCont = document.querySelector(
    SELECTORS.PICKUP_CONTINUE_BTN_CONTAINER
  );
  let paymentBtn = document.querySelector(SELECTORS.PICKUP_CONTINUE_BTN);
  const paymentBtnHTML = paymentBtnCont.innerHTML;
  paymentBtnCont.removeChild(paymentBtn);
  continueBtn.insertAdjacentHTML('afterend', paymentBtnHTML);
  paymentBtn = document.querySelector(SELECTORS.PICKUP_CONTINUE_BTN);
  if (elementExists(paymentBtn)) {
    paymentBtn.classList.add(CLASSES.DISABLED_BUTTON);
  }

  paymentBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (document.querySelector(SELECTORS.ACTIVE_PICKUP_LOCATION)) {
      // @TODO create validtion function
      if (!this.classList.contains('submitted')) {
        if (
          userFirstName.value === '' ||
          userLastName.value === '' ||
          userPhone.value === '' ||
          userEmail.value === ''
        ) {
          if (elementExists(userFirstName) && userFirstName.value === '') {
            userFirstName.parentNode.parentNode.classList.add('field--error');
            userFirstName.addEventListener('blur', () => {
              userFirstName.parentNode.parentNode.classList.remove(
                'field--error'
              );
            });
          }
          if (elementExists(userLastName) && userLastName.value === '') {
            userLastName.parentNode.parentNode.classList.add('field--error');
            userLastName.addEventListener('blur', () => {
              userLastName.parentNode.parentNode.classList.remove(
                'field--error'
              );
            });
          }
          if (elementExists(userPhone) && userPhone.value === '') {
            userPhone.parentNode.parentNode.classList.add('field--error');
            userPhone.addEventListener('blur', () => {
              userPhone.parentNode.parentNode.classList.remove('field--error');
            });
          }
          if (elementExists(userEmail) && userEmail.value === '') {
            userEmail.parentNode.parentNode.classList.add('field--error');
            userEmail.addEventListener('blur', () => {
              userEmail.parentNode.parentNode.classList.remove('field--error');
            });
          }
        } else if (
          $('.edit_checkout #checkout_email:invalid').length &&
          elementExists(userEmail)
        ) {
          userEmail.parentNode.parentNode.classList.add('field--error');
          userEmail.addEventListener('blur', () => {
            userEmail.parentNode.parentNode.classList.remove('field--error');
          });
        } else if (
          $('.edit_checkout #checkout_shipping_address_phone:invalid').length &&
          elementExists(userPhone)
        ) {
          userPhone.parentNode.parentNode.classList.add('field--error');
          userPhone.addEventListener('blur', () => {
            userPhone.parentNode.parentNode.classList.remove('field--error');
          });
        } else {
          localStorage.setItem('step', Shopify.Checkout.step);
          this.classList.add = 'submitted';
          // Make button spin
          if (
            elementExists(
              document.querySelector('.js-de-payment-continue-spinner')
            )
          ) {
            document.querySelector(
              '.js-de-payment-continue-spinner'
            ).style.animation = 'rotate 0.5s linear infinite';
            document.querySelector(
              '.js-de-payment-continue-spinner'
            ).style.opacity = '1';
          }
          if (
            elementExists(
              document.querySelector('.js-de-payment-continue-copy')
            )
          ) {
            document.querySelector(
              '.js-de-payment-continue-copy'
            ).style.opacity = '0';
          }
          updateCheckout();
          $('[data-customer-information-form]').submit();
        }
      }
    }
  });

  async function fetchStoreList() {
    try {
      const stores = await fetchStores();
      return stores;
    } catch (error) {
      console.error(error);
    }
  }

  fetchStoreList().then(stores => buildStoreList(stores));
};

export default bindUI;
