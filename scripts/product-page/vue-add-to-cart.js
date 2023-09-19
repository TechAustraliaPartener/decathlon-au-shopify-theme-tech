/* eslint-disable */

import $ from 'jquery';
import Vue from 'vue/dist/vue.esm.js';
import { 
  checkIfVariantIsAllowedToOversell,
  checkIfVariantIsNonInventory
} from './product-data';
import { PRODUCT_PAGE_COPY } from './constants';

const validationTextEl = document.querySelector('.js-de-validation-message');
const variantInventory = window.firstVariant;

variantInventory.available_across_all = window.productJSON.available;
variantInventory.tagged_bis_hidden = window.vars.productJSON.tags.includes('bis-hidden');
variantInventory.is_size_selected = false;
variantInventory.artificially_unavailable = false;
variantInventory.isDisabled = false
variantInventory.totalAvailableQuantity = 0;



const translations = window.translations.product_stock;
const LOADING_CLASS = 'loading';
const IN_STOCK_CLASS = 'in_stock';
const LOW_STOCK_CLASS = 'low_stock';
const OVERSELL_CLASS = 'oversell';
const addToCartDrawerEnabled = window.add_to_cart_drawer_enabled;

// Tracker of variant quantity
window.variantQtyTracker = {};

window.variantQtyTrackOutOfStock = [];

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
      changeVariant(variant, source) {
        const variantInventory = window.productJSON.variants.find(v => v.id === variant);


        // Use Shopify availability on load while remote inventory is being loaded
        if( window.clickCollectVersion === 'v1'){
          if (variantInventory && variantInventory.available) {
            // console.log('variantInventory', variantInventory);

            $('.js-de-stock-info-message .message').text(translations.retrieving_stock);
            $('.js-de-stock-info-message').addClass(LOADING_CLASS).css({"display":"block"});
            $('.js-de-stock-info-message .lds-ring').css({"display":"inline-block"});
            // Disable add to cart button while retrieving stocks
            $('#AddToCart').prop('disabled', true);
          }
        }

        const variantLocationsInventory = (window.inventories || {})[variant];


        const calculatedInventory = variantLocationsInventory ? this.mutateWithLocations(variantInventory, variantLocationsInventory, source) : variantInventory;
        

        this.changeWholeData(calculatedInventory);
        
        console.log('data', calculatedInventory, this.$data);

        this.$forceUpdate();
      },
      mutateWithLocations(variantInventory, variantLocationsInventory, source) {
        var mutatedInventory = variantInventory;
        var vueData = this.$data;

        const { inventoryItem, id } = variantLocationsInventory;
        const variantId = id;
        const { delivery, locations, online } = inventoryItem;

        // Oversell flags
        const variantIsAllowedToOversell = checkIfVariantIsAllowedToOversell(variantId);
        // Non-inventory flags
        const variantIsNonInventory = checkIfVariantIsNonInventory(variantId);


        /*
          'locations' from itemInventory already only account for stores which have Click & Collect enabled in Settings
          This checks whether the specific product is available in any of those locations, or in delivery/online and sets availability accordingly.
        */

        // Filter locations that have at least one available product in stock
        const filteredOnline = online.filter(item => {
          return +(item.available);
        });

        const onlineStoresList = filteredOnline.map((store) => {
          return store.name
        });

        let filteredLocations = locations.filter(loc => {
          // Location is greater than 0 and location is not yet registered in online stores list
          return +(loc.available) && !onlineStoresList.includes(loc.name);
        });

        // console.log('cdebug 0', online, onlineStoresList, filteredLocations);

        let totalAvailableQuantity = filteredOnline.reduce(function(total, location) {
          return total + +location.available
        }, 0);

        // console.log('cdebug 01', totalAvailableQuantity);

        totalAvailableQuantity = filteredLocations.reduce(function(total, location) {
          return total + +location.available
        }, totalAvailableQuantity);

        // console.log('cdebug 02', totalAvailableQuantity);

        if(variantId in window.variantQtyTracker) {
          totalAvailableQuantity = window.variantQtyTracker[variantId]
        } else {
          window.variantQtyTracker[variantId] = totalAvailableQuantity;
        }

        mutatedInventory.totalAvailableQuantity = totalAvailableQuantity;

        if(totalAvailableQuantity <= 0) {
          delivery.available == totalAvailableQuantity
        }

        // console.log('cdebug 1', variantId, locations, filteredLocations, filteredOnline, totalAvailableQuantity);

        // item is available if there is at least one stock in any location or delivery/online
        // mutatedInventory.available = (delivery.available > 0 || filteredLocations.length > 0 || filteredOnline.length > 0);
        mutatedInventory.available = (
          filteredLocations.length > 0 && totalAvailableQuantity > 0 || 
          delivery.available > 0 && totalAvailableQuantity > 0 || 
          (delivery.available === 0 && variantIsAllowedToOversell === true) ||
          variantIsNonInventory === true
        );
        mutatedInventory.artificially_unavailable = (locations.length < 1 && delivery.available < 1);



        if( window.clickCollectVersion === 'v1') {
          if (filteredLocations.length < 1 && 
            delivery.available < 1 && 
            (delivery.available === 0 && variantIsAllowedToOversell === false) &&
            variantIsNonInventory === false
          ) {
            $('.js-de-validation-message').text('Out of stock');
          }
        }

        const availablePerLocation = filteredLocations.map(location => {
          return location.available;
        });

        // console.log('cdebug', availablePerLocation)

        let locationsAvailable = 0;
        if (availablePerLocation.length > 0) {
          locationsAvailable = availablePerLocation.reduce((a, b) => +a + +b, 0);
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
          // console.log('cdebug', 'case 2')

          stockInfoMessage = translations.low_stock;
          stockAddClass = LOW_STOCK_CLASS;
          stockRemoveClass = IN_STOCK_CLASS;
        } else if (delivery.available === 0 && variantIsAllowedToOversell) {
          stockInfoMessage = `<span>${translations.oversell_available}</span> <span>${translations.oversell_eta}</span>`;
          stockAddClass = OVERSELL_CLASS;
          stockRemoveClass = IN_STOCK_CLASS;

          // Update locations inventory delivery data
          delivery.ready = translations.oversell_available;
          delivery.availability.class = 'in';
          delivery.availability.text = translations.oversell_eta

          // Check if variant is available in at least one location for c&c
          if (variantLocationsInventory.inventoryItem) {
            const { locations } = variantLocationsInventory.inventoryItem
            const availableLocs = locations.filter(({ available }) => parseInt(available) > 0)
            if (availableLocs.length > 0) {
              stockInfoMessage += `<span>${translations.oversell_click_and_collect}<span>`;
            }
          }
        } else if (variantIsNonInventory) {
          console.log('stockInfoMessage', 'check 4')
          stockInfoMessage = translations.in_stock;
          stockAddClass = IN_STOCK_CLASS;
          stockRemoveClass = LOW_STOCK_CLASS;
          // Update locations inventory delivery data
          delivery.ready = translations.oversell_available;
          delivery.availability.class = 'in';
          delivery.availability.text = translations.in_stock
        } else {
          // If variant is NOT in stock for delivery but available in locations offering Click & Collect
          if (window.productJSON.available && locationsAvailable > 0 && totalAvailableQuantity > 0) {
            stockInfoMessage = translations.pickup_only;
            stockAddClass = LOW_STOCK_CLASS;
            stockRemoveClass = IN_STOCK_CLASS;
          }
        }


        // console.log('cdebug', window.productJSON.available, locationsAvailable, totalAvailableQuantity)


        // Gift card availability message override
        if (window.vars.productJSON.gift_card === true && // product is a gift card
          window.vars.gift_card_availability_message && // gift card availability message is enabled
          (delivery.available > 0 || stockAddClass == OVERSELL_CLASS) // is available or overselling
        ) {
          stockInfoMessage = window.vars.gift_card_availability_message;
          delivery.availability.text = window.vars.gift_card_availability_message;
          stockAddClass = IN_STOCK_CLASS;
          stockRemoveClass = LOW_STOCK_CLASS;
        }

        // Do not remove disabled if product is tagged bis-hidden
        if(!this.$data.tagged_bis_hidden) {
          // Enable add to cart button once stock data has been retrieve
          $('#AddToCart').prop('disabled', false);
        } else if(window.productJSON.available) {
          $('#AddToCart').prop('disabled', false);
        }



        $('.js-de-stock-info-message .message').html(stockInfoMessage);
        $('.js-de-stock-info-message').addClass(stockAddClass).removeClass(stockRemoveClass).removeClass(LOADING_CLASS);

        if ($('.js-de-stock-info-message .message').text().length > 0) {
          $('.js-de-stock-info-message').css({"display":"block"});
        } else {
          $('.js-de-stock-info-message').css({"display":"none"});
        }

        $('.js-de-stock-info-message .lds-ring').css({"display":"none"});


        // Override messaging and button state to make way for products already maximized in the user's cart
        window.setTimeout(() => {

          // console.log('cdebug', variantIsAllowedToOversell, variantIsNonInventory, variantId, mutatedInventory )
          // console.log('cdebug', this.$data);

          if((!variantIsAllowedToOversell ||
            !variantIsNonInventory) 
            && variantId in window.variantQtyTracker 
            && !mutatedInventory.available 
            &&  window.variantQtyTrackOutOfStock.includes(+variantId)) {
              // console.log('cdebug', 'hey this is firing.')

              $('#AddToCart').prop('disabled', true);
              $('#AddToCart span').text('Add to Cart');
              $('.js-de-stock-info-message').css({"display":"none"});
              $('.js-de-validation-message').text(PRODUCT_PAGE_COPY.ALL_AVAILABLE_PRODUCTS_IN_CART);
          } else if(window.productJSON.available && mutatedInventory.available && !mutatedInventory.is_size_selected) {
            $('#AddToCart span').text('Add to Cart');
            $('#AddToCart').prop('disabled', false);
            // console.log('cdebug', 'hey this is firing. 2')

          } else if(!mutatedInventory.available && window.vars.productJSON.tags.includes('bis-hidden')) {
            $('#AddToCart span').text('Out of Stock');
            $('#AddToCart').prop('disabled', true);
            
            // console.log('cdebug', 'hey this is firing. 3')
          } else if (!mutatedInventory.available && !window.vars.productJSON.tags.includes('bis-hidden')) {

            $('.js-de-validation-message').text(PRODUCT_PAGE_COPY.OUT_OF_STOCK);
            $('#AddToCart span').text('Email me when available');
            $('#AddToCart').prop('disabled', false);
            // console.log('cdebug', 'hey this is firing. 4')
            
          } else if(!mutatedInventory.available && mutatedInventory.artificially_unavailable) {
            $('#AddToCart span').text('Out of Stock');
            $('#AddToCart').prop('disabled', true);
            
            // console.log('cdebug', 'hey this is firing. 5')
          } else if(!mutatedInventory.available) {
            $('#AddToCart span').text('Out of Stock');
            $('#AddToCart').prop('disabled', true);

            // console.log('cdebug', 'hey this is firing. 6')
          }

        }, 10);

        // If the WHOLE product, regardless of variant is not available and even if there are available
        // locations and available quantity
        if((!window.productJSON.available || totalAvailableQuantity <= 0) && (!variantIsAllowedToOversell || !variantIsNonInventory)) {
          $('.js-de-stock-info-message').css({"display":"none"});
        }


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

          // console.log('cdebug', variantId, isEmailButton, event)

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
