import {
  pickupToggleBtn,
  shipToggleBtn,
  continueBtn,
  pickupLocationList
} from './ui-elements';
import STATE from '../../state';
import { DELIVERY_METHODS } from '../../constants';
import updateUI from './update-ui';
import { setObjectInLocalStorage } from '../../../utilities/storage';

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
        ).src = `//cdn.shopify.com/s/files/1/1752/4727/t/79/assets/${pickupStore}.jpg?v=2`;
      }
    });
  });
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
    locationNode.innerHTML = `<div class="js-de-pickup-location de-pickup-location${
      activeCard ? ' js-de-active-location' : ''
    }" data-id="${location.id}">
      <span class="de-pickup-location-name">${location.name}</span>
      <span>${location.street1} ${
      location.street2 === null ? '' : location.street2
    }</span>
      <span>${location.city}, ${location.state} ${location.zip}</span>
      <span class="de-pickup-location-hours">9:00 AM - 8:00 PM | Mon-Sun</span>
    </div>`;

    // Insert card
    pickupLocationList.appendChild(locationNode);
  }

  // Now that the cards are built, bind onclick functionality
  bindLocations();
};

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

  // Fetch pickup locations from ShipHawk
  fetch('https://decathlon-proxy.herokuapp.com/api/shiphawk')
    .then(res => res.json())
    .then(data => {
      buildStoreList(data);
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
    }.jpg?v=2`;
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
  });
};

export default bindUI;
