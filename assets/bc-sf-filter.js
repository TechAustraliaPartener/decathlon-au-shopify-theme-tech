// Override Settings
var bcSfFilterSettings = {
    general: {
        limit: 15,
        loadProductFirst: true
    }, 
  	template: {
  		filterOptionSwatchItem: '<li><a href="{{itemLink}}" style="background-color: {{itemValue}}; border: {{itemBorder}}" data-id="{{itemParentId}}" data-value="{{itemValue}}" data-parent-label="{{itemParentLabel}}" onClick="{{itemFunc}}" class="{{itemSelected}}"></a></li>',
    }        
};

var bcSfFilterTemplate = {
    'soldOutClass': 'product-price--sold-out grid-view-item--sold-out',
    'onSaleClass': 'on-sale',
 
    // Grid
    'vendorGridHtml': '<div class="grid-view-item__vendor">{{vendor}}</div>',
    'soldOutLabelGridHtml': '<span class="product-price__sold-out">' + bcSfFilterConfig.product.sold_out_text + '</span>',
    'productGridItemHtml': '<div class="grid__item {{gridItemWidthClass}} collectionProduct js-bln-product" data-product-id="{{itemId}}"> <form action="/cart/add" method="post" enctype="multipart/form-data" class="addToCartForm collectionProduct-relative"> {{innovation}} <div class="u-block"> <a href="{{itemUrl}}" class="grid__image collectionProduct-imageLink js-shopNow"> <img class="collectionProduct-image" src="{{imageUrl}}" /> </a> <div class="collectionProduct-colors{{chipsHidden}}" data-colorChoice="{{firstColorChoice}}" data-variantChoice="{{firstVariantChoice}}"> {{colorChipSpans}} </div> <div class="starRating collectionProduct-rating" data-handle="{{itemHandle}}"> </div> </div> <p class="collectionProduct-content"><a class="collectionProduct-title" href="{{itemUrl}}">{{itemTitle}}</a></p> <p class="productPrice collectionProduct-price u-marginBottom0x">{{itemPrice}}</p> <div class="collectionProduct-hoverWrap"> <div class="collectionProduct-hoverWrap-shadow"> <div class="collectionProduct-hoverBox"> <div class="collectionProduct-hoverBox-shadow"> <div class="collectionProduct-optionSelect"> <select name="id" id="productSelect-{{itemUnique}}" class="product-single__variants"> {{variantOptions}} </select> </div> <button type="submit" name="add" class="addToCart collectionProduct-addToCart btn{{itemButtonClass}}"> <span class="addToCartText">{{itemButtonText}}</span> </button><div class="addons-list"><a class="u-textBold u-marginBottom0x">Included:</a><small class="addons-list__items"></small></div></div> </div> </div> </div> <div class="hide"><!-- include \'wishlist-button-product\' with \'{{itemId}}\' --></div><input type="hidden" name="collections" value="{{itemCollections}}" /><input type="hidden" name="p_handle" value="{{itemHandle}}" /></form></div>',

    // List
    'vendorSmallListHtml': '<div class="list-view-item__vendor-column small--hide"><div class="list-view-item__vendor">{{vendor}}</div></div>',
    'vendorMediumListHtml': '<div class="list-view-item__vendor medium-up--hide">{{vendor}}</div>',
    'saleLabelListHtml': '<div class="list-view-item__on-sale">' + bcSfFilterConfig.product.sale_text + '</div>',
    'soldOutLabelListHtml': '<div class="list-view-item__sold-out">' + bcSfFilterConfig.product.sold_out_text + '</div>',
    'productListItemHtml':  '<a href="{{itemUrl}}" class="list-view-item">' +
                                '<div class="list-view-item__image-column">' +
                                    '<div class="list-view-item__image-wrapper">' +
                                        '<img class="list-view-item__image" src="{{imageUrl}}" alt="{{itemTitle}}">' +
                                    '</div>' +
                                '</div>' +
                                '<div class="list-view-item__title-column">' +
                                    '<div class="list-view-item__title">{{itemTitle}}</div>' +
                                    '{{itemSaleLabel}}' +
                                    '{{itemMediumVendor}}' +
                                    '{{itemSoldOutLabel}}' +
                                '</div>' +
                                '{{itemSmallVendor}}' +
                                '<div class="list-view-item__price-column">{{itemPrice}}</div>' +
                            '</a>',

    'previousActiveHtml': '<span class="page"><a href="{{itemUrl}}">←</a></span>',
    'previousDisabledHtml': '<span class="page">&nbsp;</span>',
    'nextActiveHtml': '<span class="page"><a href="{{itemUrl}}">→</a></span>',
    'nextDisabledHtml': '<span class="page">&nbsp;</span>',
    'paginateHtml': '<div class="pagination">{{previous}}<span class="pagination__text u-textUppercase u-textBold u-textBlack">{{pageItems}}</span>{{next}}</div>',
  
    'sortingHtml': '<label class="label--hidden">' + bcSfFilterConfig.collection.sorting_text + '</label><select class="filters-toolbar__input filters-toolbar__input--sort">{{sortingItems}}</select>',
    'showLimitHtml': '<label>' + bcSfFilterConfig.collection.show_limit_text + '</label><select>{{showLimitItems}}</select>'
};


/** 
 * Temp solution
 */
BCSfFilter.prototype.buildProductItemUrl = function(data) {
  return ['/collections', bcSfFilterConfig.general.collection_handle, 'products', data.handle].join('/');
};


BCSfFilter.prototype.buildExtrasProductList = function(data) {
    if (this.queryParams.display == 'list') {
        $('#bc-sf-filter-products').removeClass();
        $('#bc-sf-filter-products').addClass('list-view-items');
    }
};

BCSfFilter.prototype.buildProductGridItem = function(data) {
    data.compare_at_price_min *= 100;
    data.price_min *= 100;

    var itemHtml = bcSfFilterTemplate.productGridItemHtml;

    var soldOut = !data.available;
    var onSale = data.compare_at_price_min > data.price_min;

    // Add a specific class for grid item
    var gridItemWidthClass = 'large--one-third one-half';
    var imageSize = '600x600';
    switch(bcSfFilterConfig.section.grid_number) {
        case 2:
            gridItemWidthClass = 'medium-up--one-half';
            imageSize = '540x600';
            break;
        case 3:
            gridItemWidthClass = 'small--one-half medium-up--one-third';
            imageSize = '345x550';
            break;
        case 4:
            gridItemWidthClass = 'small--one-half medium-up--one-quarter';
            imageSize = '250x';
            break;
        case 5:
            gridItemWidthClass = 'small--one-half medium-up--one-fifth';
            imageSize = '195x';
            break;
    }
    itemHtml = itemHtml.replace(/{{gridItemWidthClass}}/g, gridItemWidthClass);

    // Add soldOut class
    var soldOutClass = soldOut ? bcSfFilterTemplate.soldOutClass : '';
    itemHtml = itemHtml.replace(/{{soldOutClass}}/g, soldOutClass);

    // Add onSale class
    var onSaleClass = onSale ? bcSfFilterTemplate.onSaleClass : '';  
    itemHtml = itemHtml.replace(/{{onSaleClass}}/g, onSaleClass);

    // Add soldOut item
    var itemSoldOutLabel = soldOut ? bcSfFilterTemplate.soldOutLabelGridHtml : '';
    itemHtml = itemHtml.replace(/{{itemSoldOutLabel}}/g, itemSoldOutLabel);

    // Add Thumbnail
    var images = Object.keys(data.images).map(function (key) { return data.images[key]; });
    var imageUrl = images.length > 0 ? this.optimizeImage(images.shift()) : bcSfFilterConfig.product.no_image_url;
    itemHtml = itemHtml.replace(/{{imageUrl}}/g, imageUrl);

    // Add Vendor
    var itemVendorHtml = bcSfFilterConfig.section.vendor_enable ? bcSfFilterTemplate.vendorGridHtml.replace(/{{vendor}}/g, data.vendor) : '';
    itemHtml = itemHtml.replace(/{{itemVendor}}/g, itemVendorHtml);

    // Add Product Collections
    var collections = $(data.collections).map(function() { return this.handle; }).get().join(',');
    itemHtml = itemHtml.replace(/{{itemCollections}}/g, collections);

    // Add Product Handle
    itemHtml.replace(/{{itemHandle}}/g, data.handle);

    // Add Price
    var itemPriceHtml = '';
    if (onSale) {
        if (bcSfFilterConfig.product.price_varies) {
            itemPriceHtml += '<span class="visually-hidden">' + bcSfFilterConfig.product.regular_price_text + '</span>';
            itemPriceHtml += '<s class="product-price__price">' + this.formatMoney(data.compare_at_price_min, this.moneyFormat) +'</s>';
            itemPriceHtml += '<span class="product-price__price product-price__sale">';
            itemPriceHtml += '<span class="product__price">' + this.formatMoney(data.price_min, this.moneyFormat) + '</span>';
            itemPriceHtml += '<span class="product-price__sale-label">' + bcSfFilterConfig.product.sale_text + '</span>';
            itemPriceHtml += '</span>';
        } else {
            itemPriceHtml += '<span class="visually-hidden">' + bcSfFilterConfig.product.regular_price_text + '</span>';
            itemPriceHtml += '<s class="product-price__price">' + this.formatMoney(data.compare_at_price_min, this.moneyFormat) + '</s>';
            itemPriceHtml += '<span class="product-price__price product-price__sale">';
            itemPriceHtml += data.price_min;
            itemPriceHtml += '<span class="product-price__sale-label">' + bcSfFilterConfig.product.sale_text + '</span>';
            itemPriceHtml += '</span>';
        }
    } else {
        if (bcSfFilterConfig.product.price_varies) {
            itemPriceHtml += '<span class="product__price">' + this.formatMoney(data.price_min, this.moneyFormat) + '</span>';
        } else {
            itemPriceHtml += '<span class="visually-hidden">' + bcSfFilterConfig.product.regular_price_text + '</span>';
            itemPriceHtml += '<span class="product-price__price">' + this.formatMoney(data.price_min, this.moneyFormat) + '</span>';
        }
    }
    itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);

    // Add title
    itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
    // Add url
    itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));

    // Add id
    itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
    itemHtml = itemHtml.replace(/{{itemHandle}}/g, data.handle);

    // Innovation tag
    var itemInnovationHtml = '';
    if (data.tags && data.tags.indexOf('innovation') > -1) {
      itemInnovationHtml = '<span class="productFlag collectionProduct-flag collectionProduct-flag--innovation">Innovation</span>';
    }
    itemHtml = itemHtml.replace(/{{innovation}}/g, itemInnovationHtml);

    // Button condition
    var itemButtonClass = '',
        itemButtonText = '';
    if (window.addToWishlist) {
      itemButtonClass = ' js-addToWishlist';
      if (Appmate.wk.collection.containsProduct(data.id)) {
        itemButtonText = 'In Wishlist';
      } else {
        itemButtonText = 'Add to Wishlist';
      }
    } else {
      itemButtonText = 'Add to Cart';
    }
    itemHtml = itemHtml.replace(/{{itemButtonClass}}/g, itemButtonClass);
    itemHtml = itemHtml.replace(/{{itemButtonText}}/g, itemButtonText);

    // Color chips
    var colorChips = [];
    var colorImageMap = {};
    var colorPos = null;
    data.options_with_values.forEach(function(option, index) {
      if (option.name == 'color') {
        option.values.forEach(function(value) {
          colorImageMap[value.title] = data.images[value.image];
        });
        colorPos = index;
      }
    });
  
  
    if (colorPos !== null) {

      data.variants.forEach(function(variant, index) {
        var color = variant.merged_options[colorPos].split(':')[1];
        var colorExists = false;
        for (var i = 0; i < colorChips.length; i++) {
          if (colorChips[i].name == color) {
            colorExists = true;
            break;
          }
        }
        if (!colorExists && Object.keys(colorImageMap).length > 0) {
          var variantImage = colorImageMap[color];
          if (variantImage) {
            variantImage = variantImage.replace(/\.\w{3,4}($|\?v=)/g, '_600x$&');
          }

          var temp = {
            name: color,
            image: variantImage,
            variantId: variant.id
          };
          
          colorChips.push(temp);
        }
      });
    }

  	var chipsHidden = '';
    if (colorChips.length < 2) {
      chipsHidden = ' hidden';
    }
    itemHtml = itemHtml.replace(/{{chipsHidden}}/g, chipsHidden);

    var firstColorChoice = '',
        firstVariantChoice = '',
        colorChipSpans = '';
    if (colorChips.length > 0) {
      var firstColorChoice = colorChips[0].name,
          firstVariantChoice = colorChips[0].variantId;

      colorChips.forEach(function(chip, index) {
        var colorHandle = chip.name.toLowerCase().replace(/\W+/g, '-'),
            activeClass = index == 0 ? ' option--active' : '';

        colorChipSpans += '<span class="option option--color-'+ colorHandle +' js-colorChip'+ activeClass +'" title="'+ chip.name +'" data-variant="'+ chip.variantId +'" data-color="'+ chip.name +'" data-image="'+ chip.image +'"></span>\n\n';
      });
    }
  
    itemHtml = itemHtml.replace(/{{firstColorChoice}}/g, firstColorChoice);
    itemHtml = itemHtml.replace(/{{firstVariantChoice}}/g, firstVariantChoice);
    itemHtml = itemHtml.replace(/{{colorChipSpans}}/g, colorChipSpans);

    // Variant options
    var itemUnique = jQ('body').attr('id') +'-'+ data.id;
    itemHtml = itemHtml.replace(/{{itemUnique}}/g, itemUnique);

    var variantOptions = '',
        firstActive = true,
        self = this,
        activeVariantId = null;

    data.variants.forEach(function(variant) {
      if (variant.available) {
        var selected = firstActive ? ' selected="selected"' : '';
        if (firstActive) activeVariantId = variant.id;
        firstActive = false;

        variantOptions += '<option'+ selected +' data-sku="'+ variant.sku +'" value="'+ variant.id +'">'+ variant.title +' - '+ self.formatMoney(variant.price, self.moneyFormat) +'</option>';
      } else {
        variantOptions += '<option disabled="disabled">'+ variant.title +' - Sold Out</option>';
      }
    });
    itemHtml = itemHtml.replace(/{{variantOptions}}/g, variantOptions);


    //TODO: createProductJSON(data);
    window.productJSON = window.productJSON || [];

    var temp = {
      id: itemUnique,
      product: data
    };
    if (data.options_with_values.length == 1 && data.options_with_values[0].name != 'Title') {
      temp.addLabel = data.options_with_values[0].name;
    }
    temp.product.options = temp.product.options_with_values.map(function(option, index) {
      option.position = index + 1;
      option.values = option.values.map(function(value) { return value.title });
      return option;
    });
    temp.product.options.forEach(function(option, index) {
      var name = option.name;
      temp.product.variants.forEach(function(variant) {
        variant['option'+ (index+1)] = variant.merged_options[index].split(':')[1];
      });
    });
    window.productJSON.push(temp);

    // Wishlist
    if (Appmate.wk.collection.containsProduct(data.id)) {
      var btn_action = 'wk-remove-product';
    } else {
      var btn_action = 'wk-add-product';
    }
    itemHtml = itemHtml.replace(/{{btn_action}}/g, btn_action);

    if (window.checkGridInterval == false) {
      window.checkGridInterval = setInterval(window.checkGrid, 250);
    }

    return itemHtml;
}

BCSfFilter.prototype.buildProductListItem = function(data) {
    data.compare_at_price_min *= 100;
    data.price_min *= 100;

    var itemHtml = bcSfFilterTemplate.productListItemHtml;

    var soldOut = !data.available;
    var onSale = data.compare_at_price_min > data.price_min;

    // Add onSale item
    var itemSaleLabel = onSale ? bcSfFilterTemplate.saleLabelListHtml : '';
    itemHtml = itemHtml.replace(/{{itemSaleLabel}}/g, itemSaleLabel);

    // Add soldOut item
    var itemSoldOutLabel = soldOut ? bcSfFilterTemplate.soldOutLabelListHtml : '';
    itemHtml = itemHtml.replace(/{{itemSoldOutLabel}}/g, itemSoldOutLabel);

    // Add Thumbnail
    var images = Object.keys(data.images).map(function (key) { return data.images[key]; });
    var imageUrl = images.length > 0 ? this.optimizeImage(images.shift()) : bcSfFilterConfig.general.no_image_url;
    itemHtml = itemHtml.replace(/{{imageUrl}}/g, imageUrl);

    // Add Vendor
    var itemSmallVendorHtml = bcSfFilterConfig.section.vendor_enable ? bcSfFilterTemplate.vendorSmallListHtml.replace(/{{vendor}}/g, data.vendor) : '';
    itemHtml = itemHtml.replace(/{{itemSmallVendor}}/g, itemSmallVendorHtml);
    var itemMediumVendorHtml = bcSfFilterConfig.section.vendor_enable ? bcSfFilterTemplate.vendorMediumListHtml.replace(/{{vendor}}/g, data.vendor) : '';
    itemHtml = itemHtml.replace(/{{itemMediumVendor}}/g, itemMediumVendorHtml);

    // Add Price
    var itemPriceHtml = '';
    if (onSale) {
        if (bcSfFilterConfig.product.price_varies) {
            itemPriceHtml += '<span class="visually-hidden">' + bcSfFilterConfig.product.regular_price_text + '</span>';
            itemPriceHtml += '<s class="product-price__price">' + this.formatMoney(data.compare_at_price_min, this.moneyFormat) +'</s>';
            itemPriceHtml += '<span class="product-price__price product-price__sale">';
            itemPriceHtml += '<span class="product__price">' + this.formatMoney(data.price_min, this.moneyFormat) + '</span>';
            itemPriceHtml += '<span class="product-price__sale-label">' + bcSfFilterConfig.product.sale_text + '</span>';
            itemPriceHtml += '</span>';
        } else {
            itemPriceHtml += '<span class="visually-hidden">' + bcSfFilterConfig.product.regular_price_text + '</span>';
            itemPriceHtml += '<s class="product-price__price">' + this.formatMoney(data.compare_at_price_min, this.moneyFormat) + '</s>';
            itemPriceHtml += '<span class="product-price__price product-price__sale">';
            itemPriceHtml += data.price_min;
            itemPriceHtml += '<span class="product-price__sale-label">' + bcSfFilterConfig.product.sale_text + '</span>';
            itemPriceHtml += '</span>';
        }
    } else {
        if (bcSfFilterConfig.product.price_varies) {
            itemPriceHtml += '<span class="product__price">' + this.formatMoney(data.price_min, this.moneyFormat) + '</span>';
        } else {
            itemPriceHtml += '<span class="visually-hidden">' + bcSfFilterConfig.product.regular_price_text + '</span>';
            itemPriceHtml += '<span class="product-price__price">' + this.formatMoney(data.price_min, this.moneyFormat) + '</span>';
        }
    }
    itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);

    // Add title
    itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
    // Add url
    itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));

    return itemHtml;
}

// Build Pagination
BCSfFilter.prototype.buildPagination = function(totalProduct) {
    // Get page info
    var currentPage = parseInt(this.queryParams.page);
    var totalPage = Math.ceil(totalProduct / this.queryParams.limit);

    // If it has only one page, clear Pagination
    if (totalPage == 1) {
        jQ(this.selector.bottomPagination).html('');
        return false;
    }

    if (this.getSettingValue('general.paginationType') == 'default') {
        var paginationHtml = bcSfFilterTemplate.paginateHtml;

        // Build Previous
        var previousHtml = (currentPage > 1) ? bcSfFilterTemplate.previousActiveHtml : bcSfFilterTemplate.previousDisabledHtml;
        previousHtml = previousHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage -1));
        paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);

        // Build Next
        var nextHtml = (currentPage < totalPage) ? bcSfFilterTemplate.nextActiveHtml :  bcSfFilterTemplate.nextDisabledHtml;
        nextHtml = nextHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage + 1));
        paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);

        // Build page items
        paginationHtml = paginationHtml.replace(/{{pageItems}}/g, 'Page ' + currentPage + ' of ' + totalPage);

        jQ(this.selector.bottomPagination).html(paginationHtml);
    }
};

// Build Sorting
BCSfFilter.prototype.buildFilterSorting = function() {
    if (bcSfFilterTemplate.hasOwnProperty('sortingHtml')) {
        jQ(this.topSortingSelector).html('');

        var sortingArr = this.getSortingList();
        if (sortingArr) {
            // Build content 
            var sortingItemsHtml = '';
            for (var k in sortingArr) {
                sortingItemsHtml += '<option value="' + k +'">' + sortingArr[k] + '</option>';
            }
            var html = bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g, sortingItemsHtml);
            jQ(this.topSortingSelector).html(html);

            // Set current value
            jQ(this.topSortingSelector + ' select').val(this.queryParams.sort);
        }
    }
};

function createProductJSON(products) {
  if (!window.productJSON) {
    window.productJSON = [];
    jQ(products).each(function(k,data) {
      var temp = {
        id: [$('body').attr('id'), data.id].join('-'),
        product: data
      };
      if (data.options_with_values.length == 1 && data.options_with_values[0].name != 'Title') {
        temp.addLabel = data.options_with_values[0].name;
      }
      temp.product.options = temp.product.options_with_values.map(function(option, index) {
        option.position = index + 1;
        option.values = option.values.map(function(value) { return value.title });
        return option;
      });
      temp.product.options.forEach(function(option, index) {
        var name = option.name;
        temp.product.variants.forEach(function(variant) {
          variant['option'+ (index+1)] = variant.merged_options[index].split(':')[1];
        });
      });
      window.productJSON.push(temp);
    });
  }

  return window.productJSON;
};


BCSfFilter.prototype.buildAfterDisplayTypeEvent = function(element) {
    jQ(element).parent().children().removeClass('active');
    jQ(element).addClass('active');
    jQ('#bc-sf-filter-products').removeClass();
    if (jQ(element).hasClass('bc-sf-filter-display-grid')) {
        jQ('#bc-sf-filter-products').addClass('grid grid--view-items');
    } else {
        jQ('#bc-sf-filter-products').addClass('list-view-items');
    }
    jQ('#bc-sf-filter-products').addClass('grid-uniform');
};


/*!
 * per Tony @ BoostCommerce
 */
BCSfFilter.prototype.buildExtrasProductList = function(element) {
  jQ(element).parent().children().removeClass('active');
    jQ(element).addClass('active');
    jQ('#bc-sf-filter-products').removeClass();
    if (jQ(element).hasClass('bc-sf-filter-display-grid')) {
        jQ('#bc-sf-filter-products').addClass('grid grid--view-items');
    } else {
        jQ('#bc-sf-filter-products').addClass('list-view-items');
    }
    jQ('#bc-sf-filter-products').addClass('grid-uniform');
};

BCSfFilter.prototype.buildAdditionalElements = function(data, eventType) {  
   
    if (window.collectionViewMulti) { 
      if (!window.location.search) {
        $('#bc-sf-filter-products').html(cacheInit);
        $('.collectionProduct-image').each(function(k,v) {
          $(v).attr('src', $(v).attr('data-src'));
        });
  
        
        if (!bcSfFilterConfig.general.collection_tags) {
          $('#bc-sf-filter-bottom-pagination').hide();
        }
      } else {
        $('#bc-sf-filter-bottom-pagination').show();
      }
    }

    createProductJSON(data.products);
    TimberInit();
    chooseColors();
    decathlon.wishlistSwap(); 
    updateColorSwatchClasses();

    /*! variant nav for 'shop now' buttons */
    $('.collectionProduct .js-shopNow').click(function(e) {
      e.preventDefault();
      var variant = $(this).parents('.collectionProduct').find('.collectionProduct-colors').data('variantchoice');
      window.location.href = $(this).attr('href') +'?variantid='+ variant;
    });

    if (window.location.search) {
      RatingInit();
    }

    window.productJSON = [];

    $('.collectionProduct').each(function(k,v) {
      if (Appmate.wk.collection.containsProduct($(v).data('productId')) && window.addToWishlist) {
        $(v).find('.addToCartText').text('Remove from Wishlist');
      }
    });

    bundleize();
};
