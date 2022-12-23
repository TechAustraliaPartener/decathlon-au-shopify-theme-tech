import $ from 'jquery';
import Vue from 'vue/dist/vue.esm.js';
import pushStockInfoToDataLayer from './datalayer-stock-info';

// Const product = productJSON; 

const demoInventory = {
  id: 'demo',
  locations: [],
  stateLocations: [],
  delivery: {},
  favStore: window.vars.favStore,
  state: null,
  code: JSON.parse(localStorage.getItem('state_code')) || null,
  collapsed: true
};

const emptyData = {
  favStore: window.vars.favStore
};

window.translations = window.translations || {};

const productStockTranslations = window.translations.product_stock;

const storesSort = window.masterStores.map(a => a.name);

const militaryTo12hFormat = time => {
  const militaryHours = Number(time.substring(0, 2));
  const militaryMinutes = time.substring(2, 4);
  const hours = ((militaryHours + 11) % 12) + 1;
  const amOrPm = (militaryHours < 12 || militaryHours === 24) ? 'am' : 'pm';
  return `${hours}:${militaryMinutes}${amOrPm}`;
}

function addMasterStoresData(inventoryItem, state) {
  inventoryItem.locations = inventoryItem.locations.filter(loc => {
    return storesSort.indexOf(loc.name) !== -1;
  });

  var onlineItem = inventoryItem.locations.filter(function (store) {
    return window.onlineInventoryStores.indexOf(store.name) !== -1;
  });

  inventoryItem.online = onlineItem;

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

      if (thisLoc) {
        const duplicateLoc = JSON.parse(JSON.stringify(thisLoc));
        duplicateLoc.name = loc.name;
        inventoryItem.locations.push(duplicateLoc);
      }
    }
  });

  for (let i = window.masterStores.length - 1; i >= 0; i--) {
    const masterLoc = window.masterStores[i];

    const thisLoc = inventoryItem.locations.find(obj => {
      return obj.name === masterLoc.name;
    });

    // Check the current weekday to show Genesus store hours on product page
    var weekday = new Date().getDay();
    var openHour = masterLoc['hours_' + (masterLoc.is_same_hours_weekly ? 0 : weekday) + '_open'];
    var closeHour = masterLoc['hours_' + (masterLoc.is_same_hours_weekly ? 0 : weekday) + '_close'];

    const tomorrowOpenHour = masterLoc['hours_' + (masterLoc.is_same_hours_weekly ? 0 : (weekday + 1 === 7 ? 0 : weekday + 1)) + '_open'];
    const tomorrowCloseHour = masterLoc['hours_' + (masterLoc.is_same_hours_weekly ? 0 : (weekday + 1 === 7 ? 0 : weekday + 1)) + '_close'];

    if (openHour === '0000' && closeHour === '0000' && !(tomorrowOpenHour === '0000' && tomorrowCloseHour === '0000')) {
      var weekday = weekday + 1;
      if (weekday > 6) {
        var weekday = 0;
      }
      var openHour = masterLoc['hours_' + weekday + '_open'];
      var closeHour = masterLoc['hours_' + weekday + '_close'];
      //console.log(weekday);
    }

    // Create abbreviation for each weekday & get the abbreviation for the current day
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (var d = 0; d < 7; d++) {
      var day = days[d];
      if (weekday === d) {
        var nameDay = day;
      }
    }

    if (thisLoc) {
      thisLoc.title = masterLoc.title;

      // Exclude products by tags set in section settings
      const productTags = window.vars.productJSON.tags;
      const { tag_exclusion_1, tag_exclusion_message_1, tag_exclusion_2, tag_exclusion_message_2, tag_exclusion_3, tag_exclusion_message_3, tag_exclusion_4, tag_exclusion_message_4, tag_exclusion_5, tag_exclusion_message_5 } = masterLoc;
      const tagExclusions = [tag_exclusion_1, tag_exclusion_2, tag_exclusion_3, tag_exclusion_4, tag_exclusion_5];
      const tagExclusionMessages = [tag_exclusion_message_1, tag_exclusion_message_2, tag_exclusion_message_3, tag_exclusion_message_4, tag_exclusion_message_5]

      const excludedTag = tagExclusions.findIndex(tag => productTags.indexOf(tag) !== -1);

      if (excludedTag !== -1) {
        thisLoc.available = 0;
      }
      
      const excludedMessage = tagExclusionMessages[excludedTag];
      // Exclusion

      if (thisLoc.available > 0) {
        thisLoc.ready = '<span>' + masterLoc.ready + '</span>';
      } else {
        thisLoc.ready = '<span>Unavailable</span>';
      }

      if (thisLoc.available > 2) {
        thisLoc.availability = {
          class: 'in',
          text: 'In Stock'
        };
      } else if (thisLoc.available > 0) {
        thisLoc.availability = {
          class: 'low',
          text: 'Low Stock'
        };
      } else {
        thisLoc.availability = {
          class: 'out',
          text: 'Out of Stock',
          ...excludedMessage && { excludedMessage: excludedMessage }
        };
      }

      var variantWeight = window.vars.selectedVariant.weight;
      // If a product weight is higher than 22kg, then the item not available for C&C at Genesis store
      if ((thisLoc.name === 'Genesis') && (variantWeight >= 22000)) {
        thisLoc.availability = {
          class: 'out',
          text: 'Out of Stock'
        };
      }

      var formattedOpenHour = militaryTo12hFormat(openHour);
      var formattedCloseHour = militaryTo12hFormat(closeHour);

      thisLoc.is_same_hours_weekly = masterLoc.is_same_hours_weekly;

      const hoursDisplay = 
        formattedOpenHour === formattedCloseHour ? 
          `Closed ${ thisLoc.is_same_hours_weekly ? '' : nameDay }`
        : 
          `${ thisLoc.is_same_hours_weekly ? 
              'Open' 
            : 
              nameDay 
            } ${ formattedOpenHour } - ${ formattedCloseHour }`;

      thisLoc.hours = hoursDisplay;

      thisLoc.street1 = masterLoc.street1;
      thisLoc.city = masterLoc.city;
      thisLoc.zip = masterLoc.zip;
      thisLoc.state = masterLoc.state;
      thisLoc.tooltip_hours = masterLoc.tooltip_hours;
      thisLoc.fullHours = masterLoc.fullHours;
      thisLoc.announcement = masterLoc.announcement;

    } else {
      const formattedOpenHour = militaryTo12hFormat(openHour);
      const formattedCloseHour = militaryTo12hFormat(closeHour);

      if (masterLoc.is_same_hours_weekly === true) {
        var thisLoc_hours = 'Open ' + formattedOpenHour + '-' + formattedCloseHour;
      } else {
        var thisLoc_hours = nameDay + ' ' + formattedOpenHour + '-' + formattedCloseHour;
      }

      const thisLoc = {
        name: masterLoc.name,
        title: masterLoc.title,
        ready: 'Unavailable',
        availability: {
          class: 'out',
          text: 'Out of Stock'
        },
        hours: thisLoc_hours,
        tooltip_hours: masterLoc.tooltip_hours,
        fullHours: masterLoc.fullHours,
        announcement: masterLoc.announcement,
        street1: masterLoc.street1,
        city: masterLoc.city,
        zip: masterLoc.zip,
        state: masterLoc.state,
        tooltip_hours: masterLoc.tooltip_hours,
        fullHours: masterLoc.fullHours,
        announcement: masterLoc.announcement
      };

      inventoryItem.locations.push(thisLoc);
    }
  }

  inventoryItem.locations.sort((a, b) =>
    storesSort.indexOf(a.name) > storesSort.indexOf(b.name)
      ? 1
      : storesSort.indexOf(b.name) > storesSort.indexOf(a.name)
        ? -1
        : 0
  );

  inventoryItem.locations = inventoryItem.locations.filter(loc => window.ccStores.indexOf(loc.name) !== -1);
  inventoryItem.stateLocations = inventoryItem.locations.filter(loc => !(state && state.length) || (state.indexOf(loc.state) !== -1));

  if (window.vars.favStore) {
    inventoryItem.favStore = window.vars.favStore;

    inventoryItem.locations.sort((a, b) =>
      window.vars.favStore.name === b.name
        ? 1
        : window.vars.favStore.name === a.name
          ? -1
          : 0
    );
  }

  return inventoryItem;
}

/**
 * Attach listeners to open collapse elements
 */
const initInventoryLocations = () => {
  document.addEventListener('tomitProductLoaded', function (e, data) {
    // alert('PRODUCT LOADED');
    window.inventories = window.tomitProductInventoryInfo.activeProduct.variants;

    // TODO: FIX CHECKING CONDITION FOR SETTING
    // console.log("ANGE",JSON.parse(localStorage.getItem('state_code')) != null, $('#checkState').attr("data-autoClick")  )
    if(JSON.parse(localStorage.getItem('state_code')) != null  ){
      $('#checkState').click();
    }
    
    if(!window.inventories) {
      // Show error in the stock indicator above add to cart if no inventory data was returned
      $('.js-de-stock-info-message .message').text(productStockTranslations.stock_data_not_available);
      $('.js-de-stock-info-message').addClass('not_available').removeClass('loading');
      $('.js-de-stock-info-message .lds-ring').css({"display":"none"});
    }

    for (let i = window.vars.productJSON.variants.length - 1; i >= 0; i--) {
      var v = window.vars.productJSON.variants[i];

      if (window.inventories[v.id]) {

      } else {
        window.inventories[v.id] = {
          id: v.id,
          sku: v.sku,
          title: v.title,
          inventoryItem: {
            id: "1",
            locations: []
          }
        }
      }
    }

    Object.values(window.inventories).forEach(variant => {
      var deliveryWindow = 'product_availability' in window.translations ? window.translations['product_availability']['delivery_duration'] : '2-6 day delivery in Metro areas';
      var locs = variant.inventoryItem.locations;
      var onlineInventoryLocs = locs.filter(loc => window.onlineInventoryStores.indexOf(loc.name) !== -1);
      var onlineInventoryItem;

      if (onlineInventoryLocs.length > 0) {
        var totalAvailable = onlineInventoryLocs.map(loc => loc.available).reduce((a, b) => a + b, 0);

        onlineInventoryItem = {
          name: 'Delivery',
          available: totalAvailable,
          inStock: totalAvailable > 0 ? 1 : 0,
          hours: deliveryWindow,
          availability: {
            class: totalAvailable > 2 ? 'in' : (totalAvailable > 0 ? 'low' : 'out'),
            text: totalAvailable > 2 ? 'In Stock' : (totalAvailable > 0 ? 'Low Stock' : 'Out of Stock')
          },
          ready: totalAvailable > 0 ? 'Available for delivery' : 'Unavailable for delivery'
        }
      } else {
        onlineInventoryItem = {
          name: 'Delivery',
          available: 0,
          inStock: 0,
          ready: 'Unavailable for delivery',
          availability: {
            class: 'out',
            text: 'Out of Stock'
          },
          hours: deliveryWindow
        }
      }

      variant.inventoryItem.delivery = onlineInventoryItem;
    });

    for (let i = window.vars.productJSON.variants.length - 1; i >= 0; i--) {
      const vId = window.vars.productJSON.variants[i].id;
      const vInv = window.inventories[vId].inventoryItem;

      const onlineAvailability = vInv.delivery;

      window.vars.productJSON.variants[i].cc = false;

      if (onlineAvailability.inStock) {
        window.vars.productJSON.variants[i].cc = false;
      } else if (vInv.locations.length > 0) {
        window.vars.productJSON.variants[i].cc = true;
        if (
          window.vars.selectedVariant &&
          vId === window.vars.selectedVariant.id
        ) {
          if ($('#AddToCartText').text() === 'Add to Cart') {
            $('#AddToCartText').text('Click & Collect');
          }
        }
      }
    }

    if (window.vars.selectedVariant === null) {
      window.inventoryLocationsDisplay.changeVariant(null);

      var currentModel = $('.js-de-ModelCode-text').text();
      //console.log('push the stock');
      pushStockInfoToDataLayer(currentModel);
    } else {
      window.inventoryLocationsDisplay.changeVariant(
        window.vars.selectedVariant.id
      );
      window.vueATC.changeVariant(
        window.vars.selectedVariant.id
      );

      var titleParts = window.vars.selectedVariant.title.split(' ');
      var currentModel = titleParts[titleParts.length - 1];
      //console.log('push the stock');
      pushStockInfoToDataLayer(currentModel);
    }
  });

  window.inventoryLocationsDisplay = new Vue({
    el: '#locsContainer',
    data: JSON.parse(JSON.stringify(demoInventory)),
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
        if (!window.inventories) {
          Vue.set(this.$data, 'id', 'error');
        } else if (variant === null) {
          this.changeWholeData(emptyData);
        } else {
          this.changeWholeData(
            addMasterStoresData(window.inventories[variant].inventoryItem, this.$data.state)
          );
        }
      },
      evaluateState() {
        var error = $('#postcodeError');
        var message = $('#deliveryLocationMessage');
        var code = $('#deliveryLocation');

        var stateInput = $('[name="state"]');
        var rawCode = stateInput.val();
        var fullCode = rawCode;
        console.log(state, rawCode);

        if (this.isAustralianState(rawCode)) {

          var state = [];
          var postcode = parseInt(rawCode);

          if ((postcode >= 1000 && postcode <= 1999) || (postcode >= 2000 && postcode <= 2599) || (postcode >= 2619 && postcode <= 2899) || (postcode >= 2921 && postcode <= 2999)) {
            state.push('NSW');
            state.push('ACT');
            fullCode += ' (NSW/ACT)';
          } else if ((postcode >= 200 && postcode <= 299) || (postcode >= 2600 && postcode <= 2618) || (postcode >= 2900 && postcode <= 2920)) {
            state.push('NSW');
            state.push('ACT');
            fullCode += ' (NSW/ACT)';
          } else if ((postcode >= 3000 && postcode <= 3999) || (postcode >= 8000 && postcode <= 8999)) {
            state.push('VIC');
            fullCode += ' (VIC)';
          } else if ((postcode >= 4000 && postcode <= 4999) || (postcode >= 9000 && postcode <= 9999)) {
            state.push('QLD');
            fullCode += ' (QLD)';
          } else if ((postcode >= 5000 && postcode <= 5999)) {
            state.push('SA');
            fullCode += ' (SA)';
          } else if ((postcode >= 6000 && postcode <= 6999)) {
            state.push('WA');
            fullCode += ' (WA)';
          } else if ((postcode >= 7000 && postcode <= 7799) || (postcode >= 7800 && postcode <= 7999)) {
            state.push('TAS');
            fullCode += ' (TAS)';
          } else if ((postcode >= 800 && postcode <= 899) || (postcode >= 900 && postcode <= 999)) {
            state.push('NT');
            fullCode += ' (NT)';
          }

          if (state.length > 0) {
            code.text(fullCode);
            message.slideDown();
            error.slideUp();

            this.$data.state = state;
            this.$data.collapsed = false;

            localStorage.setItem('state_array', JSON.stringify(state));
            localStorage.setItem('state_code', JSON.stringify(rawCode));

            if (window.vars.selectedVariant === null) {
              this.changeVariant(null);
            } else {
              this.changeVariant(
                window.vars.selectedVariant.id
              );
            }

          } else {
            error.slideDown();
          }
        } else {
          error.slideDown();
        }
      },
      isAustralianState(postcode) {
        var regex = /^\d{4}$/g;
        return postcode.match(regex);
      },
      clearCode() {
        Vue.set(this.$data, 'code', null);
        Vue.set(this.$data, 'state', null);

        if (window.vars.selectedVariant === null) {
          this.changeVariant(null);
        } else {
          this.changeVariant(
            window.vars.selectedVariant.id
          );
        }
      }
    }
  });

  $('[name="state"]').on('keypress', function (e) {
    if (e.which == 13) {
      e.preventDefault();
      $('#checkState').click();
    }
  });
};

/**
 * Put all functions that need to run on product-page load here
 */
export const init = () => {
  initInventoryLocations();
};
