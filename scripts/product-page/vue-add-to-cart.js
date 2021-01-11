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

        if (delivery.available > 1) {
          $('.js-de-stock-info-message').text('In Stock');
          $('.js-de-stock-info-message').addClass('in_stock').removeClass('low_stock');
        } else if (delivery.available == 1) {
          $('.js-de-stock-info-message').text('Low Stock');
          $('.js-de-stock-info-message').addClass('low_stock').removeClass('in_stock');
        } else {
          if (locationsAvailable > 0) {
            $('.js-de-stock-info-message').text('Pickup Only');
            $('.js-de-stock-info-message').addClass('low_stock').removeClass('in_stock');
          } else {
            $('.js-de-stock-info-message').text('');
            $('.js-de-stock-info-message').removeClass('low_stock').removeClass('in_stock');
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
          $('.js-de-stock-info-message').text('');
          return;
        }

        // Trying to add a product to cart when variant doesn't exist
        const variant = window.productJSON.variants.find(v => v.id === variantId);
        if (!variant) {
          event.preventDefault();
          validationTextEl.textContent = "Unavailable";
          $('.js-de-stock-info-message').text('');
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
