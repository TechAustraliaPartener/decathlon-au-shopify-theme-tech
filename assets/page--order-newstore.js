$(document).ready(function () {
  jQuery.ajax(params)
})

var params = {
  type: 'GET',
  url: `/tools/shopify-decathlon-proxy-s/newstore-order-for-shopify/single-order?order=${forJS['order']}`,
  success: function (order) {
    // Populate order date
    $('.order-page--date').text(order.date)

    // Populate Item Tables
    $('.order-page--pending-table tbody').append(createProductTableRows(order.pending['items'], false))
    $('.order-page--shipped-home-table tbody').append(createProductTableRows(order.shipped_home['items'], true))
    $('.order-page--shipped-store-table tbody').append(createProductTableRows(order.shipped_store['items'], true))
    $('.order-page--cancelled-table tbody').append(createProductTableRows(order.cancelled['items'], false))
    $('.order-page--returned-table tbody').append(createProductTableRows(order.returned['items'], true))

    // Populate Totals
    $('.order-page--subtotal').text('$' + order.totals.subtotal)
    $('.order-page--cancelled-total').text('$' + order.totals.cancelled)
    $('.order-page--returned-total').text('$' + order.totals.returned)
    $('.order-page--shipping-type').text(order.shipping.type)
    $('.order-page--shipping-total').text('$' + order.totals.shipping)
    $('.order-page--taxes').text('$' + order.totals.taxes)
    $('.order-page--totals').text('$' + order.totals.grand_total)

    // Populate Billing
    $('.order-page--billing-name').text(order.billing.name)
    $('.order-page--billing-address-line-1').text(order.billing.address_line_1)
    if (order.billing.address_line_2 !== '') {
      $('.order-page--billing-address-line-2').html(order.billing.address_line_2 + '<br>')
    } else {
      $('.order-page--billing-address-line-2').hide()
    }
    $('.order-page--billing-city-state-zip').text(order.billing.city_state_zip)

    // Populate Shipping
    $('.order-page--shipping-title').text(order.shipping.shippingType)
    $('.order-page--shipping-name').text(order.shipping.name)
    $('.order-page--shipping-address-line-1').text(order.shipping.address_line_1)

    if (order.shipping.address_line_2 !== '') {
      $('.order-page--shipping-address-line-2').html(order.shipping.address_line_2 + '<br>')
    } else {
      $('.order-page--shipping-address-line-2').hide()
    }
    $('.order-page--shipping-city-state-zip').text(order.shipping.city_state_zip)

    // If the order is USN, update the Return An Item link
    if (order.number.slice(-3) === 'USN') {
      var returnLink = `/pages/returns`
      $('#shopify-order-return-btn').attr('href', returnLink)
    }

    // Update Header with Order Number
    $('.accountHeading').text('Order ' + order.number)
    // Hide the Spinner
    $('#spinningLoad').hide()
    // Show Date, Tables that have data (not []), billing and shipping info, bottom buttons\
    $('.order-page--date').show()
    // Only show tables if there are products in them
    if (order.pending.items.length > 0) {
      $('.order-page--pending-table').show()
    }
    if (order.shipped_home.items.length > 0) {
      $('.order-page--shipped-home-table').show()
    }
    if (order.shipped_store.items.length > 0) {
      $('.order-page--shipped-store-table').show()
    }
    if (order.cancelled.items.length > 0) {
      $('.order-page--cancelled-message').text(order.cancelled.message)
      $('.cancelled').show()
      $('.cancelled p.h5').show()
      $('.order-page--cancelled-table').show()
    } else {
      $('.order-page--cancelled-total-row').hide()
    }
    if (order.returned.items.length > 0) {
      $('.order-page--returned-table').show()
    } else {
      $('.order-page--returned-total-row').hide()
    }
    $('.order-page--totals-table').show()
    $('.order-page--billing-and-shipping').show()
    $('#shopify-order-bottom-buttons').css('display', 'flex')
  },
  error: function (request, textStatus, error) {
    console.log('[error] XMLHttpRequest: ', request)
    console.log('[error] textStatus: ', textStatus)
    console.log('[error] error: ', error)
  }
}

function createProductTableRows (products, reviewLink) {
  var tableRowHtml = ''
  for (let i = 0; i < products.length; i++) {
    var singleRow = '<tr>'
    // Product Image
    singleRow += '<td>'
      singleRow += "<img class='order-page--product-img' src='" + products[i].image + "' alt='" + products[i].name + "'>"
    if (products[i].handle == '') {
      singleRow += '</td>'
    } else {
      singleRow += '<a href="/products/' + products[i].handle + '">'
      singleRow += "<img class='order-page--product-img' src='" + products[i].image + "' alt='" + products[i].name + "'>"
      singleRow += '</a></td>'
    }

    // Product Info
    singleRow += '<td>'
    if (products[i].handle == '') {
      singleRow += "<div class='row'><span class='u-block order-page--product order-page--product-span'>" + products[i].name + '</span></div>'
    } else {
      singleRow += '<div class="row"><a href="/products/' + products[i].handle + '">'
      singleRow += "<span class='u-block order-page--product order-page--product-span'>" + products[i].name + '</span>'
      singleRow += '</a></div>'
    }
    singleRow += "<br /><div class='row'>Quantity: " + products[i].quantity + '</div>'
    singleRow += "<div class='row'>SKU: " + products[i].product_sku + '</div>'
    if (reviewLink) {
      singleRow += "<div class='row'><a style='position: relative;' class='btn btn--text account-writeReviewButton order-page--writeReviewButton' href='/account?view=review-products'>Write Review</a></div>"
    }
    singleRow += '</td>'

    // Price
    singleRow += "<td class='text-right'>"
    singleRow += '$' + (products[i].quantity * products[i].price.net).toFixed(2)
    singleRow += '</td>'
    singleRow += '</tr>'
    tableRowHtml += singleRow
  }
  return tableRowHtml
}
