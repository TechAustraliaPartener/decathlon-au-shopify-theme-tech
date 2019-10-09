/* global CartJS, Shopify */

import $ from 'jquery';
import Vue from 'vue/dist/vue.esm.js';

let cartInit = false;
let invInit = false;

function addMasterStoresData(inventoryItem) {
  console.log(inventoryItem);
  for (let i = window.masterStores.length - 1; i >= 0; i--) {
    const masterLoc = window.masterStores[i];

    if (masterLoc.duplicate) {
      const alreadyAdded = inventoryItem.locations.find(obj => {
        return obj.name === masterLoc.name;
      });

      if (!alreadyAdded) {
        const thisLoc = inventoryItem.locations.find(obj => {
          return obj.name === masterLoc.duplicate;
        });

        if (thisLoc) {
          const duplicateLoc = JSON.parse(JSON.stringify(thisLoc));
          duplicateLoc.name = masterLoc.name;
          inventoryItem.locations.push(duplicateLoc);
        }
      }
    }
  }
}

function supplementCart(cart) {
  console.log(cart, invInit);

  for (let i = cart.items.length - 1; i >= 0; i--) {
    const item = cart.items[i];

    if (
      invInit[item.product_id] &&
      invInit[item.product_id].product.variants[item.variant_id]
    ) {
      const invItem =
        invInit[item.product_id].product.variants[item.variant_id]
          .inventoryItem;
      addMasterStoresData(invItem);
      item.locations = invItem.locations;
    }
  }

  return cart;
}

/**
 * Attach listeners to open collapse elements
 */
const initCartDisplay = cart => {
  window.cartDisplay = new Vue({
    el: '#cartDisplay',
    data: {
      cart: supplementCart(JSON.parse(JSON.stringify(cart))),
      masterStores: window.masterStores,
      favStore: window.vars.favStore || {},
      deliveryOption: window.vars.deliveryOption,
      override: false
    },
    methods: {
      changeWholeData(newData, part) {
        const changeData = part ? this.$data[part] : this.$data;
        Object.keys(changeData).forEach(key => (changeData[key] = null));
        Object.entries(newData).forEach(entry =>
          Vue.set(changeData, entry[0], entry[1])
        );

        if (this.$data.override) {
          $('.checkout-btn').click();
        }
      },
      money(price) {
        return `$${(price / 100).toFixed(2)}`;
      },
      updateQuantity(lineIndex, newQty) {
        console.log(lineIndex, newQty);
        CartJS.updateItem(lineIndex, newQty);
      },
      setFavStore(event) {
        const masterStore = window.masterStores.find(obj => {
          return obj.id === event.target.value;
        });

        if (masterStore) {
          localStorage.setItem('favoritedStore', JSON.stringify(masterStore));
          window.vars.favStore = JSON.parse(
            localStorage.getItem('favoritedStore')
          );
          this.changeWholeData(window.vars.favStore, 'favStore');
        }
      },
      setDeliveryOption(event) {
        localStorage.setItem('deliveryOption', event.target.value);
        window.vars.deliveryOption =
          localStorage.getItem('deliveryOption') || 'Delivery';
        this.$data.deliveryOption = window.vars.deliveryOption;
      },
      checkAvailability(item) {
        const app = this;

        let checkLoc = item.locations.find(obj => {
          return obj.name === 'Tempe';
        });

        if (app.deliveryOption !== 'Delivery') {
          checkLoc = item.locations.find(obj => {
            return obj.name === app.favStore.name;
          });
        }

        return checkLoc.inStock > 0 ? 'in' : 'out';
      },
      currentMax(item) {
        // Let availabilities = item.locations.map(a => a.available);
        // return Math.max(checkLoc);

        const app = this;

        let checkLoc = item.locations.find(obj => {
          return obj.name === 'Tempe';
        });

        if (app.deliveryOption !== 'Delivery') {
          checkLoc = item.locations.find(obj => {
            return obj.name === app.favStore.name;
          });
        }

        return checkLoc.available;
      },
      prepareCart(event) {
        const app = this;

        if (app.override) {
          return true;
        }

        const updateCartPayload = {};

        for (let i = app.cart.items.length - 1; i >= 0; i--) {
          const item = app.cart.items[i];
          const currentMax = app.currentMax(item);
          if (item.quantity > currentMax) {
            updateCartPayload[item.variant_id] = currentMax;
          }
        }

        if (JSON.stringify(updateCartPayload) === '{}') {
          return true;
        }
        event.preventDefault();

        console.log(updateCartPayload);
        CartJS.updateItemQuantitiesById(updateCartPayload, {
          success() {
            app.$data.override = true;
          }
        });

        return false;
      }
    }
  });
};

$(document).on('cart.ready', function(event, cart) {
  cartInit = cart;
  console.log('CART READY', event, cart);
  tryInit();
});

document.addEventListener('tomitLoaded', function() {
  window.tomitProductInventoryInfo
    .getProductsInventoryInformation(window.vars.tomitCartPayload)
    .then(function(inventory) {
      invInit = inventory;
      console.log('INV READY', inventory);
      tryInit();
    });
});

function tryInit() {
  if (cartInit && invInit) {
    initCartDisplay(cartInit);
  }
}

$(document).on('cart.requestComplete', function(event, cart) {
  window.cartDisplay.changeWholeData(supplementCart(cart), 'cart');
  $('.js-de-cart__subtotal').text(Shopify.formatMoney(cart.total_price));
  $('.afterpay-info strong').text(Shopify.formatMoney(cart.total_price / 4));
  $('#CartCount').text(cart.item_count);
});
