var storeAddressRef = {
    ////
    //  TODO:
    //      Need a better solution for this info, maybe a store database? (or do we have this already in NewStore?)
    //      The same information in is shopify-decathlon-proxy
    //  NOTE:
    //      Keys are created after NewStore's model for the San Francisco store: STSF001
    //      Format: ST + (2 letters representing location) + (number representing the order of store opening)
    //
    //   This same object can be found in the stores module of shopify-decathlon-proxy
    ////
    STSF001: {
      title: "Decathlon San Francisco Store",
      address_line_1: "735 Market St",
      address_line_2: "",
      city_state_zip: "San Francisco, CA 94103"
    },
    STEM001: {
      title: "Decathlon Emeryville Store",
      address_line_1: "3938 Horton St",
      address_line_2: "",
      city_state_zip: "Emeryville, CA 94608"
    }
}
$(document).ready(function () {
  // Set up variables
  var productDict = {}
  var addProductsReturn
  var sections = {
    pending: {
      name: 'pending',
      items: {},
      netTax: 0,
      netTotal: 0
    },
    shipped_home: {
      name: 'shipped_home',
      items: {},
      netTax: 0,
      netTotal: 0
    },
    shipped_store: {
      name: 'shipped_store',
      items: {},
      netTax: 0,
      netTotal: 0
    },
    cancelled: {
      name: 'cancelled',
      items: {},
      original_shipped: '',
      netTax: 0,
      netTotal: 0
    },
    returned: {
      name: 'returned',
      items: {},
      original_shipped: '',
      netTax: 0,
      netTotal: 0
    }
  }
})
