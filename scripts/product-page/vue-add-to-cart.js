import $ from 'jquery';
import Vue from 'vue/dist/vue.esm.js';

const product = window.productJSON; 

const initVueATC = () => {
  window.vueATC = new Vue({
    el: '#addToCartButton',
    data: {},
    methods: {
      changeWholeData(newData) {
        var extraData = {
          state: newData.state || this.$data.state,
          collapsed: newData.collapsed || this.$data.collapsed,
          code: newData.code || this.$data.code
        }
        newData = { ...newData, ...extraData };
        Object.keys(this.$data).forEach(key => (this.$data[key] = null));
        Object.entries(newData).forEach(entry =>
          Vue.set(this.$data, entry[0], entry[1])
        );
      },
      changeVariant(variant) {
      }
    }
  });
};

/**
 * Put all functions that need to run on product-page load here
 */
export const init = () => {
  console.log('yepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyepyep');
  initVueATC();
};
