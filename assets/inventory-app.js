(function() {
	if (typeof window.CustomEvent === "function") return !1;

	function CustomEvent(event, params) {
		params = params || {
			bubbles: !1,
			cancelable: !1,
			detail: undefined
		};
		var evt = document.createEvent('CustomEvent');
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt
	}
	CustomEvent.prototype = window.Event.prototype;
	window.CustomEvent = CustomEvent;
	if (!('remove' in Element.prototype)) {
		Element.prototype.remove = function() {
			if (this.parentNode) {
				this.parentNode.removeChild(this)
			}
		}
	}
})();
var tomitStorageSystem = {
	now: function() {
		var date = new Date().getTime();
		return parseInt(date / 1000)
	},
	get: function(key) {
		var entry = JSON.parse(localStorage.getItem(key) || "0");
		if (!entry) return null;
		if (entry.ttl && entry.ttl + entry.now < tomitStorageSystem.now()) {
			localStorage.removeItem(key);
			return null
		}
		return entry.value
	},
	set: function(key, value, ttl) {
		localStorage.setItem(key, JSON.stringify({
			ttl: ttl || 0,
			now: tomitStorageSystem.now(),
			value: value
		}))
	}
};
var tomitProductInventoryInfo = {
	zoomLevel: 9,
	activeProduct: {},
	latestCollectionData: [],
	storeSelector: "",
	loadedProducts: [],
	productJson: null,
	buttonDisabled: !1,
	blockDisabling: !1,
	originalButton: "",
	selectedVariantId: "",
	customerPos: "0,0",
	renderLocationSelector: function(elem, locations) {
		var e = document.createElement("select");
		e.onchange = tomitProductInventoryInfo.TomITGlobalLocationChangeHandler;
		e.name = 'tomit_store_selector';
		var storeNameHolder = document.getElementById('tomitLocName');
		selectedLocation = tomitStorageSystem.get("TomITGlobalSelectedLocation");
		for (var i = 0; i < locations.length; i++) {
			if (locations[i].enabled == 0) {
				continue
			}
			if (storeNameHolder != null && i == 0) {
				storeNameHolder.innerText = locations[i].name
			}
			selectoption = document.createElement('option');
			selectoption.text = locations[i].name;
			selectoption.dataset.location = locations[i].name;
			selectoption.value = locations[i].id
			if (selectedLocation == locations[i].id) {
				selectoption.setAttribute('selected', 'selected');
				storeNameHolder.innerText = locations[i].name
			}
			e.appendChild(selectoption)
		}
		tomitProductInventoryInfo.storeSelector = e;
		elem.appendChild(e)
	},
	loadLocations: function() {
		return new Promise(function(n, o) {
            let e = "https://shopify-inventory-app-dot-decathlonau-hxbx.ts.r.appspot.com/locations",
				r = new XMLHttpRequest();
            const fallback_function = function () {
                const fallback_api = "https://inventory.tom-it.nl/pickup/locations/" + Shopify.shop;
                let r2 = new XMLHttpRequest();
                r2.open("GET", fallback_api, !0), r2.onload = function() {
                    if (200 === r2.status) {
                        var t = JSON.parse(r2.responseText);
                        n(t);
                    } else {
                        o("error");
                    }
                };
                r2.send();
            };
            r.open("GET", e, !0), r.timeout = 3500, r.onload = function() {
				if (200 === r.status) {
					var t = JSON.parse(r.responseText);
					n(t);
				} else {
                    fallback_function();
                }
			}, r.ontimeout = fallback_function, r.onerror = fallback_function;
			r.send();
		})
	},
	getVariantInventory: function(variantId) {
		return new Promise(function(n, o) {
            // This endpoint doesn't have fallback functionality as it's out of scope
			let e = "https://inventory.tom-it.nl/variant/" + Shopify.shop + "/" + variantId + '/' + tomitProductInventoryInfo.customerPos;
			r = new XMLHttpRequest();
			r.open("GET", e, !0), r.onload = function() {
				if (200 === r.status) {
					var t = JSON.parse(r.responseText);
					n(t)
				} else o("error")
			}
			r.send()
		})
	},
	dispatchLoadedEvent: function() {
		var ev = new CustomEvent("tomitLoaded", {
			detail: {
				message: 'TomIT Loaded'
			},
			bubbles: !0,
			cancelable: !0
		});
		document.dispatchEvent(ev)
	},
	dispatchProductLoadedEvent: function() {
		var ev = new CustomEvent("tomitProductLoaded", {
			detail: {
				message: 'product Loaded'
			},
			bubbles: !0,
			cancelable: !0
		});
		document.dispatchEvent(ev)
	},
	setBlockDisabling: function(disableBlock) {
		this.blockDisabling = disableBlock
	},
	stripHtml: function(html) {
		var tmp = document.createElement("DIV");
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || ""
	},
	listInventory: function(t, useDropdown, mutlipleLists = !1, usePickup = !0, force = !1) {
		var n = document.createElement("ul");
		if (mutlipleLists == !1) {
			n.id = "tomit_inventory_list"
		} else {
			n.className = "tomit_inventory_list"
		}
		var hasPickupOptions = !1;
		var options = [];
		var selectoption;
		selectedGlobalLocation = tomitStorageSystem.get("TomITGlobalSelectedLocation");
		var locationLength = t.length;
		for (var o = 0; o < locationLength; o++) {
			if (useDropdown) {
				if (t[o].pickupOption == !0) {
					selectoption = document.createElement('option');
					selectoption.text = tomitProductInventoryInfo.stripHtml(t[o].name) + ' - ' + tomitProductInventoryInfo.stripHtml(t[o].available);
					selectoption.value = "pickup " + tomitProductInventoryInfo.stripHtml(t[o].name);
					selectoption.dataset.loc = t[o].id;
					if (t[o].inStock <= 0) {
						selectoption.disabled = !0
					} else {
						var selectedLoc = tomitStorageSystem.get("TomITSelectedLocation");
						if (selectedLoc == "pickup " + t[o].name) {
							selectoption.selected = !0
						}
					}
					options.push(selectoption)
				}
				if (t[o].pickupOption == !0) {
					hasPickupOptions = !0
				}
			} else {
				if (typeof(t[o]) !== 'undefined') {
					var e = document.createElement("li");
					e.setAttribute('data-loc', t[o].id);
					if (t[o].inStock >= 1) {
						e.classList.add('tomitIsInStock')
					} else {
						e.classList.add('tomitIsOutOfStock')
					}
					var radioSelectBtn = "";
					if (t[o].pickupOption == !0 && (ShopifyAnalytics.meta.page.pageType == "product" || force == !0) && usePickup == !0) {
						hasPickupOptions = !0;
						var pickupDisabled = '';
						var selectedLoc = tomitStorageSystem.get("TomITSelectedLocation");
						pickupStyle = '';
						if (t[o].inStock == 0) {
							pickupDisabled = 'disabled';
							pickupStyle = 'style="opacity:.8";'
						}
						var atcBtn = document.querySelector("form[action='/cart/add'] button[name='add']") == null ? document.querySelector("form[action='/cart/add'] input[name='add']") : document.querySelector("form[action='/cart/add'] button[name='add']");
						if (atcBtn == null) {
							var atcBtn = document.querySelector("button[name='add']") == null ? document.querySelector("form input[name='add']") : document.querySelector("button[name='add']")
						}
						if (t[o].inStock <= 0 && (selectedGlobalLocation != null && selectedGlobalLocation == t[o].id)) {
							if (atcBtn.disabled == !1) {
								if (this.buttonDisabled == !1) {
									this.originalButton = atcBtn.cloneNode(!0)
								}
								this.buttonDisabled = !0;
								atcBtn.setAttribute("disabled", "disabled");
								atcBtn.innerHTML = "No inventory in your location"
							}
						} else if (t[0].inStock == 1 && this.buttonDisabled == !0) {
							console.log("re-enable");
							atcBtn.parentNode.replaceChild(this.originalButton, atcBtn);
							this.buttonDisabled = !1
						}
						var checked = '';
						if ((selectedLoc == "pickup " + t[o].name && t[o].inStock != 0) && (selectedGlobalLocation == null || selectedGlobalLocation == t[o].id)) {
							checked = 'checked'
						}
						radioSelectBtn = '<input type="radio"  name="properties[Shipping Option]" value = "pickup ' + t[o].name + '" ' + pickupDisabled + ' onClick="tomitProductInventoryInfo.TomITChangeHandler(event)" ' + checked + ' />';
						e.innerHTML = "<label " + pickupStyle + ">" + radioSelectBtn + " " + t[o].name + ": <strong>" + t[o].available + "</strong></label>", n.appendChild(e)
					} else {
						if (t[o].available == "<span class='tomItInventoryLocationLowStock'></span>" || t[o].available == "<span class='tomItInventoryLocationHighStock'></span>" || t[o].available == "<span class='tomItInventoryLocationOutOfStock'></span>" || (typeof(t[o].available) == "string" && t[o].available.indexOf("><") > -1)) {
							e.innerHTML = "<small><span class='location'>" + t[o].name, n.appendChild(e) + "</span></small>"
						} else {
							e.innerHTML = "<small><span class='location'>" + t[o].name + ":</span><strong class='stockCount'> " + t[o].available + "</strong></small>", n.appendChild(e)
						}
					}
				}
			}
		}
		if (hasPickupOptions) {
			if (useDropdown) {
				var e = document.createElement("select");
				e.onchange = tomitProductInventoryInfo.TomITChangeHandler;
				e.name = 'properties[Shipping Option]';
				var firstOption = document.createElement('option');
				firstOption.text = 'Ship To Me';
				e.appendChild(firstOption);
				for (var i = 0; i < options.length; ++i) {
					e.appendChild(options[i])
				}
				n.prepend(e)
			} else {
				var e = document.createElement("li");
				radioSelectBtn = '<label><input type="radio" name="properties[Shipping Option]" value = "Ship to me" checked="true"> Ship To Me</label>';
				e.innerHTML = radioSelectBtn;
				n.prepend(e)
			}
		}
		return n
	},
	showCollectionInventory(selector, addAfter, productIds, display = !0) {
		tomitProductInventoryInfo.getProductsInventoryInformation(productIds).then(function(e) {
			tomitProductInventoryInfo.latestCollectionData = e;
			var items = document.querySelectorAll(selector);
			for (var i = 0; i < items.length; i++) {
				var prodId = parseInt(items[i].dataset.productId);
				var variantId = items[i].dataset.variantId;
				if (e[prodId] != undefined && e[prodId].product.variants != undefined) {
					var elem = document.createElement('div');
					if (display == !0) {
						elem.append(tomitProductInventoryInfo.listInventory(e[prodId].product.variants[variantId].inventoryItem.locations, !0))
					} else {
						elem.classList.add('tomit_inventory_list')
					}
					items[i].querySelector(addAfter).parentNode.insertBefore(elem, items[i].querySelector(addAfter).nextSibling)
				}
			}
			var event = new Event('change');
			event.target = tomitProductInventoryInfo.storeSelector;
			tomitProductInventoryInfo.storeSelector.dispatchEvent(event)
		})
	},
	TomITGlobalLocationChangeHandler: function(e) {
		var storeNameHolder = document.getElementById('tomitLocName');
		if (storeNameHolder) {
			storeNameHolder.innerText = e.target[e.target.selectedIndex].dataset.location;
			if (ShopifyAnalytics.meta.page.pageType == 'product') {
				location.reload()
			}
		}
		tomitProductInventoryInfo.updateInventoryInfo(e.target.value);
		tomitStorageSystem.set("TomITGlobalSelectedLocation", e.target.value);
		tomitStorageSystem.set("TomITSelectedLocation", 'pickup ' + e.target[e.target.selectedIndex].dataset.location)
	},
	businessHourDetails: function(businessHour) {
		let time = "";
		let timings = businessHour.time;
		let openTime = "";
		let closeTime = "";
		let openHours = timings.open.hours || 0;
		openHours = openHours > 9 ? openHours : "0" + openHours;
		let openMinutes = timings.open.minutes || 0;
		openMinutes = openMinutes > 9 ? openMinutes : "0" + openMinutes;
		let closeHours = timings.close.hours || 0;
		closeHours = closeHours > 9 ? closeHours : "0" + closeHours;
		let closeMinutes = timings.close.minutes || 0;
		closeMinutes = closeMinutes > 9 ? closeMinutes : "0" + closeMinutes;
		openTime += openHours > 11 ? (openHours % 12) + ":" + openMinutes + "pm" : openHours + ":" + openMinutes + "am";
		closeTime += closeHours > 11 ? (closeHours % 12) + ":" + closeMinutes + "pm" : closeHours + ":" + closeMinutes + "am";
		time = openTime + "-" + closeTime;
		let closed = businessHour.closed ? "&nbsp;(Closed)" : "";
		if (businessHour.closed == !0) {
			detail = '<span style="display:inline-block;margin:4px 0;"><strong>' + businessHour.day + ' : </strong>' + closed + '</span>'
		} else {
			detail = '<span style="display:inline-block;margin:4px 0;"><strong>' + businessHour.day + ' : </strong></span><span class="right-hours-embedded">' + time + '</span>'
		}
		return detail
	},
	attachVariantInformationOnGoogleMapEvents: function() {
		if (document.getElementById("inventoryLocation-store-pickup-button")) {
			document.getElementById("inventoryLocation-store-pickup-button").addEventListener("click", function() {
				var n = document.getElementById("inventoryLocationInformationModal");
				n.style.display = 'block'
			})
		}
		if (document.querySelector('.inventoryLocation-information-modal-close')) {
			document.querySelector('.inventoryLocation-information-modal-close').addEventListener("click", function() {
				var n = document.getElementById("inventoryLocationInformationModal");
				n.style.display = 'none'
			})
		}
	},
	updateInventoryInfo: function(e) {
		var displayedProducts = document.querySelectorAll('[data-product-id]');
		var elements = document.getElementsByClassName('tomitOutOfStockMessage');
		while (elements.length > 0) {
			elements[0].parentNode.removeChild(elements[0])
		}
		for (var i = 0; i < displayedProducts.length; i++) {
			if (typeof tomitProductInventoryInfo.latestCollectionData[displayedProducts[i].dataset.productId] != undefined) {
				var prod = tomitProductInventoryInfo.latestCollectionData[displayedProducts[i].dataset.productId];
				if (!prod) {
					continue
				}
				currentProd = prod.product;
				var allOutOfStock = !0;
				for (key in currentProd.variants) {
					for (loc in currentProd.variants[key].inventoryItem.locations) {
						if (currentProd.variants[key].inventoryItem.locations[loc].id == e) {
							if (currentProd.variants[key].inventoryItem.locations[loc].inStock > 0) {
								allOutOfStock = !1
							}
						}
					}
				}
				if (allOutOfStock) {
					var inv = document.createElement('div');
					inv.innerText = "Out of Stock";
					inv.classList.add('tomitOutOfStockMessage');
					displayedProducts[i].querySelector('.tomit_inventory_list').appendChild(inv)
				}
			}
		}
	},
	TomITChangeHandler: function(e) {
		tomitStorageSystem.set("TomITSelectedLocation", e.target.value)
	},
	getProductsLocations: function() {
		return new Promise(function(n, o) {
            // This endpoint doesn't have fallback functionality as it's out of scope
            // It also seems likely they're no longer using it
			let e = "https://inventory.tom-it.nl/api/locations/information/" + Shopify.shop,
				r = new XMLHttpRequest();
			r.open("GET", e, !0), r.onload = function() {
				if (200 === r.status) {
					var t = JSON.parse(r.responseText);
					n(t)
				} else o("error")
			}, r.send()
		})
	},
	listInventoryCart: function(t, useDropdown) {
		var n = document.getElementById("tomit_inventory_list_cart");
		if (n === null) {
			n = document.createElement("ul");
			n.id = "tomit_inventory_list_cart"
		}
		var options = [];
		var selectoption;
		t = Object.values(t);
		var selectedOption = tomitStorageSystem.get("TomITSelectedLocation");
		for (var o = 0; o < t.length; o++) {
			if (useDropdown) {
				if (t[o].allowPickup == !0) {
					selectoption = document.createElement('option');
					selectoption.text = t[o].displayName;
					if (selectedOption == 'pickup ' + t[o].displayName) {
						selectoption.selected = 'selected'
					}
					selectoption.value = "pickup " + tomitProductInventoryInfo.stripHtml(t[o].displayName);
					selectoption.setAttribute('data-loc', t[o].locationId);
					if (t[o].inStock <= 0) {
						selectoption.disabled = !0
					}
					options.push(selectoption)
				}
			} else {
				if (t[o].pickupOption == !0) {
					var e = document.createElement("li");
					e.setAttribute('data-loc', t[o].locationId);
					var radioSelectBtn = "";
					radioSelectBtn = '<input type="radio" name="properties_shipping_option" value = "pickup ' + t[o].displayName + '" ' + ' />';
					e.innerHTML = "<label>" + radioSelectBtn + t[o].displayName + "</label>";
					n.appendChild(e)
				}
			}
		}
		if (useDropdown) {
			var e = document.getElementsByName('properties_shipping_option');
			if (!e.length) {
				labelHolder = document.createElement("label");
				labelHolder.innerHTML = "<small><strong>Select Shipping or Store Pickup Option</strong></small><br />";
				e = document.createElement("select");
				e.name = 'properties_shipping_option'
			}
			var blankOption = document.createElement('option');
			blankOption.text = 'Select location';
			blankOption.disabled = !0;
			e = typeof e[0] !== "undefined" ? e[0] : e;
			e.appendChild(blankOption);
			var firstOption = document.createElement('option');
			firstOption.text = 'ship to me';
			e.appendChild(firstOption);
			for (var i = 0; i < options.length; ++i) {
				e.appendChild(options[i])
			}
			labelHolder.appendChild(e);
			n.prepend(labelHolder)
		} else {
			var e = document.createElement("li");
			if (n.childNodes.length === 1) {
				radioSelectBtn = '<label><input type="radio" name="properties_shipping_option" value = "Ship to me" checked="true"> Ship to me</label>';
				e.innerHTML = radioSelectBtn;
				n.prepend(e)
			}
		}
		return n
	},
	validateCart: function(id) {
		var validLocations = [];
		tomitProductInventoryInfo.getCartItems().then(function(e) {
			var productIds = [];
			e.items.forEach(function(item) {
				productIds.push(item.product_id)
			});
			tomitProductInventoryInfo.getProductsInventoryInformation(productIds).then(function(inventoryProduct) {
				var productCount = 1;
				console.log("Check Qs pre location");
				console.log(e.items);
				e.items.forEach(function(i) {
					var variantLocations = [];
					if ((inventoryProduct[i.product_id].product.variants[i.id].inventoryManagement == "NOT_MANAGED" || inventoryProduct[i.product_id].product.variants[i.id].inventoryPolicy == "CONTINUE") && inventoryProduct[i.product_id].product.variants[i.id].inventoryItem.locations.length == 0) {
						validLocations.push(123)
					}
					inventoryProduct[i.product_id].product.variants[i.id].inventoryItem.locations.forEach(function(location) {
						console.log("..", validLocations);
						if (location.q >= i.quantity || inventoryProduct[i.product_id].product.variants[i.id].inventoryManagement == "NOT_MANAGED" || inventoryProduct[i.product_id].product.variants[i.id].inventoryPolicy == "CONTINUE") {
							if (productCount == 1) {
								validLocations.push(location.id)
							}
						} else {
							console.log("12");
							if (validLocations.includes(location.id)) {
								for (var x = 0; x < validLocations.length; x++) {
									if (validLocations[x] === location.id) {
										validLocations.splice(x, 1)
									}
								}
							}
						}
						if (productCount > 1) {
							console.log("13");
							variantLocations.push(location.id)
						}
					});
					if (productCount > 1) {
						validLocations.forEach(function(val) {
							if (!variantLocations.includes(val)) {
								for (var x = 0; x < validLocations.length; x++) {
									if (validLocations[x] === val) {
										validLocations.splice(x, 1)
									}
								}
							}
						})
					}
					console.log("c", productCount);
					productCount++
				});
				if (validLocations.length == 0) {
					var firstdiv = document.createElement("div");
					var div = document.createElement("div");
					var strong = document.createElement("strong");
					var small = document.createElement("small");
					firstdiv.style.width = '100%';
					firstdiv.appendChild(div);
					strong.innerHTML = "Different pick-up locations are selected"
					small.innerHTML = "Please make sure to only select one pickup location"
					div.id = 'multipleLocationWarning';
					var checkout = document.getElementsByName("checkout");
					div.append(strong);
					console.log(checkout);
					if (document.getElementById('multipleLocationWarning')) {
						document.getElementById('multipleLocationWarning').parentNode.removeChild(document.getElementById('multipleLocationWarning'))
					}
					if (id == undefined) {
						checkout[checkout.length - 1].parentNode.insertBefore(firstdiv, checkout[checkout.length - 1])
					} else {
						document.getElementById(id).append(firstdiv)
					}
					strong.append(small);
					var css = '#multipleLocationWarning {background-color: #ffffd7; border: 1px solid gray;width: auto;text-align:center;margin-bottom: 10px;padding: 7px; font-size: .8em; border-radius:10px;} #multipleLocationWarning small { display:block;}';
					var styleSheet = document.createElement("style");
					styleSheet.type = "text/css";
					styleSheet.innerText = css;
					document.head.appendChild(styleSheet)
				} else {}
			})
		})
	},
	editMaxQuantityCart: function() {
		tomitProductInventoryInfo.getCartItems().then(function(e) {
			var productIds = [];
			e.items.forEach(function(i) {
				productIds.push(i.product_id)
			});
			tomitProductInventoryInfo.getProductsInventoryInformation(productIds).then(function(inventoryProduct) {
				var cartProducts = document.getElementsByName("updates[]");
				var i = 0;
				cartProducts.forEach(function(product) {
					locations = inventoryProduct[e.items[i].product_id].product.variants[e.items[i].variant_id].inventoryItem.locations;
					product.max = inventoryProduct[e.items[i].product_id].product.variants[e.items[i].variant_id].inventoryItem.locations[0].q;
					i++
				})
			})
		})
	},
	showInventoryOnCart: function() {
		let productIds = [];
		var productList = document.querySelectorAll('[data-tomit-variant-id]');
		var elements = document.getElementsByClassName('tomit_inventory_list');
		if (elements != null) {
			while (elements.length > 0) {
				elements[0].parentNode.removeChild(elements[0])
			}
		}
		if (productList != null) {
			productList.forEach(function(item) {
				productIds.push(item.getAttribute('data-tomit-product-id'))
			});
			tomitProductInventoryInfo.getProductsInventoryInformation(productIds).then(function(e) {
				document.querySelectorAll('[data-tomit-variant-id]').forEach(function(a) {
					var prodId = parseInt(a.getAttribute('data-tomit-product-id'));
					var variantId = a.getAttribute('data-tomit-variant-id');
					if (e[prodId] != undefined && e[prodId].product.variants != undefined) {
						if (e[prodId].product.variants[variantId] != undefined) {
							a.append(tomitProductInventoryInfo.listInventory(e[prodId].product.variants[variantId].inventoryItem.locations, !1, !0))
						}
					}
				})
			})
		}
	},
	editMaxQuantity: function(locations) {
		var max = locations[0].q;
		tomitProductInventoryInfo.getCartItems().then(function(e) {
			e.items.forEach(function(e) {
				if (e.id == tomitProductInventoryInfo.selectedVariantId) {
					max = locations[0].q - e.quantity
				}
			});
			var qty = document.querySelectorAll("input[type='number'][name='quantity']");
			qty[0].max = max
			if (max < 1) {
				qty[0].min = 0;
				qty[0].value = 0;
				qty[0].disabled = !0
				let small = document.createElement("small");
				small.className = 'MaxQuantity';
				small.style.fontSize = '70%';
				small.innerHTML = "Max quantity in cart";
				qty[0].after(small)
			} else {
				if (qty[0].disabled == !0) {
					qty[0].disabled = !1;
					if (qty[0].value == 0) {
						qty[0].value = 1
					}
					let msg = document.getElementsByClassName('small');
					if (msg && msg[0]) {
						msg[0].parentNode.removeChild(msg)
					}
				}
			}
		})
	},
	showWarningOnCartPage: function(id) {
		tomitProductInventoryInfo.getCartItems().then(function(cart) {
			var multiplePickup = !1;
			cart.items.forEach(function(e) {
				if (e.properties["Shipping Option"] != cart.items[0].properties["Shipping Option"]) {
					multiplePickup = !0
				}
			});
			console.log({
				multiplePickup
			});
			if (multiplePickup == !0) {
				var firstdiv = document.createElement("div");
				var div = document.createElement("div");
				var strong = document.createElement("strong");
				var small = document.createElement("small");
				firstdiv.style.width = '100%';
				firstdiv.appendChild(div);
				strong.innerHTML = "The selected items can't be shipped from one location";
				small.innerHTML = "Make sure that the items in you cart can be shipped from one location";
				div.id = 'multiplePickupWarning';
				var checkout = document.getElementsByName("checkout");
				div.append(strong);
				console.log(div);
				if (id == undefined) {
					checkout[checkout.length - 1].parentNode.insertBefore(firstdiv, checkout[checkout.length - 1])
				} else {
					document.getElementById(id).append(firstdiv)
				}
				strong.append(small);
				var css = '#multiplePickupWarning {background-color: #ffffd7; border: 1px solid gray;width: 100%;margin-bottom: 10px;padding: 7px; font-size: .8em; border-radius:10px; text-align:center;} #multiplePickupWarning small { display:block;}';
				var styleSheet = document.createElement("style");
				styleSheet.type = "text/css";
				styleSheet.innerText = css;
				document.head.appendChild(styleSheet)
			}
		})
	},
	ShowInventoryOnCollection: function() {
		if (typeof(ShopifyAnalytics.meta.page) != "undefined") {
			if (ShopifyAnalytics.meta.page.pageType == "collection") {
				let productIds = [];
				var productList = document.querySelectorAll('[data-tomit-variant-id]');
				if (productList != null) {
					productList.forEach(function(item) {
						productIds.push(item.getAttribute('data-tomit-product-id'))
					});
					tomitProductInventoryInfo.getProductsInventoryInformation(productIds).then(function(e) {
						document.querySelectorAll('[data-tomit-variant-id]').forEach(function(a) {
							var prodId = parseInt(a.getAttribute('data-tomit-product-id'));
							var variantId = a.getAttribute('data-tomit-variant-id');
							if (e[prodId] != undefined && e[prodId].product.variants != undefined) {
								if (e[prodId].product.variants[variantId] != undefined) {
									a.append(tomitProductInventoryInfo.listInventory(e[prodId].product.variants[variantId].inventoryItem.locations, !1, !0))
								}
							}
						})
					})
				}
			}
		}
	},
	getCartItems: function() {
		return new Promise(function(n, o) {
			let e = "/cart.js",
				r = new XMLHttpRequest();
			r.open("GET", e, !0), r.onload = function() {
				if (200 === r.status) {
					var t = JSON.parse(r.responseText);
					n(t)
				} else o("error")
			}, r.send()
		})
	},
	sendBenchMark: async function(shopUrl, startTime, endTime, cached) {
        // This endpoint doesn't have fallback functionality as it's out of scope
        // It also seems likely they're no longer using it
		var url = `https://inventory.tom-it.nl/benchmark/${shopUrl}/${startTime}/${endTime}/${cached}`;
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", url, !0);
		xmlHttp.send(null);
		return xmlHttp.responseText
	},
	listLocationsInformation: function(t) {
		let obj = document.getElementById('tomit_inventory_locations_list');
		if (obj) obj.remove();
		let n = document.createElement("ul");
		n.id = "tomit_inventory_locations_list";
		for (var o = 0; o < t.length; o++) {
			if (t[o].pickupOption == !0) {
				var e = document.createElement("li");
				e.setAttribute('data-location', t[o].locationId);
				if (t[o].inStock >= 1) {
					e.classList.add('tomitIsInStock')
				} else {
					e.classList.add('tomitIsOutOfStock')
				}
				var radioSelectBtn = "";
				radioSelectBtn = '<input type="radio" name="properties[Shipping Option]" value = "pickup ' + t[o].displayName + '" />';
				e.innerHTML = "<label> " + radioSelectBtn + t[o].displayName + "</label>";
				n.appendChild(e)
			}
		}
		return n
	},
	requestCustomerLocation: function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position, that) {
				tomitStorageSystem.set("tomitProductInventoryInfo.customerPos", position.coords.latitude + "," + position.coords.longitude, 86400);
				tomitProductInventoryInfo.customerPos = position.coords.latitude + "," + position.coords.longitude
			})
		}
	},
	requestLocation: function() {
		var product = ShopifyAnalytics.meta.product;
		if (typeof(product) != "undefined") {
			getProductInventoryInformation(product.id)
		}
		if (tomitProductInventoryInfo.customerPos != '0,0') {
			if (typeof ShopifyAnalytics != "undefined" && "product" == ShopifyAnalytics.meta.page.pageType && null != document.getElementById("inventoryLocationInformation")) {
				var product = ShopifyAnalytics.meta.product;
				getProductInventoryInformation(product.id)
			}
		} else {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position, that) {
					tomitStorageSystem.set("tomitProductInventoryInfo.customerPos", position.coords.latitude + "," + position.coords.longitude, 86400);
					tomitProductInventoryInfo.customerPos = position.coords.latitude + "," + position.coords.longitude;
					if (typeof ShopifyAnalytics != "undefined" && "product" == ShopifyAnalytics.meta.page.pageType && null != document.getElementById("inventoryLocationInformation")) {
						var product = ShopifyAnalytics.meta.product;
						getProductInventoryInformation(product.id)
					}
				}, function() {
					if (typeof ShopifyAnalytics != "undefined" && "product" == ShopifyAnalytics.meta.page.pageType && null != document.getElementById("inventoryLocationInformation")) {
						var product = ShopifyAnalytics.meta.product;
						getProductInventoryInformation(product.id)
					}
				})
			}
		}
	},
	showCurrentVariantInformation: function(t, selectVariantId = !1) {
		var n = document.getElementById("inventoryLocationInformation");
		if (selectVariantId != !1) {
			this.selectedVariantId = selectVariantId;
			o = tomitProductInventoryInfo.activeProduct.variants[selectVariantId]
		} else {
			if (typeof window.location.search.split('variant=')[1] != 'undefined') {
				var urlVariantId = window.location.search.split('variant=')[1].split('&')[0];
				if (typeof t.variants[urlVariantId] == 'undefined') {
					tomitProductInventoryInfo.getVariantInventory(urlVariantId).then(function(e) {
						if (typeof e.product.variants[urlVariantId] !== 'undefined') {
							t.variants[urlVariantId] = e.product.variants[urlVariantId];
							tomitProductInventoryInfo.showCurrentVariantInformation(t)
						}
					}).catch(function(error) {});
					return !1
				}
				var o = t.variants[urlVariantId]
			} else if (typeof ShopifyAnalytics != "undefined" && ShopifyAnalytics.meta.hasOwnProperty("selectedVariantId") && "" != ShopifyAnalytics.meta.selectedVariantId && t.variants[ShopifyAnalytics.meta.selectedVariantId] != null) {
				var o = t.variants[ShopifyAnalytics.meta.selectedVariantId]
			} else if (typeof ShopifyAnalytics != "undefined" && ShopifyAnalytics.meta.page.pageType == 'product') {
				o = t.variants[ShopifyAnalytics.meta.product.variants[0].id]
			} else {
				return !1
			}
			if (typeof(o) == "undefined" || o == null) {
				if (t == null) {
					console.log("AAA");
					this.selectedVariantId = null;
					return !1
				} else {
					console.log("BBBB");
					for (i in t.variants) {
						console.log(t.variants[i].id);
						this.selectedVariantId = t.variants[i].id;
						o = t.variants[i];
						break
					}
				}
			} else {
				this.selectedVariantId = o.id
			}
		}
		var e = document.getElementById("tomit_inventory_list");
		if (e && e.remove(), null != o.inventoryItem && null == o.inventoryItem.locations || null != o.inventoryItem && 0 == o.inventoryItem.locations.length) {
			(r = n.getElementsByClassName("inventoryLocationLoading")[0]) && r.remove();
			if (document.body.contains(document.getElementById('no_inventory_found_message'))) {
				document.getElementById('no_inventory_found_message').remove()
			}
			var infoText = document.createElement("span");
			infoText.id = 'no_inventory_found_message';
			infoText.innerHTML = '0';
			n.appendChild(infoText), n.style.display = 'block'
		} else {
			if (document.body.contains(document.getElementById('no_inventory_found_message'))) {
				document.getElementById('no_inventory_found_message').remove()
			}
			var r, i = this.listInventory(o.inventoryItem.locations, t.useDropdown);
			(r = n.getElementsByClassName("inventoryLocationLoading")[0]) && r.remove(), n.appendChild(i), n.style.display = 'block'
		}
		console.log("variant changed");
		var ev = new CustomEvent("tomitVariantChanged", {
			detail: {
				message: 'variant changed'
			},
			bubbles: !0,
			cancelable: !0
		});
		document.dispatchEvent(ev)
	},
	appendVariantInformationOnPopupStyle: function() {
		var css = `.inventoryLocation-information-modal{display:none;position:fixed;z-index:50;padding-top:100px;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:#000;background-color:rgba(0,0,0,.4)}#select-store{position:absolute;bottom:20px;right:20px}[data-inventory-map]{height:400px}.inventoryLocation-information-modal-content{background-color:#fefefe;margin:auto;padding:20px;border:1px solid #888;width:80%;position:relative;bottom:20px;right:20px}.inventoryLocation-information-modal-close{color:#aaa;float:right;font-size:28px;font-weight:700;position:absolute;top:0;right:3.75%}.inventoryLocation-information-modal-close:focus,.inventoryLocation-information-modal-close:hover{color:#000;text-decoration:none;cursor:pointer}.map-section-wrapper{padding-top:15px}@media  only screen and (max-width:600px){#inventoryLocationInformationModalBody{margin-left:10%;width:90%}#select-store{position:absolute;width:90%}#tomit_inventory_list{padding-bottom:40px}.inventoryLocation-information-modal-close{position:absolute;top:0;right:5%}.map-section-wrapper{padding-top:5%}}`,
			head = document.head || document.getElementsByTagName('head')[0];
		if (!document.getElementById('inventoryLocation-information-modal-style')) {
			var style = document.createElement('style');
			head.appendChild(style);
			style.type = 'text/css';
			style.id = 'inventoryLocation-information-modal-style';
			if (style.styleSheet) {
				style.styleSheet.cssText = css
			} else {
				style.appendChild(document.createTextNode(css))
			}
		}
	},
	setCartItemsShippingProperty: function(shippingOption, redirect = !0) {
		let xmlhttp = new XMLHttpRequest();
		xmlhttp.open('GET', '/cart.js', !0);
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					let cart = JSON.parse(xmlhttp.responseText);
					let cartItems = cart.items.map(function(item, index) {
						return {
							line: index + 1,
							properties: {
								"Shipping Option": shippingOption
							},
							quantity: item.quantity
						}
					});
					tomitProductInventoryInfo.tomitCartItemsQueue = [];
					for (var i = 0; i < cartItems.length; i++) {
						line = cartItems[i].line;
						properties = cartItems[i].properties;
						tomitProductInventoryInfo.tomitCartItemsQueue.push({
							line: line,
							properties: properties,
							quantity: cartItems[i].quantity
						})
					}
					tomitProductInventoryInfo.moveAlong = function() {
						if (tomitProductInventoryInfo.tomitCartItemsQueue.length) {
							var request = tomitProductInventoryInfo.tomitCartItemsQueue.shift();
							var data = request
							let xmlhttp = new XMLHttpRequest();
							xmlhttp.open('POST', '/cart/change.js', !0);
							xmlhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
							xmlhttp.onreadystatechange = function() {
								if (xmlhttp.readyState == 4) {
									if (xmlhttp.status == 200) {
										tomitProductInventoryInfo.moveAlong()
									} else {
										if (tomitProductInventoryInfo.tomitCartItemsQueue.length) {
											tomitProductInventoryInfo.moveAlong()
										} else {
											if (redirect) {
												window.location.reload()
											} else {
												var ev = new CustomEvent("tomitCartUpdated", {
													detail: {
														message: 'variant changed'
													},
													bubbles: !0,
													cancelable: !0
												});
												document.dispatchEvent(ev)
											}
										}
									}
								}
							}
							xmlhttp.send(JSON.stringify(data))
						} else {
							if (redirect) {
								window.location.reload()
							} else {
								var ev = new CustomEvent("tomitCartUpdated", {
									detail: {
										message: 'variant changed'
									},
									bubbles: !0,
									cancelable: !0
								});
								document.dispatchEvent(ev)
							}
						}
					};
					tomitProductInventoryInfo.moveAlong()
				}
			}
		}
		xmlhttp.send(null)
	},
	getAvailablePickupOptionsCart: t => new Promise((n, o) => {
        // This endpoint doesn't have fallback functionality as it's out of scope
        // It also seems likely they're no longer using it
		var e = "https://inventory.tom-it.nl/api/cart/" + Shopify.shop + "/" + JSON.stringify(t),
			r = new XMLHttpRequest;
		r.open("GET", e, !0), r.onload = function() {
			if (200 === r.status) {
				var t = JSON.parse(r.responseText);
				n(t)
			} else o("error")
		}, r.send()
	}),
	addCustomCss: function() {
		var styles = "";
		var styleSheet = document.createElement("style");
		var head = document.head || document.getElementsByTagName('head')[0];
		head.appendChild(styleSheet);
		styleSheet.type = 'text/css'
		styleSheet.appendChild(document.createTextNode(styles))
	},
	listInventoryPopup: function(t, useDropdown) {
		var n = document.createElement("ul");
		n.id = "tomit_inventory_list";
		var hasPickupOptions = !1;
		var options = [];
		var selectoption;
		for (var o = 0; o < t.length; o++) {
			if (useDropdown) {
				if (t[o].pickupOption == !0) {
					selectoption = document.createElement('option');
					selectoption.text = t[o].name + ' - ' + t[o].available;
					selectoption.value = "pickup " + tomitProductInventoryInfo.stripHtml(t[o].name);
					if (t[o].inStock <= 0) {
						selectoption.disabled = !0
					}
					options.push(selectoption)
				}
				if (t[o].pickupOption == !0) {
					hasPickupOptions = !0
				}
			} else {
				var e = document.createElement("li");
				e.setAttribute('data-loc', t[o].id);
				var radioSelectBtn = "";
				if (t[o].pickupOption == !0) {
					hasPickupOptions = !0;
					var pickupDisabled = '';
					if (t[o].inStock == 0) {
						pickupDisabled = 'disabled'
					}
					radioSelectBtn = '<input type="radio"  name="properties[Shipping Option]" value = "pickup ' + t[o].name + '" ' + pickupDisabled + '> ';
					e.innerHTML = "<label>" + radioSelectBtn + t[o].name + ": <strong>" + t[o].available + "</strong></label>", n.appendChild(e)
				} else {
					e.innerHTML = "<small>" + t[o].name + ": <strong>" + t[o].available + "</strong></small>", n.appendChild(e)
				}
			}
		}
		if (hasPickupOptions) {
			if (useDropdown) {
				var e = document.createElement("select");
				e.name = 'properties[Shipping Option]';
				var firstOption = document.createElement('option');
				firstOption.text = 'ship to me';
				e.appendChild(firstOption);
				for (var i = 0; i < options.length; ++i) {
					e.appendChild(options[i])
				}
				n.prepend(e)
			} else {
				var e = document.createElement("li");
				inputText = 'ship to me';
				radioSelectBtn = '<label><input type="radio" name="properties[Shipping Option]" value = "' + inputText + '" checked="true"> ' + inputText + '</label>';
				e.innerHTML = radioSelectBtn;
				n.prepend(e)
			}
		}
		return n
	},
	showCurrentVariantInformationOnPopupModal: function(t) {
		var n = document.getElementById("inventoryLocationInformation");
		if (typeof ShopifyAnalytics != "undefined" && "" != ShopifyAnalytics.meta.selectedVariantId && t.variants[ShopifyAnalytics.meta.selectedVariantId] != null && typeof window.location.search.split('variant=')[1] == 'undefined') var o = t.variants[ShopifyAnalytics.meta.selectedVariantId];
		else if (typeof window.location.search.split('variant=')[1] != 'undefined') var o = t.variants[window.location.search.split('variant=')[1]];
		else o = t.variants[ShopifyAnalytics.meta.product.variants[0].id];
		if (typeof o == 'undefined') {
			var urlVariantId = window.location.search.split('variant=')[1].split('&')[0];
			tomitProductInventoryInfo.getVariantInventory(urlVariantId).then(function(e) {
				if (typeof e.product.variants[urlVariantId] !== 'undefined') {
					t.variants[urlVariantId] = e.product.variants[urlVariantId];
					tomitProductInventoryInfo.showCurrentVariantInformationOnPopupModal(t)
				}
			});
			return
		}
		this.selectedVariantId = o.id;
		var e = document.getElementById("tomit_inventory_list");
		if (e && e.remove(), null != o.inventoryItem && null == o.inventoryItem.locations || null != o.inventoryItem && 0 == o.inventoryItem.locations.length) {
			(r = n.getElementsByClassName("inventoryLocationLoading")[0]) && r.remove();
			n.style.display = 'none'
		} else {
			if (document.body.contains(document.getElementById('no_inventory_found_message'))) {
				document.getElementById('no_inventory_found_message').remove()
			}
			var inventoryLocationStorePickupButtonText = "Select Store for Pickup";
			if (document.getElementById("inventoryLocation-store-pickup-button")) {
				var modalHtml = `<span id="selectedStore" style="margin-left: 10px;"></span></div><div id="inventoryLocationInformationModal" class="inventoryLocation-information-modal"><div id="inventoryLocationInformationModalBody" class="inventoryLocation-information-modal-content"><span class="inventoryLocation-information-modal-close">&times;</span></div><div id="inventoryLocationInformationModalFooter"></div>`;
				document.getElementById("inventoryLocation-store-pickup-button").parentNode.insertAdjacentHTML('beforeend', modalHtml)
			} else {
				var modalHtml = `
                <div style="cursor:pointer;">
                    <span id="inventoryLocation-store-pickup-button" class="btn btn--secondary-accent" style="width:50%; min-width:270px;">
                        ${inventoryLocationStorePickupButtonText}
                    </span>
                    <span id="selectedStore" style="margin-left: 10px;"></span>
                    </div>
                    <div id="inventoryLocationInformationModal" class="inventoryLocation-information-modal">
                        <div id="inventoryLocationInformationModalBody" class="inventoryLocation-information-modal-content">
                        <span class="inventoryLocation-information-modal-close">&times;</span>
                                            </div>
                    <div id="inventoryLocationInformationModalFooter"></div>
                </div>`;
				n.innerHTML = modalHtml
			}
			var useDropDown = t.useDropdown;
			var r, i = this.listInventoryPopup(o.inventoryItem.locations, 0);
			var k = document.getElementById("inventoryLocationInformationModalBody");
			(r = n.getElementsByClassName("inventoryLocationLoading")[0]) && r.remove(), k.appendChild(i), n.style.display = 'block'
		}
		this.attachVariantInformationOnGoogleMapEvents();
		var ev = new CustomEvent("tomitVariantChanged", {
			detail: {
				message: 'variant changed'
			},
			bubbles: !0,
			cancelable: !0
		});
		document.dispatchEvent(ev)
	},
	disableAtc: function(text = '') {
		console.log("disable1");
		var atcBtn = document.querySelector("form[action='/cart/add'] button[name='add']") == null ? document.querySelector("form[action='/cart/add'] input[name='add']") : document.querySelector("form[action='/cart/add'] button[name='add']");
		if (atcBtn == null) {
			var atcBtn = document.querySelector("button[name='add']") == null ? document.querySelector("form input[name='add']") : document.querySelector("button[name='add']")
		}
		if (atcBtn.disabled == !1) {
			console.log("disabled was false");
			if (this.buttonDisabled == !1) {
				this.originalButton = atcBtn.cloneNode(!0)
			}
			atcBtn.setAttribute("disabled", "disabled")
		}
		this.buttonDisabled = !0;
		if (text != null && text.length > 0) {
			atcBtn.innerHTML = text
		} else {
			atcBtn.innerHTML = 'product not available'
		}
	},
	enableAtc: function(btnText = !1) {
		var atcBtn = document.querySelector("form[action='/cart/add'] button[name='add']") == null ? document.querySelector("form[action='/cart/add'] input[name='add']") : document.querySelector("form[action='/cart/add'] button[name='add']");
		if (atcBtn == null) {
			var atcBtn = document.querySelector("button[name='add']") == null ? document.querySelector("form input[name='add']") : document.querySelector("button[name='add']")
		}
		if (atcBtn.disabled == !0 || this.buttonDisabled == !0) {
			atcBtn.disabled = !1;
			if (btnText != !1) {
				console.log("update btn text");
				this.originalButton.value = btnText
			}
			atcBtn.parentNode.replaceChild(this.originalButton, atcBtn);
			this.buttonDisabled = !1
		}
	},
	getProductsInventoryInformation: t => new Promise((n, o) => {
		var e = "https://shopify-inventory-app-dot-decathlonau-hxbx.ts.r.appspot.com/products/" + JSON.stringify(t),
			r = new XMLHttpRequest;

        const fallback_function = function(event) {
            const fallback_api = "https://inventory.tom-it.nl/api/products/" + Shopify.shop + "/" + JSON.stringify(event.target.product_id_array) + "/" + tomitProductInventoryInfo.customerPos;
            let r2 = new XMLHttpRequest();
            r2.open("GET", fallback_api, !0), r2.onload = function() {
                if (200 === r2.status) {
                    var t = JSON.parse(r2.responseText);
                    n(t);
                } else {
                    o("error");
                }
            };
            r2.send();
        };
		r.open("GET", e, !0), r.timeout = 3500, r.product_id_array = t, r.onload = function(event) {
            if (200 === r.status) {
                var t = JSON.parse(r.responseText);
                n(t)
            } else {
                fallback_function(event);
            }
        }, r.ontimeout = fallback_function, r.onerror = fallback_function, r.send()
	})
};

function getProductInventoryInformation(t, reload = !1) {
	if ((tomitProductInventoryInfo.productJson == null || tomitProductInventoryInfo.productJson.length <= 2) || reload == !0) {
		let countryCode = "";
		var n = "https://shopify-inventory-app-dot-decathlonau-hxbx.ts.r.appspot.com/product/" + t,
			o = new XMLHttpRequest;

        const fallback_function = function (event) {
            const fallback_api = "https://inventory.tom-it.nl/api/product/" + Shopify.shop + "/" + event.target.product_id + "/" + tomitProductInventoryInfo.customerPos + countryCode;
            let o2 = new XMLHttpRequest();
            o2.open("GET", fallback_api, !0), o2.onload = function() {
                if (200 === o2.status) {
                    var t = JSON.parse(o2.responseText);
                    tomitProductInventoryInfo.activeProduct = t.product, tomitProductInventoryInfo.showCurrentVariantInformation(tomitProductInventoryInfo.activeProduct);
                    tomitProductInventoryInfo.dispatchProductLoadedEvent()
                }
            };
            o2.send();
        };
		o.open("GET", n, !0), o.timeout = 3500, o.product_id = t, o.onload = function (event) {
            if (200 === o.status) {
                var t = JSON.parse(o.responseText);
				tomitProductInventoryInfo.activeProduct = t.product, tomitProductInventoryInfo.showCurrentVariantInformation(tomitProductInventoryInfo.activeProduct);
				tomitProductInventoryInfo.dispatchProductLoadedEvent()
            } else {
                fallback_function(event);
            }
        }, o.ontimeout = fallback_function, o.onerror = fallback_function, o.send()
	} else {
		let productId = t;
		var t = JSON.parse(tomitProductInventoryInfo.productJson);
		tomitProductInventoryInfo.activeProduct = t.product, tomitProductInventoryInfo.showCurrentVariantInformation(tomitProductInventoryInfo.activeProduct);
		tomitProductInventoryInfo.dispatchProductLoadedEvent();
		getProductInventoryInformation(productId, !0)
	}
}

function getProductInventoryInformationOnPopupModal(t) {
	var n = "https://shopify-inventory-app-dot-decathlonau-hxbx.ts.r.appspot.com/product/" + t;
	o = new XMLHttpRequest;

    const fallback_function = function(event) {
        const fallback_api = "https://inventory.tom-it.nl/api/product/" + Shopify.shop + "/" + event.target.product_id + "/" + tomitProductInventoryInfo.customerPos;
        let o2 = new XMLHttpRequest();
        o2.open("GET", fallback_api, !0), o2.onload = function() {
            if (200 === o2.status) {
                var t = JSON.parse(o2.responseText);
                tomitProductInventoryInfo.activeProduct = t.product, tomitProductInventoryInfo.showCurrentVariantInformationOnPopupModal(tomitProductInventoryInfo.activeProduct);
                tomitProductInventoryInfo.dispatchProductLoadedEvent();
            }
        };
        o2.send();
    }
    o.open("GET", n, !0), o.timeout = 3500, o.product_id = t, o.onload = function(event) {
        if (200 === o.status) {
            var t = JSON.parse(o.responseText);
            tomitProductInventoryInfo.activeProduct = t.product, tomitProductInventoryInfo.showCurrentVariantInformationOnPopupModal(tomitProductInventoryInfo.activeProduct);
			tomitProductInventoryInfo.dispatchProductLoadedEvent();
        } else {
            fallback_function(event);
        }
    }, o.ontimeout = fallback_function, o.onerror = fallback_function, o.send()
}
tomitProductInventoryInfo.dispatchLoadedEvent();
if (typeof ShopifyAnalytics != "undefined" && ("product" == ShopifyAnalytics.meta.page.pageType || "collection" == ShopifyAnalytics.meta.page.pageType || typeof(ShopifyAnalytics.meta.page.pageType) == "undefined") && (null != document.getElementById("inventoryLocationInformation"))) {
	var product = ShopifyAnalytics.meta.product;
	getProductInventoryInformation(product.id)
}
if (null != document.getElementById("tomitStoreSelector")) {
	var locSelector = document.getElementById("tomitStoreSelector");
	var availableLocations = tomitStorageSystem.get("TomITLocations");
	if (!availableLocations) {
		tomitProductInventoryInfo.loadLocations().then(function(e) {
			if (e.length > 0) {
				tomitStorageSystem.set("TomITLocations", e, 90);
				tomitProductInventoryInfo.renderLocationSelector(locSelector, e)
			}
		})
	} else {
		tomitProductInventoryInfo.renderLocationSelector(locSelector, availableLocations)
	}
}
history.pushState = (f => function pushState() {
	var ret = f.apply(this, arguments);
	window.dispatchEvent(new Event('pushState'));
	window.dispatchEvent(new Event('locationchange'));
	return ret
})(history.pushState);
history.replaceState = (f => function replaceState() {
	var ret = f.apply(this, arguments);
	window.dispatchEvent(new Event('replaceState'));
	window.dispatchEvent(new Event('locationchange'));
	return ret
})(history.replaceState);
window.addEventListener('popstate', () => {
	window.dispatchEvent(new Event('locationchange'))
});
window.addEventListener('locationchange', function(e) {
	if (typeof window.location.search.split('variant=')[1] != 'undefined') {
		var urlVariantId = window.location.search.split('variant=')[1].split('&')[0];
		if (tomitProductInventoryInfo.selectedVariantId == urlVariantId) {
			return !0
		}
	} else if (typeof ShopifyAnalytics != "undefined" && ShopifyAnalytics.meta.hasOwnProperty("selectedVariantId") && "" != ShopifyAnalytics.meta.selectedVariantId && typeof(t) != 'undefined' && t.variants[ShopifyAnalytics.meta.selectedVariantId] != null) {
		if (tomitProductInventoryInfo.selectedVariantId == ShopifyAnalytics.meta.selectedVariantId) {
			return !0
		}
	}
	if (document.getElementById("inventoryLocationInformation")) {
		tomitProductInventoryInfo.showCurrentVariantInformation(tomitProductInventoryInfo.activeProduct)
	}
});

function onStoreSelect() {
	var selectedOption = document.getElementById('tomit_inventory_list').querySelector('input[type="radio"]:checked').value;
	var selectedStore = document.getElementById('selectedStore');
	selectedStore.innerHTML = "<strong>Selected option : </strong>" + selectedOption;
	document.getElementById("inventoryLocationInformation").appendChild(selectedStore);
	var modal = document.getElementById("inventoryLocationInformationModal");
	modal.style.display = 'none'
}
tomitProductInventoryInfo.addCustomCss()
