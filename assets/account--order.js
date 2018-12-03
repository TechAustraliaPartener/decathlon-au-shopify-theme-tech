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
          // fulfilled != ordered
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
  // change the section items from an object to a list
  sections.pending.items = Object.values(sections.pending.items)
  sections.returned.items = Object.values(sections.returned.items)
  sections.cancelled.items = Object.values(sections.cancelled.items)
  sections.shipped_home.items = Object.values(sections.shipped_home.items)
  sections.shipped_store.items = Object.values(sections.shipped_store.items)
  // Hide the Spinner
  $('#spinningLoad').hide()
  // Show Date
  $('.account-order--date').show()
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
  $('.account-order--totals-table').css('display', 'table')
  $('.account-order--billing-and-shipping').show()
  $('#shopify-order-bottom-buttons').css('display', 'flex')
})

/**
 * Function to add Products to a section object
 * @param {Object} productDict - reference dictionary of products
 * @param {String} section - title of the section to add products to
 * @param {Object} sectionsObj - object representing all product sections
 * @param {Array} products - list of products to add the section
 */
function addProductsToSection (productDict, section, sectionsObj, products) {
  for (let i = 0; i < products.length; i++) {
    // add taxes to section's netTax
    let taxLines = products[i].tax_lines
    for (let j = 0; j < taxLines.length; j++) {
      sectionsObj[section].netTax += (products[i].quantity * taxLines[j].tax_line.price)
    }
    // add line total to section's netTotal
    sectionsObj[section].netTotal += (products[i].quantity * products[i].price)
    //  Check if the product is in the section to update quantity, add if not there
    if (sectionsObj[section].items.hasOwnProperty(products[i].sku)) {
      sectionsObj[section].items[products[i].sku].quantity += products[i].quantity
    } else {
      sectionsObj[section].items[products[i].sku] = {
        quantity: products[i].quantity,
        product: products[i],
        fulfilled: productDict[products[i].sku].fulfilled
      }
    }
    // Decrement the reference dict, if it exists
    if (productDict.hasOwnProperty(products[i].sku)) {
      productDict[products[i].sku].quantity -= products[i].quantity
      // if quantity and fulfilled are less than 1, remove the product from the reference dict
      if (productDict[products[i].sku].quantity < 1 && productDict[products[i].sku].fulfilled < 1) {
        delete productDict[products[i].sku]
      }
    }
  }
  return [sectionsObj, productDict]
}

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

/**
 * Function to create HTML of trs for the section provided
 * @param {Object} sectionObj - object for a section including items and quantity of each item ordered
 * @param {Boolean} reviewLink - true if the link should be included, otherwise false
 * @returns - string representing the HTML trs created
 */
function createProductTableRows (sectionObj, reviewLink) {
  var productList = Object.values(sectionObj)
  var tableRowHtml = ''
  if (productList.length < 1) {
    return tableRowHtml
  }
  for (let i = 0; i < productList.length; i++) {
    var singleRow = '<tr>'
    // Product Image
    singleRow += '<td>'
    if (productList[i].product.product) {
      var variantImage = getVariantImage(productList[i].product.variant.image_id, productList[i].product.product.images, defaultImg)
      singleRow += `<a href="${productList[i].product.url}">`
      singleRow += "<img class='account-order--product-img' src='" + variantImage + "' alt='" + productList[i].product.title + "'>"
      singleRow += '</a>'
      singleRow += '</td>'

      // Start Product Info
      singleRow += '<td>'
      singleRow += "<div class='row'>"
      singleRow += `<a href="${productList[i].product.url}">`
      singleRow += "<span class='u-block account-order--product'>" + productList[i].product.title + '</span>'
      singleRow += '</a>'
      singleRow += '</div>'
    } else {
      singleRow += "<img class='account-order--product-img' src='" + defaultImg + "' alt='" + productList[i].product.title + "'>"
      singleRow += '</td>'

      // Start Product Info
      singleRow += '<td>'
      singleRow += "<div class='row'><span class='u-block account-order--product'>" + productList[i].product.title + '</span></div>'
    }
    // Finish Product Info
    singleRow += "<div class='row'>Quantity: " + productList[i].quantity + '</div>'
    singleRow += "<div class='row'>SKU: " + productList[i].product.sku + '</div>'
    if (reviewLink) {
      singleRow += "<div class='row'><a style='position: relative;' class='btn btn--text account-writeReviewButton account-order--writeReviewButton' href='/account?view=review-products'>Write Review</a></div>"
    }
    singleRow += '</td>'

    // Price
    singleRow += "<td class='text-right'>"
    singleRow += '$' + (productList[i].quantity * parseFloat(productList[i].product.price)).toFixed(2)
    singleRow += '</td>'
    singleRow += '</tr>'
    tableRowHtml += singleRow
  }
  return tableRowHtml
}

/**
 * Function to format a shopify number representing money into a float
 * @param {Number} num - number to format (Example: 253478)
 * @returns {Float} formatted num (Example: 2,534.78)
 */
function formatMoney (num) {
  if (!num || num == undefined || num == 0) {
    return (parseFloat('0').toFixed(2))
  }
  var formattedNum = ''
  num = num.toString().split('')
  var cents = '.' + num.slice(-2).join('')
  num = num.slice(0, -2).join('')

  while (num.length > 3) {
    formattedNum += `,${num.slice(-3).join('')}`
    num = num.slice(0, -3)
  }
  formattedNum = parseFloat(num + formattedNum + cents).toFixed(2)
  return formattedNum
}

/**
 * Function to find a products image src from a list of images, using the imageId
 * @param {*} imageId - id of the image src to find
 * @param {*} images - list of images to search through
 * @param {*} defaultImage - defaultImage in case no src is found
 */
function getVariantImage (imageId, images, defaultImage) {
  for (let i = 0; i < images.length; i++) {
    if (images[i].id == imageId) {
      return images[i].src
    }
  }
  return defaultImage
}
