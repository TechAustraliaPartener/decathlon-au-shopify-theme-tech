/* global CartJS, Shopify */

import $ from 'jquery';
import Vue from 'vue/dist/vue.esm.js';

Vue.config.errorHandler = (err, vm, info) => {
  var cart = CartJS.cart || window.vars.cartPayload;
  var logCart = {
    attributes: cart.attributes,
    item_count: cart.item_count,
    token: cart.token,
    items: cart.items.map(item => {
      return {
        title: item.title,
        handle: item.handle,
        product_id: item.product_id,
        variant_id: item.variant_id,
        variant_options: item.variant_options,
        url: item.url,
      }
    })
  }

  console.log('Vue error', err);
  Rollbar.error("Vue error", {
    'err': err,
    'cart': JSON.stringify(logCart)
  }, function(err, data) {
    if (err) {
      console.log("Error while reporting error to Rollbar: ", err);
    } else {
      console.log("Error successfully reported to Rollbar. UUID:", data.result.uuid);
    }
  });
  if (window.location.pathname === '/cart') {
    console.log({
      'event': 'cart_clear',
      'cart': CartJS.cart || window.vars.cartPayload,
      'err': err,
      'vm': vm,
      'info': info
    });
    Rollbar.error("Cart clear triggered", {
      'cart': JSON.stringify(logCart),
      'err': err,
      'vm': vm,
      'info': info
    }, function(err, data) {
      if (err) {
        console.log("Error while reporting error to Rollbar: ", err);
      } else {
        console.log("Error successfully reported to Rollbar. UUID:", data.result.uuid);
      }
      CartJS.clear({ success: function() {
        window.location.reload();
      }});
    });
  }
}

let cartInit = false;
let invInit = false;

const storesSort = window.masterStores.map(a => a.name);

const emptyLoc = name => {
  let empty = {
    available: 0,
    distance: 0,
    id: "0",
    inStock: 0,
    name: name,
    pickupOption: false  
  };
  return empty;
}

const emptyInventoryItem = window.masterStores.map(store => {
  return emptyLoc(store.name);
});

function addMasterStoresData(inventoryItem, item) {
  inventoryItem.locations = inventoryItem.locations.filter(loc => {
    return storesSort.indexOf(loc.name) !== -1;
  });

  var locs = inventoryItem.locations;
  var onlineInventoryLocs = locs.filter(loc => window.onlineInventoryStores.indexOf(loc.name) !== -1);
  var onlineInventoryItem;

  if (onlineInventoryLocs.length > 0) {
    var totalAvailable = onlineInventoryLocs.map(loc => loc.available).reduce((a, b) => a + b, 0);

    onlineInventoryItem = {
      name: 'Delivery',
      available: totalAvailable,
      inStock: totalAvailable > 0 ? 1 : 0,
      hours: '2-6 day delivery in Metro areas',
      availability: {
        class: totalAvailable > 2 ? 'in' : (totalAvailable > 0 ? 'low' : 'out'),
        text: totalAvailable > 2 ? 'In Stock' : (totalAvailable > 0 ? 'Low Stock' : 'Out of Stock')
      },
      ready: totalAvailable > 0 ? 'Available for delivery' : 'Unavailable for delivery'
    }
  } else {
    onlineInventoryItem = {
      name: 'Delivery',
      ready: 'Unavailable for delivery',
      availability: {
        class: 'out',
        text: 'Out of Stock'
      },
      hours: '2-6 day delivery in Metro areas'
    }
  }

  inventoryItem.delivery = onlineInventoryItem;

  console.log(inventoryItem, item);
  const duplicateStores = window.masterStores.filter(loc => {
    return loc.duplicate;
  });

  duplicateStores.forEach(loc => {
    const alreadyAdded = inventoryItem.locations.find(obj => {
      return obj.name === loc.name;
    });

    if (!alreadyAdded) {
      const thisLoc = inventoryItem.locations.find(obj => {
        return obj.name === loc.duplicate;
      });

      if (thisLoc && (thisLoc.name !== 'Genesis' && item.grams <= 22000)) {
        const duplicateLoc = JSON.parse(JSON.stringify(thisLoc));
        duplicateLoc.name = loc.name;
        inventoryItem.locations.push(duplicateLoc);
      }
    }
  });

  for (var i = window.masterStores.length - 1; i >= 0; i--) {
    const masterLoc = window.masterStores[i];

    let alreadyAdded = inventoryItem.locations.find(obj => {
      return obj.name === masterLoc.name;
    });

    if (!alreadyAdded) {
      inventoryItem.locations.push(emptyLoc(masterLoc.name));
    }
  }

  //inventoryItem.locations = inventoryItem.locations.filter(loc => window.ccStores.indexOf(loc.name) !== -1);
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
      addMasterStoresData(invItem, item);
      item.delivery = invItem.delivery;
      item.locations = invItem.locations;
    } else {
      console.log(i, 'No locations info for ' + item.title);

      Rollbar.warning("Empty Inventory Item assigned", {
        'title': item.title,
        'product_id': item.product_id,
        'variant_id': item.variant_id,
        'url': item.url
      });

      item.locations = JSON.parse(JSON.stringify(emptyInventoryItem));
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
      pickupStores: window.masterStores.filter(loc => window.ccStores.indexOf(loc.name) !== -1),
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
          // TODO: Remove timeout and lock onto re-render
          setTimeout(function() {
            $('.checkout-btn').click();
          }, 300);
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

          localStorage.setItem('deliveryOption', 'Click & Collect');
          window.vars.deliveryOption =
            localStorage.getItem('deliveryOption') || 'Delivery';
          this.$data.deliveryOption = window.vars.deliveryOption;
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

        if (!item.locations) {
          return 'out';
        }

        let checkLoc = item.delivery;

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

        let checkLoc = item.delivery;

        if (app.deliveryOption !== 'Delivery') {
          checkLoc = item.locations.find(obj => {
            return obj.name === app.favStore.name;
          });
        }

        return checkLoc.available;
      },
      cartModificationsMessage() {
        const app = this;
        const items = app.$data.cart.items;
        let itemsToRemove = 0;

        for (let i = items.length - 1; i >= 0; i--) {
          const item = items[i];

          let checkLoc = item.delivery;

          if (app.deliveryOption !== 'Delivery') {
            checkLoc = item.locations.find(obj => {
              return obj.name === app.favStore.name;
            });
          }

          if (checkLoc.inStock < 1) {
            itemsToRemove++;
          }
        }

        if (itemsToRemove > 0) {
          return `${itemsToRemove} ${
            itemsToRemove > 1 ? 'items' : 'item'
          } unavailable for ${
            app.deliveryOption
          } will be removed from your cart`;
        }

        return '';
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

        CartJS.updateItemQuantitiesById(updateCartPayload, {
          success() {
            app.$data.override = true;
          }
        });

        return false;
      }
    }
  });
  $('.de-u-fade').addClass('in');
  $('#cartSpinner').addClass('de-u-hidden');
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
