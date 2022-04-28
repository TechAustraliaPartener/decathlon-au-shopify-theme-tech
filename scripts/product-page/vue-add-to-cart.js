/* eslint-disable */

import $ from 'jquery';
import Vue from 'vue/dist/vue.esm.js';

const validationTextEl = document.querySelector('.js-de-validation-message');
const variantInventory = window.firstVariant;
variantInventory.tagged_bis_hidden = window.vars.productJSON.tags.includes('bis-hidden');
variantInventory.is_size_selected = false;
variantInventory.artificially_unavailable = false;

const translations = window.translations.product_stock;
const LOADING_CLASS = 'loading';
const IN_STOCK_CLASS = 'in_stock';
const LOW_STOCK_CLASS = 'low_stock';
const addToCartDrawerEnabled = window.add_to_cart_drawer_enabled;

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

        // Use Shopify availability on load while remote inventory is being loaded
        if (variantInventory && variantInventory.available) {
          $('.js-de-stock-info-message .message').text(translations.retrieving_stock);
          $('.js-de-stock-info-message').addClass(LOADING_CLASS).css({"display":"block"});
          $('.js-de-stock-info-message .lds-ring').css({"display":"inline-block"});
          // Disable add to cart button while retrieving stocks
          $('#AddToCart').prop('disabled', true);
        }

        const variantLocationsInventory = (window.inventories || {})[variant];
        const calculatedInventory = variantLocationsInventory ? this.mutateWithLocations(variantInventory, variantLocationsInventory) : variantInventory;

        this.changeWholeData(calculatedInventory);
      },
      mutateWithLocations(variantInventory, variantLocationsInventory) {
        var mutatedInventory = variantInventory;

        const { inventoryItem } = variantLocationsInventory;
        const { delivery, locations, online } = inventoryItem;

        // Oversell flags
        const oversellThreshold = window.productOversellThreshold * -1;
        const variantWithInventoryData = window.variantsWithInventoryData.find(({ id }) => id == variant.id);
        const inventoryQuantity = variantWithInventoryData ? variantWithInventoryData.inventory_quantity : undefined;
        const inventoryPolicy = variantWithInventoryData ? variantWithInventoryData.inventory_policy : undefined;
        const variantIsAllowedToOversell = inventoryPolicy === 'continue' && inventoryQuantity > oversellThreshold;
        // console.log({ variantIsAllowedToOversell, inventoryPolicy, inventoryQuantity, oversellThreshold })
        
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
        mutatedInventory.available = (filteredLocations.length > 0 || delivery.available > 0 || variantIsAllowedToOversell);
        mutatedInventory.artificially_unavailable = (locations.length < 1 && delivery.available < 1);

        if (filteredLocations.length < 1 && 
          delivery.available < 1 && 
          variantIsAllowedToOversell === false
        ) {
          $('.js-de-validation-message').text('Out of stock');
        }

        const availablePerLocation = filteredLocations.map(location => {
          return location.available;
        });
        let locationsAvailable = 0;
        if (availablePerLocation.length > 0) {
          locationsAvailable = availablePerLocation.reduce((a, b) => a + b, 0);
        }

        let stockInfoMessage = '';
        let stockAddClass = '';
        let stockRemoveClass = '';

        // If variant is in stock for delivery in locations contributing to online inventory
        if (delivery.available > 2) {
          stockInfoMessage = translations.in_stock;
          stockAddClass = IN_STOCK_CLASS;
          stockRemoveClass = LOW_STOCK_CLASS;
        } else if (delivery.available <= 2 && delivery.available > 0) {
          stockInfoMessage = translations.low_stock;
          stockAddClass = LOW_STOCK_CLASS;
          stockRemoveClass = IN_STOCK_CLASS;
        } else if (variantIsAllowedToOversell) {
          stockInfoMessage = translations.oversell;
          stockAddClass = LOW_STOCK_CLASS;
          stockRemoveClass = IN_STOCK_CLASS;
        } else {
          // If variant is NOT in stock for delivery but available in locations offering Click & Collect
          if (locationsAvailable > 0) {
            stockInfoMessage = translations.pickup_only;
            stockAddClass = LOW_STOCK_CLASS;
            stockRemoveClass = IN_STOCK_CLASS;
          }
        }

        // Enable add to cart button once stock data has been retrieve
        $('#AddToCart').prop('disabled', false);

        $('.js-de-stock-info-message .message').text(stockInfoMessage);
        $('.js-de-stock-info-message').addClass(stockAddClass).removeClass(stockRemoveClass).removeClass(LOADING_CLASS);

        if ($('.js-de-stock-info-message .message').text().length > 0) {
          $('.js-de-stock-info-message').css({"display":"block"});
        } else {
          $('.js-de-stock-info-message').css({"display":"none"});
        }

        $('.js-de-stock-info-message .lds-ring').css({"display":"none"});

        return mutatedInventory;
      },
      showModal(variantId, isEmailButton, event) {
        $('.js-de-Drawer-toggle').data("drawer-action", '')
        // Trying to add a product to cart without selecting a size
        if (!this.$data.is_size_selected) {
          event.preventDefault();
          validationTextEl.textContent = "Select a size";
          $('.js-de-stock-info-message .message').text('');
          return;
        }

        // Trying to add a product to cart when variant doesn't exist
        const variant = window.productJSON.variants.find(v => v.id === variantId);
        if (!variant) {
          event.preventDefault();
          validationTextEl.textContent = "Unavailable";
          $('.js-de-stock-info-message .message').text('');
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
          if (addToCartDrawerEnabled) {
            $('#addToCartButton .js-de-Drawer-toggle').attr("data-drawer-action", 'open');
          }
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
