import {
  pickupToggleBtn,
  shipToggleBtn,
  continueBtn,
  pickupLocationList
} from './ui-elements';
import STATE from '../../state';
import { DELIVERY_METHODS } from '../../constants';
import updateUI from './update-ui';
import { enableInput } from '../../ui-helpers';
import { setObjectInLocalStorage } from '../../../utilities/storage';

const bindLocations = () => {
  const pickupLocations = document.querySelectorAll('.js-de-pickup-location');
  pickupLocations.forEach(location => {
    location.addEventListener('click', function(e) {
      if (this.classList.contains('js-de-active-location')) {
        console.log('already active');
      } else {
        const activeLocation = document.querySelector('.js-de-active-location');
        if (activeLocation !== null) {
          activeLocation.classList.remove('js-de-active-location');
        }
        this.classList.add('js-de-active-location');
        const pickupStore = this.getAttribute('data-id');
        STATE.pickupStore = pickupStore;
        setObjectInLocalStorage('pickup_store', pickupStore);
        document.querySelector(
          '.js-de-pickup-location-map-img'
        ).src = `//cdn.shopify.com/s/files/1/1752/4727/t/79/assets/${pickupStore}.jpg`;
      }

      // The "continue" button should be enabled if a store is selected.
      enableInput(continueBtn);
    });
  });
};

const buildStoreList = locations => {
  for (const location of locations.data) {
    let activeCard = false;
    if (location.id === STATE.pickupStore) {
      activeCard = true;
    }
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
    pickupLocationList.appendChild(locationNode);
  }
  bindLocations();
};

const bindUI = () => {
  /**
   * Bind the toggle buttons
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

  if (STATE.pickupStore !== null) {
    document.querySelector(
      '.js-de-pickup-location-map-img'
    ).src = `//cdn.shopify.com/s/files/1/1752/4727/t/79/assets/${
      STATE.pickupStore
    }.jpg`;
  }
};

export default bindUI;
