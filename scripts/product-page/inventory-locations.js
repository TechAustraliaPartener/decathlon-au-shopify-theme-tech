import $ from 'jquery';
import Vue from 'vue/dist/vue.esm.js';

// Const product = productJSON;

const demoInventory = {
  id: 'demo',
  locations: [],
  delivery: {},
  favStore: window.vars.favStore
};

const emptyData = {
  favStore: window.vars.favStore
};

const storesSort = window.masterStores.map(a => a.name);

function addMasterStoresData(inventoryItem) {
  inventoryItem.locations = inventoryItem.locations.filter(loc => {
    return storesSort.indexOf(loc.name) !== -1;
  });

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

    if (thisLoc) {
      if (thisLoc.name === 'Tempe') {
        const delivery = {
          name: 'Delivery'
        };

        if (thisLoc.available > 2) {
          delivery.availability = {
            class: 'in',
            text: 'In Stock'
          };
          delivery.ready = 'Available for delivery';
        } else if (thisLoc.available > 0) {
          delivery.availability = {
            class: 'low',
            text: 'Low Stock'
          };
          delivery.ready = 'Available for delivery';
        } else {
          delivery.availability = {
            class: 'out',
            text: 'Out of Stock'
          };
          delivery.ready = 'Unavailable for delivery';
        }
        delivery.hours = '2-6 day delivery in Metro areas';

        inventoryItem.delivery = delivery;
      }

      thisLoc.title = masterLoc.title;

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
          text: 'Out of Stock'
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

      // Check the current weekday to show Genesus store hours on product page
      if (thisLoc.name === 'Genesis') {
        var weekday = new Date().getDay();
        if (weekday === 0) {
          thisLoc.hours = 'Open Monday 6am-9pm';
        } else if (weekday === 6) {
          thisLoc.hours = 'Open 6am-12pm';
        } else {
          thisLoc.hours = 'Open 6am-9pm';
        }
      } else {
        thisLoc.hours = masterLoc.street2;
      }
      thisLoc.tooltip_hours = masterLoc.tooltip_hours;
      thisLoc.fullHours = masterLoc.full_hours;

    } else {
      if (masterLoc.name === 'Tempe') {
        inventoryItem.delivery = {
          name: 'Delivery',
          ready: 'Unavailable for delivery',
          availability: {
            class: 'out',
            text: 'Out of Stock'
          },
          hours: '2-6 day delivery in Metro areas'
        };
      }

      const thisLoc = {
        name: masterLoc.name,
        title: masterLoc.title,
        ready: 'Unavailable',
        availability: {
          class: 'out',
          text: 'Out of Stock'
        },
        hours: masterLoc.street2,
        tooltip_hours: masterLoc.tooltip_hours
        fullHours: masterLoc.full_hours
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
  document.addEventListener('tomitProductLoaded', function(e, data) {
    window.inventories =
      window.tomitProductInventoryInfo.activeProduct.variants;

    for (let i = window.vars.productJSON.variants.length - 1; i >= 0; i--) {
      const vId = window.vars.productJSON.variants[i].id;
      const vInv = window.inventories[vId].inventoryItem;

      const tempeAvailability = vInv.locations.find(obj => {
        return obj.name === 'Tempe' && obj.inStock > 0;
      });

      window.vars.productJSON.variants[i].cc = false;

      if (tempeAvailability) {
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
    } else {
      window.inventoryLocationsDisplay.changeVariant(
        window.vars.selectedVariant.id
      );
    }
  });

  window.inventoryLocationsDisplay = new Vue({
    el: '#inventoryLocs',
    data: JSON.parse(JSON.stringify(demoInventory)),
    methods: {
      changeWholeData(newData) {
        Object.keys(this.$data).forEach(key => (this.$data[key] = null));
        Object.entries(newData).forEach(entry =>
          Vue.set(this.$data, entry[0], entry[1])
        );
      },
      changeVariant(variant) {
        if (variant === null || !window.inventories) {
          this.changeWholeData(emptyData);
        } else {
          this.changeWholeData(
            addMasterStoresData(window.inventories[variant].inventoryItem)
          );
        }
      }
    }
  });
};

/**
 * Put all functions that need to run on product-page load here
 */
export const init = () => {
  initInventoryLocations();
};
