/* eslint-disable */

import $ from 'jquery';
import Vue from 'vue/dist/vue.esm.js';

const validationTextEl = document.querySelector('.js-de-validation-message');
const variantInventory = window.firstVariant;
variantInventory.tagged_bis_hidden = window.vars.productJSON.tags.includes('bis-hidden');
variantInventory.is_size_selected = false;

const initVueATC = () => {
  window.vueATC = new Vue({
    el: '#addToCartButton',
    data: variantInventory,
    methods: {
      changeWholeData(newData) {
        var extraData = {
          tagged_bis_hidden: window.vars.productJSON.tags.includes('bis-hidden'),
          is_size_selected: newData && newData.option2 ? true : false
        }
        newData = { ...newData, ...extraData };
        Object.keys(this.$data).forEach(key => (this.$data[key] = null));
        Object.entries(newData).forEach(entry =>
          Vue.set(this.$data, entry[0], entry[1])
        );
      },
      changeVariant(variant) {
        const variantInventory = window.productJSON.variants.find(v => v.id === variant);

        const variantLocationsInventory = (window.inventories || {})[variant];
        const calculatedInventory = variantLocationsInventory ? this.mutateWithLocations(variantInventory, variantLocationsInventory) : variantInventory;

        this.changeWholeData(calculatedInventory);
      },
      mutateWithLocations(variantInventory, variantLocationsInventory) {
        var mutatedInventory = variantInventory;

        const { inventoryItem } = variantLocationsInventory;
        const { delivery, locations, online } = inventoryItem;

        /*
          'locations' from itemInventory already only account for stores which have Click & Collect enabled in Settings
          This checks whether the specific product is available in any of those locations, or in delivery/online and sets availability accordingly.
        */

        // Filter locations that have at least one available product in stock
        const filteredLocations = locations.filter(loc => {
          return loc.available > 0;
        });

        const filteredOnline = online.filter(item => {
          return item.available > 0;
        });

        // item is available if there is at least one stock in any location or delivery/online
        // mutatedInventory.available = (delivery.available > 0 || filteredLocations.length > 0 || filteredOnline.length > 0);
        mutatedInventory.available = filteredLocations.length > 0;

        const availablePerLocation = filteredLocations.map(location => {
          return location.available;
        });

        let locationsAvailable = 0;

        if (availablePerLocation.length > 0) {
          locationsAvailable = availablePerLocation.reduce((a, b) => a + b, 0);
        }

        let onlineAvailable = 0;

        const availableOnline = filteredOnline.map(online => {
          return online.available;
        });

        if (availableOnline.length > 0) {
          onlineAvailable = availableOnline.reduce((a, b) => a + b, 0);
        }

        console.log('AVAILABLE IN CLICK & COLLECT');
        console.log(locationsAvailable);
        console.log('AVAILABLE ONLINE');
        console.log(onlineAvailable);

        if (onlineAvailable > 1) {
          console.log('greater than 1');
          validationTextEl.textContent = "In Stock";
        } else if (onlineAvailable == 1) {
          console.log('equal to 1');
          validationTextEl.textContent = "Low Stock";
        } else {
          console.log('online is 0');
          if (locationsAvailable > 0) {
            console.log('BUT HAS PICKUP!');
            validationTextEl.textContent = "Pick Up Only";
          }
        }

        return mutatedInventory;
      },
      showModal(variantId, isEmailButton, event) {
        $('.js-de-Drawer-toggle').data("drawer-action", '')
        // Trying to add a product to cart without selecting a size
        if (!this.$data.is_size_selected) {
          event.preventDefault();
          validationTextEl.textContent = "Select a size";
          return;
        }

        // Trying to add a product to cart when variant doesn't exist
        const variant = window.productJSON.variants.find(v => v.id === variantId);
        if (!variant) {
          event.preventDefault();
          validationTextEl.textContent = "Unavailable";
          return;
        }

        // Opens Back in Stock Popover Modal
        if (isEmailButton) {
          event.preventDefault();
          window.BISPopover.show({ variantId: variantId });

          $('#addToCartButton .js-de-Drawer-toggle').attr("data-drawer-action", '');

          const BISPopoverEl = document.querySelector('#BIS_frame');
          const BISPopoverEmailInputEl = BISPopoverEl.contentDocument.querySelector('#email_address');
          const customer = window.Shopify.customer;

          if (BISPopoverEmailInputEl && customer) {
            BISPopoverEmailInputEl.value = customer.email;
          }

          return;
        } else {
          $('#addToCartButton .js-de-Drawer-toggle').attr("data-drawer-action", 'open');
        }
      }
    }
  });
};

/**
 * Put all functions that need to run on product-page load here
 */
export const init = () => {
  initVueATC();
};
