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
  userEmail,
  loadingImage,
  loadingOverlay
} from './ui-elements';
import STATE from '../../state';
import SELECTORS from './selectors';
import { DELIVERY_METHODS } from '../../constants';
import updateUI from './update-ui';
import {
  sessionStorageAvailable,
  setObjectInSessionStorage
} from '../../../utilities/storage';
import { getCurrentLocation } from '../../../utilities/location';
import { showElements, hideElements } from '../../ui-helpers';
import config from '../../config';

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
        // mapImage.src = `${ASSET_BASE_URL}${pickupStore}?v=4`;
        console.log(pickupStore);
        mapImage.src = window[pickupStore];
      }
    });
  });

  if (!document.querySelector(SELECTORS.ACTIVE_PICKUP_LOCATION)) {
    document.querySelector(SELECTORS.PICKUP_LOCATION).click();
  }
};

/**
 * Hides In Store Pickup UI for users outside of California and
 * reveals a link to optionally un-hide In Store Pickup UI
 * @param  {object} currentLocation ipStack response
 */
const updateLocationUI = currentLocation => {
  if (
    currentLocation.region_name === 'California' ||
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
  hideElements([loadingOverlay, loadingImage]);
};

/**
 * Callback for fetch to ShipHawk. Takes the locations and
 * builds the HTML for the store cards and appends them to the
 * locations UL in the DOM.
 * @param  {Object} locations data from ShipHawk
 */
const buildStoreList = locations => {
  for (const location of locations.data) {
    // Check to see if this is the active store so we can add active class
    const activeCard = location.id === STATE.pickupStore || false;

    // Build card
    const locationNode = document.createElement('li');
    locationNode.classList.add('de-u-size1of2');
    locationNode.innerHTML = `
      <div class="js-de-pickup-location de-pickup-location de-u-spaceEnds02 ${
        activeCard ? CLASSES.ACTIVE_PICKUP_LOCATION : ''
      }"
      data-id="${location.id}"
      data-name="${location.name}"
      data-street1="${location.street1}"
      data-street2="${location.street2}"
      data-city="${location.city}"
      data-state="${location.state}"
      data-zip="${location.zip}">
      <p class="de-pickup-location-time de-u-textBlack de-u-textSemibold de-u-textGrow1">Pickup Tomorrow</p>
      <p><span class="de-pickup-location-name de-u-textSemibold de-u-textBlack">${
        location.name
      }</span> ${location.street1} ${
      location.street2 === null ? '' : location.street2
    }</p>

      <p class="de-pickup-location-hours de-u-textShrink2">9:00 AM - 8:00 PM</p>
    </div>`;

    // Insert card
    pickupLocationList.appendChild(locationNode);
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

  // Collect selected store location data and user input
  const selectedStore = document.querySelector(
    SELECTORS.ACTIVE_PICKUP_LOCATION
  );
  const selectedStoreData = {};
  selectedStoreData.firstName = userFirstName.value;
  selectedStoreData.lastName = userLastName.value;
  selectedStoreData.name = selectedStore.dataset.name;
  selectedStoreData.street1 = selectedStore.dataset.street1;
  selectedStoreData.street2 = selectedStore.dataset.street2;
  selectedStoreData.city = selectedStore.dataset.city;
  selectedStoreData.state = selectedStore.dataset.state;
  selectedStoreData.zip = selectedStore.dataset.zip;

  // Construct GID for making graphql queries
  // @TODO move to config
  const checkoutGID = btoa(
    `gid://shopify/Checkout/${window.Shopify.Checkout.token}?key=${checkoutKey}`
  );

  // Graphql update
  fetch(`/api/graphql`, {
    method: 'POST',
    headers: {
      'x-shopify-storefront-access-token': STOREFRONT_API_KEY,
      'content-type': 'application/json'
    },
    /* eslint-disable graphql/template-strings, no-useless-escape */
    body: `{\"query\":\"\\n\\nmutation checkoutShippingAddressUpdateV2($shippingAddress: MailingAddressInput!, $checkoutId: ID!) {\\n  checkoutShippingAddressUpdateV2(shippingAddress: $shippingAddress, checkoutId: $checkoutId) {\\n    checkoutUserErrors {\\n      code\\n      field\\n      message\\n    }\\n    checkout {\\n      id\\n      webUrl\\n      shippingAddress {\\n        company\\n        firstName\\n        lastName\\n        address1\\n        province\\n        country\\n        zip\\n      }\\n    }\\n  }\\n}\",\"variables\":{\"shippingAddress\":{\"company\":\"${
      selectedStoreData.name
    }\",\"lastName\":\"${selectedStoreData.lastName}\",\"firstName\":\"${
      selectedStoreData.firstName
    }\",\"address1\":\"${selectedStoreData.street1}\",\"province\":\"${
      selectedStoreData.state
    }\",\"country\":\"United States\",\"zip\":\"${
      selectedStoreData.zip
    }\",\"city\":\"${
      selectedStoreData.city
    }\"},\"checkoutId\":\"${checkoutGID}\"},\"operationName\":\"checkoutShippingAddressUpdateV2\"}`
    /* eslint-enable */
  })
    .then(res => res.json())
    .then(data => {
      updateEmail(checkoutGID, checkoutKey);
    });
};

/**
 * Gets user inputted email address and sends it to checkout object
 * using graphql
 * @param  {string} checkoutGID Shopify graphql ID of checkout
 * @param  {string} checkoutKey checkout secret uses to construct checkout URL
 * @return calls next step in graphql chain: updateShippingMethod
 */
const updateEmail = (checkoutGID, checkoutKey) => {
  fetch(`/api/graphql`, {
    method: 'POST',
    headers: {
      'x-shopify-storefront-access-token': STOREFRONT_API_KEY,
      'content-type': 'application/json'
    },
    /* eslint-disable graphql/template-strings, no-useless-escape */
    body: `{\"query\":\"mutation checkoutEmailUpdateV2($checkoutId: ID!, $email: String!) {\\n  checkoutEmailUpdateV2(checkoutId: $checkoutId, email: $email) {\\n    checkout {\\n      id\\n      webUrl\\n    }\\n    checkoutUserErrors {\\n      code\\n      field\\n      message\\n    }\\n  }\\n}\",\"variables\":{\"email\":\"${
      userEmail.value
    }\",\"checkoutId\":\"${checkoutGID}\"},\"operationName\":\"checkoutEmailUpdateV2\"}`
    /* eslint-enable */
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      updateShippingMethod(checkoutGID, checkoutKey);
    });
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
      const checkoutURL = `/${SHOP_ID}/checkouts/${
        window.Shopify.Checkout.token
      }?key=${checkoutKey}`;
      window.location.href = checkoutURL;
    });
};

const bindUI = () => {
  if (STATE.deliveryMethod === DELIVERY_METHODS.SHIP) {
    const regexDEC = new RegExp(/Decathlon/);
    if (regexDEC.test(company.value)) {
      clearShippingForm();
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
    const regexDEC = new RegExp(/San Francisco|Emeryville/);
    if (regexDEC.test(company.value)) {
      clearShippingForm();
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
  if (STATE.pickupStore !== null) {
    mapImage.src = window[STATE.pickupStore];
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

  paymentBtn.addEventListener('click', function(e) {
    e.preventDefault();
    // @TODO create validtion function
    if (!this.classList.contains('submitted')) {
      if (
        userFirstName.value === '' ||
        userLastName.value === '' ||
        userEmail.value === ''
      ) {
        if (userFirstName.value === '') {
          userFirstName.parentNode.parentNode.classList.add('field--error');
          userFirstName.addEventListener('blur', () => {
            userFirstName.parentNode.parentNode.classList.remove(
              'field--error'
            );
          });
        }
        if (userLastName.value === '') {
          userLastName.parentNode.parentNode.classList.add('field--error');
          userLastName.addEventListener('blur', () => {
            userLastName.parentNode.parentNode.classList.remove('field--error');
          });
        }
        if (userEmail.value === '') {
          userEmail.parentNode.parentNode.classList.add('field--error');
          userEmail.addEventListener('blur', () => {
            userEmail.parentNode.parentNode.classList.remove('field--error');
          });
        }
      } else {
        this.classList.add = 'submitted';
        // Make button spin
        document.querySelector(
          '.js-de-payment-continue-spinner'
        ).style.animation = 'rotate 0.5s linear infinite';
        document.querySelector(
          '.js-de-payment-continue-spinner'
        ).style.opacity = '1';
        document.querySelector('.js-de-payment-continue-copy').style.opacity =
          '0';
        updateCheckout();
      }
    }
  });

  // Fetch pickup locations from ShipHawk - temporarily using hard-coded data below
  // fetch('https://decathlon-proxy.herokuapp.com/api/shiphawk')
  //   .then(res => res.json())
  //   .then(data => {
  //     buildStoreList(sampleData);
  //   });

  /**
   * Temporary location data - hard-coded until new endpoint is established
   */
  const sampleData = {
    data: [
      {
        id: 'adr_sf',
        name: 'San Francisco',
        company: 'Decathlon',
        street1: '735 Market St',
        street2: '',
        city: 'San Francisco',
        state: 'CA',
        zip: '94103',
        country: 'US',
        phone_number: '(123) 000 0000',
        email: 'fakhar.nisa@decathlon.com',
        is_residential: false,
        is_warehouse: false,
        address_type: null,
        validated: false,
        code: '135'
      }
      // {
      //   id: 'adr_emery',
      //   name: 'Emeryville',
      //   company: 'Decathlon',
      //   street1: '3938 Horton St',
      //   street2: null,
      //   city: 'Emeryville',
      //   state: 'CA',
      //   zip: '94608',
      //   country: 'US',
      //   phone_number: null,
      //   email: null,
      //   is_residential: false,
      //   is_warehouse: false,
      //   address_type: null,
      //   validated: false,
      //   code: null
      // }
    ]
  };
  buildStoreList(sampleData);
};

export default bindUI;
