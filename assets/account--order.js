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

  // populate productDict
  productDict = createProductDict(jsOrder.lineItems)

  if (jsOrder.cancelled) {
    // If order is cancelled, add all products to the cancelled section and set the shipping title 
    addProductsReturn = addProductsToSection(productDict, 'cancelled', sections, jsOrder.lineItems)
    sections = addProductsReturn[0]
    productDict = addProductsReturn[1]

    $('.account-order--shipping-title').text('No Shipments for this Order')
    $('.account-order--shipping h5').hide()
    $('.account-order--shipping p').hide()
  } else {
    // create a reference dictionary of all products ordered
    productDict = createProductDict(jsOrder.lineItems)

    // Loop products ordered
    for (let i = 0; i < jsOrder.lineItems.length; i++) {
      // If the product is not in the reference dictionary continue
      if (!productDict.hasOwnProperty(jsOrder.lineItems[i].sku)) {
        continue
      }
      if (!jsOrder.lineItems[i].fulfillment && jsOrder.financial == 'partially_refunded') {
        // If item has no fulfillment and is partially refunded, add item to returned section
        addProductsReturn = addProductsToSection(productDict, 'returned', sections, [jsOrder.lineItems[i]])
        sections = addProductsReturn[0]
        productDict = addProductsReturn[1]
      } else if (!jsOrder.lineItems[i].fulfillment && (jsOrder.fulfillment == 'partial' || jsOrder.fulfillment == 'unfulfilled')) {
        // If item has no fulfillment and is partially fulfulled, add item to pending section
        addProductsReturn = addProductsToSection(productDict, 'pending', sections, [jsOrder.lineItems[i]])
        sections = addProductsReturn[0]
        productDict = addProductsReturn[1]
      } else if (jsOrder.lineItems[i].fulfillment && (jsOrder.shippingMethods.length < 1)) {
        // save references to the quantity fulfilled and quantity ordered
        var fulfilledQty = productDict[jsOrder.lineItems[i].sku].fulfilled
        var orderedQty = productDict[jsOrder.lineItems[i].sku].quantity
        // check if fulfilled == quantity ordered -> add to shipped_home
        if (fulfilledQty == orderedQty) {
          addProductsReturn = addProductsToSection(productDict, 'shipped_home', sections, [jsOrder.lineItems[i]])
          sections = addProductsReturn[0]
          productDict = addProductsReturn[1]
          $('.account-order--shipping-title').text('Shipped to Home')

        } else {
          // copy the product information
          var lineItemCopyForFulfilled = Object.assign({}, jsOrder.lineItems[i])
          // update the quantity for both the info for qualitied ordered and the copied quantity
          lineItemCopyForFulfilled.quantity = fulfilledQty
          jsOrder.lineItems[i].quantity -= fulfilledQty

          // Add the fulfilled items to shipped home section
          addProductsReturn = addProductsToSection(productDict, 'shipped_home', sections, [lineItemCopyForFulfilled])
          sections = addProductsReturn[0]
          productDict = addProductsReturn[1]
          // Add the remaining quantity to pending section
          addProductsReturn = addProductsToSection(productDict, 'pending', sections, [jsOrder.lineItems[i]])
          sections = addProductsReturn[0]
          productDict = addProductsReturn[1]
          $('.account-order--shipping-title').text('Shipped to Home')
        }
      } else if (jsOrder.lineItems[i].fulfillment && (jsOrder.shippingMethods.length > 0)) {
        $('.account-order--shipping-title').text('Shipped to Store')
        // check title of shipping methods, if in-store pickup ("Decathlon San Francisco Store Pickup", "Decathlon Emeryville Store Pickup")
        for (let i = 0; i < jsOrder.shippingMethods.length; i++) {
          if (jsOrder.shippingMethods[i].title == 'Decathlon San Francisco Store Pickup') {
            /*
            address1, city, province, zip, country, phone
            */
            $('.account-order--shipping-address1').text(storeAddressRef['STSF001'].address_line_1)
            $('.account-order--shipping-city').text(storeAddressRef['STSF001'].city_state_zip)
            $('.account-order--shipping-province').hide()
            $('.account-order--shipping-zip').hide()
            $('.account-order--shipping-country').hide()
            $('.account-order--shipping-phone').hide()
          } else if (jsOrder.shippingMethods[i].title == 'Decathlon Emeryville Store Pickup') {
            $('.account-order--shipping-address1').text(storeAddressRef['STEM001'].address_line_1)
            $('.account-order--shipping-city').text(storeAddressRef['STEM001'].city_state_zip)
            $('.account-order--shipping-province').hide()
            $('.account-order--shipping-zip').hide()
            $('.account-order--shipping-country').hide()
            $('.account-order--shipping-phone').hide()
          } else {
            $('.account-order--shipping p').hide()
          }
        }
      }
    }
  }

  // Populate Tables
  $('.account-order--pending-table tbody').append(createProductTableRows(sections.pending['items'], false))
  $('.account-order--shipped-home-table tbody').append(createProductTableRows(sections.shipped_home['items'], true))
  $('.account-order--shipped-store-table tbody').append(createProductTableRows(sections.shipped_store['items'], true))
  $('.account-order--cancelled-table tbody').append(createProductTableRows(sections.cancelled['items'], false))
  $('.account-order--returned-table tbody').append(createProductTableRows(sections.returned['items'], true))

  /*
   Totals
   */
  // Populate Totals table with money info
  $('.account-order--subtotal').text('$' + formatMoney(jsOrder.moneyLines.subtotal))
  $('.account-order--cancelled-total').text('$' + (-sections.cancelled.netTotal).toFixed(2))
  $('.account-order--returned-total').text('$' + (-sections.returned.netTotal).toFixed(2))
  $('.account-order--shipping-type').text(jsOrder.shipping.type)
  $('.account-order--shipping-total').text('$' + formatMoney(jsOrder.moneyLines.shipping))
  $('.account-order--taxes').text('$' + (formatMoney(jsOrder.moneyLines.tax) - (sections.cancelled.netTax + sections.returned.netTax)).toFixed(2))
  $('.account-order--totals').text('$' + (formatMoney(jsOrder.moneyLines.total) - (sections.cancelled.netTotal + sections.returned.netTotal) - (sections.returned.netTax + sections.cancelled.netTax)).toFixed(2))
  // Hide the Spinner
  $('#spinningLoad').hide()
  // Show tables that have data (not []), billing and shipping info, bottom buttons
  if (sections.pending.items.length > 0) {
    $('.account-order--pending-table').show()
  }
  if (sections.shipped_home.items.length > 0) {
    $('.account-order--shipped-home-table').show()
  }
  if (sections.shipped_store.items.length > 0) {
    $('.account-order--shipped-store-table').show()
  }
  if (sections.cancelled.items.length > 0) {
    $('.account-order--cancelled-table').show()
  } else {
    $('.account-order--cancelled-total-row').hide()
  }
  if (sections.returned.items.length > 0) {
    $('.account-order--returned-table').show()
  } else {
    $('.account-order--returned-total-row').hide()
  }
  $('.account-order--totals-table').show()
  $('.account-order--billing-and-shipping').show()
  $('#shopify-order-bottom-buttons').css('display', 'flex')
})
/**
 * Function to take a list of products and return a reference object
 * @param {Array} {products} - list of products to create reference dictionary
 * @returns - reference dictionary for the products
 */
function createProductDict (products) {
  var newDict = {}
  var seenFulfillments = []
  var holdFulfillments = {}

  for (let i = 0; i < products.length; i++) {
    if (!newDict.hasOwnProperty(products[i].sku)) {
      newDict[products[i].sku] = {
        quantity: products[i].quantity,
        item: products[i],
        fulfilled: 0
      }
    } else {
      newDict[products[i].sku].quantity += products[i].quantity
    }
    if (products[i].fulfillment && seenFulfillments.indexOf(products[i].fulfillment.id) == -1) {
      //  Save a reference to the fulfillment id to avoid duplicates
      seenFulfillments.push(products[i].fulfillment.id)
      for (let j = 0; j < products[i].fulfillment.line_items.length; j++) {
        if (newDict.hasOwnProperty(products[i].fulfillment.line_items[j].sku)) {
          // if item is in the product reference, add the quantity fulfilled
          newDict[products[i].fulfillment.line_items[j].sku].fulfilled += products[i].fulfillment.line_items[j].quantity
        } else if (holdFulfillments.hasOwnProperty(products[i].fulfillment.line_items[j].sku)) {
          // if item is not in product reference, but is in holdFulfillments, add quantity to holdFulfillments,
          holdFulfillments[products[i].fulfillment.line_items[j].sku] += products[i].fulfillment.line_items[j].quantity
        } else {
          // if item is not in either, add to holdFulfillments
          holdFulfillments[products[i].fulfillment.line_items[j].sku] = products[i].fulfillment.line_items[j].quantity
        }
      }
    }
  }
  //  Add quantities from holdFulfillment to the reference dictionary
  var keys = Object.keys(holdFulfillments)
  for (let k = 0; k < keys.length; k++) {
    newDict[keys[k]].fulfilled += holdFulfillments[keys[k]]
  }
  return newDict
}
