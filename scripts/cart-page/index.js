/* global CartJS, Shopify */

import $ from 'jquery';
import Vue from 'vue/dist/vue.esm.js';

function supplementCart(cart, inventory) {
  return inventory;
}

/**
 * Attach listeners to open collapse elements
 */
const initCartDisplay = cart => {
  window.cartDisplay = new Vue({
    el: '#cartDisplay',
    data: supplementCart(cart),
    methods: {
      changeWholeData(newData) {
        Object.keys(this.$data).forEach(key => (this.$data[key] = null));
        Object.entries(newData).forEach(entry =>
          Vue.set(this.$data, entry[0], entry[1])
        );
      },
      money(price) {
        return `$${(price / 100).toFixed(2)}`;
      },
      updateQuantity(lineIndex, newQty) {
        console.log(lineIndex, newQty);
        CartJS.updateItem(lineIndex, newQty);
      }
    }
  });
};

let cartReady = false;
let invReady = false;

$(document).on('cart.ready', function(event, cart) {
  cartReady = true;
  console.log('CART READY', event, cart);
  tryInit();
});

document.addEventListener('tomitLoaded', function(inventory) {
  window.tomitProductInventoryInfo
    .getProductsInventoryInformation(window.vars.tomitCartPayload)
    .then(function(e, data) {
      invReady = true;
      console.log('INV READY', inventory);
      tryInit();
    });
});

function tryInit() {
  if (cartReady && invReady) {
    initCartDisplay(CartJS.cart);
  }
}

$(document).on('cart.requestComplete', function(event, cart) {
  window.cartDisplay.changeWholeData(supplementCart(cart));
  $('.js-de-cart__subtotal').text(Shopify.formatMoney(cart.total_price));
  $('.afterpay-info strong').text(Shopify.formatMoney(cart.total_price / 4));
  $('#CartCount').text(cart.item_count);
});
