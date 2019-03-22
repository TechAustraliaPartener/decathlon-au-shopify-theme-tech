import {
  pickupToggleBtn,
  shipToggleBtn,
  continueBtn,
  pickupLocationList,
  pickupContent
} from './ui-elements';
import STATE from '../../state';
import { DELIVERY_METHODS } from '../../constants';
import updateUI from './update-ui';
import { setObjectInLocalStorage } from '../../../utilities/storage';
import { getCurrentLocation } from '../../../utilities/location';
import { showElements } from '../../ui-helpers';

/**
 * Binds click event to location cards seperately
 * since they are dynamically added after the DOM is
 * loaded. This function is called after the fetch to
 * ShipHawk resolves and store list is built in the DOM.
 */
const bindLocations = () => {
  const pickupLocations = document.querySelectorAll('.js-de-pickup-location');
  pickupLocations.forEach(location => {
    location.addEventListener('click', function(e) {
      // Is this card already active?
      if (this.classList.contains('js-de-active-location')) {
        console.log('already active');
      } else {
        // Find the currently active card
        const activeLocation = document.querySelector('.js-de-active-location');

        // Make currently active card inactive
        if (activeLocation !== null) {
          activeLocation.classList.remove('js-de-active-location');
        }

        // Make this card active
        this.classList.add('js-de-active-location');

        // Get the ShipHawk ID of this store
        const pickupStore = this.getAttribute('data-id');

        // Update global state with pickup store
        STATE.pickupStore = pickupStore;

        // Set preferred store in localStorage
        // @TODO change to sessionStorage
        setObjectInLocalStorage('pickup_store', pickupStore);

        // Update map image
        document.querySelector(
          '.js-de-pickup-location-map-img'
        ).src = `//cdn.shopify.com/s/files/1/1752/4727/t/79/assets/${pickupStore}.jpg?v=3`;
      }
    });
  });
};

const updateLocationUI = (currentLocation) => {
  if(currentLocation.region_name === 'California' || STATE.deliveryMethod === 'pickup'){
    showElements([pickupToggleBtn, shipToggleBtn, pickupContent]);
  } else {
    showElements([document.querySelector('.de-visit-cal-container')]);
  }
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
    let activeCard = false;
    if (location.id === STATE.pickupStore) {
      activeCard = true;
    }

    // Build card
    const locationNode = document.createElement('li');
    locationNode.innerHTML = `
      <div class="js-de-pickup-location de-pickup-location${ activeCard ? ' js-de-active-location' : '' }"
      data-id="${location.id}"
      data-name="${location.name}"
      data-street1="${location.street1}"
      data-street2="${location.street2}"
      data-city="${location.city}"
      data-state="${location.state}"
      data-zip="${location.zip}">
      <div class="de-pickup-location-time">Pickup Tomorrow</div>
      <div><span class="de-pickup-location-name">${location.name}</span> ${location.street1} ${
      location.street2 === null ? '' : location.street2
    }</div>

      <div class="de-pickup-location-hours">9:00 AM - 8:00 PM</div>
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

}

const updateCheckout = () => {

  const checkoutKey = document.querySelector('[name="shopify-checkout-authorization-token"]').getAttribute('content');
  const selectedStore = document.querySelector('.js-de-active-location');
  const selectedStoreData = {};
  selectedStoreData.firstName = document.querySelector('#checkout_shipping_address_first_name').value;
  selectedStoreData.lastName = document.querySelector('#checkout_shipping_address_last_name').value;
  selectedStoreData.name = selectedStore.dataset.name;
  selectedStoreData.street1 = selectedStore.dataset.street1;
  selectedStoreData.street2 = selectedStore.dataset.street2;
  selectedStoreData.city = selectedStore.dataset.city;
  selectedStoreData.state = selectedStore.dataset.state;
  selectedStoreData.zip = selectedStore.dataset.zip;
  //
  // console.log(selectedStoreData);
  // const checkoutURL = data.checkout.abandoned_checkout_url;
  // const checkoutKeyRegex = /(&|\?key=)(.*?)(&|$)/g;
  // const checkoutKeyMatches = checkoutKeyRegex.exec(checkoutURL);
  // const checkoutKey = checkoutKeyMatches[2];
  const checkoutGID = btoa(`gid://shopify/Checkout/${ window.Shopify.Checkout.token }?key=${ checkoutKey }`);

  fetch('https://testing-decathlon-usa.myshopify.com/api/graphql', {
    method: 'POST',
    headers: {
      "x-shopify-storefront-access-token": "8e681070902104a65649736d6b1f7bd0",
      "content-type": "application/json"
    },
    /* eslint-disable */
    body: `{\"query\":\"\\n\\nmutation checkoutShippingAddressUpdateV2($shippingAddress: MailingAddressInput!, $checkoutId: ID!) {\\n  checkoutShippingAddressUpdateV2(shippingAddress: $shippingAddress, checkoutId: $checkoutId) {\\n    checkoutUserErrors {\\n      code\\n      field\\n      message\\n    }\\n    checkout {\\n      id\\n      webUrl\\n      shippingAddress {\\n        company\\n        firstName\\n        lastName\\n        address1\\n        province\\n        country\\n        zip\\n      }\\n    }\\n  }\\n}\",\"variables\":{\"shippingAddress\":{\"company\":\"${selectedStoreData.name}\",\"lastName\":\"${selectedStoreData.lastName}\",\"firstName\":\"${selectedStoreData.firstName}\",\"address1\":\"${selectedStoreData.street1}\",\"province\":\"${selectedStoreData.state}\",\"country\":\"United States\",\"zip\":\"${selectedStoreData.zip}\",\"city\":\"${selectedStoreData.city}\"},\"checkoutId\":\"${checkoutGID}\"},\"operationName\":\"checkoutShippingAddressUpdateV2\"}`
    /* eslint-enable */
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    updateEmail(checkoutGID, checkoutKey);
  });
}


const updateEmail = (checkoutGID, checkoutKey) => {
  const userEmail = document.querySelector('#checkout_email').value;

  fetch('https://testing-decathlon-usa.myshopify.com/api/graphql', {
    method: 'POST',
    headers: {
      "x-shopify-storefront-access-token": "8e681070902104a65649736d6b1f7bd0",
      "content-type": "application/json"
    },
    /* eslint-disable */
    body: `{\"query\":\"mutation checkoutEmailUpdateV2($checkoutId: ID!, $email: String!) {\\n  checkoutEmailUpdateV2(checkoutId: $checkoutId, email: $email) {\\n    checkout {\\n      id\\n      webUrl\\n    }\\n    checkoutUserErrors {\\n      code\\n      field\\n      message\\n    }\\n  }\\n}\",\"variables\":{\"email\":\"${ userEmail }\",\"checkoutId\":\"${ checkoutGID }\"},\"operationName\":\"checkoutEmailUpdateV2\"}`
    /* eslint-enable */
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    updateShippingMethod(checkoutGID, checkoutKey);
  });

}

const updateShippingMethod = (checkoutGID, checkoutKey) => {

  fetch('https://testing-decathlon-usa.myshopify.com/api/graphql', {
    method: 'POST',
    headers: {
      "x-shopify-storefront-access-token": "8e681070902104a65649736d6b1f7bd0",
      "content-type": "application/json"
    },
    /* eslint-disable */
    body: `{\"query\":\"mutation checkoutShippingLineUpdate($checkoutId: ID!, $shippingRateHandle: String!) {\\n  checkoutShippingLineUpdate(checkoutId: $checkoutId, shippingRateHandle: $shippingRateHandle) {\\n    checkout {\\n      id\\n      webUrl\\n    }\\n    checkoutUserErrors {\\n      code\\n      field\\n      message\\n    }\\n  }\\n}\",\"variables\":{\"checkoutId\":\"${ checkoutGID }\",\"shippingRateHandle\":\"shopify-In%20Store%20Pickup-0.00\"},\"operationName\":\"checkoutShippingLineUpdate\"}`
    /* eslint-enable */
  })
  .then(res => res.json())
  .then(data => {
    const checkoutURL = `https://testing-decathlon-usa.myshopify.com/17524727/checkouts/${ window.Shopify.Checkout.token }?key=${ checkoutKey }`;
    console.log(checkoutURL);
    window.location.href = checkoutURL;
  });

}

const bindUI = () => {
  /**
   * Bind the toggle buttons.
   * Some of these procedures may move to updateUI
   */
  pickupToggleBtn.addEventListener('click', function(event) {
    STATE.deliveryMethod = DELIVERY_METHODS.PICKUP;
    pickupToggleBtn.classList.toggle('js-de-active-pickship-btn');
    shipToggleBtn.classList.toggle('js-de-active-pickship-btn');
    setObjectInLocalStorage('delivery_method', 'pickup');
    updateUI();
  });

  shipToggleBtn.addEventListener('click', function(event) {
    STATE.deliveryMethod = DELIVERY_METHODS.SHIP;
    pickupToggleBtn.classList.toggle('js-de-active-pickship-btn');
    shipToggleBtn.classList.toggle('js-de-active-pickship-btn');
    setObjectInLocalStorage('delivery_method', 'ship');
    updateUI();
  });

  document.querySelector('.js-de-payment-continue').addEventListener('click', function(event) {

  });

  // Fetch pickup locations from ShipHawk
  fetch('https://decathlon-proxy.herokuapp.com/api/shiphawk')
    .then(res => res.json())
    .then(data => {
      const sampleData = {
       "data":[
           {
              "id":"adr_GezSSC9M",
              "name":"San Francisco",
              "company":"Decathlon",
              "street1":"735 Market St",
              "street2":"",
              "city":"San Francisco",
              "state":"CA",
              "zip":"94103",
              "country":"US",
              "phone_number":"(123) 000 0000",
              "email":"fakhar.nisa@decathlon.com",
              "is_residential":false,
              "is_warehouse":false,
              "address_type":null,
              "validated":false,
              "code":"135"
           },
          {
             "id":"adr_XhPJyRNn",
             "name":"Emeryville",
             "company":"Decathlon",
             "street1":"3938 Horton St",
             "street2":null,
             "city":"Emeryville",
             "state":"CA",
             "zip":"94608",
             "country":"US",
             "phone_number":null,
             "email":null,
             "is_residential":false,
             "is_warehouse":false,
             "address_type":null,
             "validated":false,
             "code":null
          }
        ]
      };
      buildStoreList(sampleData);
    });

  /**
   * Update map if preferred store is selected on load.
   * This probably needs to move.
   */
  if (STATE.pickupStore !== null) {
    document.querySelector(
      '.js-de-pickup-location-map-img'
    ).src = `//cdn.shopify.com/s/files/1/1752/4727/t/79/assets/${
      STATE.pickupStore
    }.jpg?v=3`;
  }

  /**
   * Add second Continue button for Pickup (straight to Payment)
   * Needs refactoring.
   */
  const paymentBtnCont = document.querySelector(
    '.js-de-payment-continue-container'
  );
  let paymentBtn = document.querySelector('.js-de-payment-continue');
  const paymentBtnHTML = paymentBtnCont.innerHTML;
  paymentBtnCont.removeChild(paymentBtn);
  continueBtn.insertAdjacentHTML('afterend', paymentBtnHTML);
  paymentBtn = document.querySelector('.js-de-payment-continue');

  paymentBtn.addEventListener('click', function(e) {
    e.preventDefault();
    updateCheckout();
  });
}

export default bindUI;
