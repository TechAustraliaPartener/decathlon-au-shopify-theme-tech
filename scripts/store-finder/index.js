import Vue from 'vue/dist/vue.esm.js';
import { app } from './components/app';

new Vue({
  render: h => h(app)
}).$mount('#js-StoreFinder');
