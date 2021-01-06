/* eslint-disable */

import $ from 'jquery';
import Vue from 'vue/dist/vue.esm.js';

const variantInventory = window.firstVariant;
variantInventory.tagged_bis_hidden = window.vars.productJSON.tags.includes('bis-hidden');

const initVueATC = () => {
  window.vueATC = new Vue({
    el: '#addToCartButton',
    data: variantInventory,
    methods: {
      changeWholeData(newData) {
        var extraData = {
          tagged_bis_hidden: window.vars.productJSON.tags.includes('bis-hidden')
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
        const { delivery, locations } = inventoryItem;

        //mutatedInventory.available = (delivery.inStock > 0 || locations.length > 0);

        return mutatedInventory;
      },
      showModal(variantId, isEmailButton) {
        if (isEmailButton) {
          window.BISPopover.show({ variantId: variantId });

          const BISPopoverEl = document.querySelector('#BIS_frame');
          const BISPopoverEmailInputEl = BISPopoverEl.contentDocument.querySelector('#email_address');
          const customer = window.Shopify.customer;

          if (BISPopoverEmailInputEl && customer) {
            BISPopoverEmailInputEl.value = customer.email;
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
