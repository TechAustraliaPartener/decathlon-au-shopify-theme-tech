function pushStockInfoToDataLayer(modelNumber) {
  window.vars.pushInventory = window.vars.pushInventory || [];
  window.vars.pushInventory.push(modelNumber);

  if (!window.inventories) {
    return false;
  }

  if (window.vars.pushInventory.length > 0) {
    var uniqueModels = [...new Set(window.vars.pushInventory)];
    // console.log(uniqueModels);
    uniqueModels.forEach(model => {
      push(model);
    });
    window.vars.pushInventory.length = 0;
  }
}

function push(modelNumber) {
  // console.log('Pushing ' + modelNumber);

  // Determine stock status
  var simpleInventory = {};

  for (let [key, obj] of Object.entries(window.inventories)) {
    var modelNum = obj.title.split(' ');
    modelNum = modelNum[modelNum.length - 1];

    simpleInventory[modelNum] = simpleInventory[modelNum] || {
      stock: 0,
      stockStatus: []
    };

    var onlineInventory = obj.inventoryItem.delivery;
    if (onlineInventory) {
      simpleInventory[modelNum].stockStatus.push((onlineInventory.inStock > 0));
      simpleInventory[modelNum].stock += onlineInventory.available;
    } else {
      simpleInventory[modelNum].stockStatus.push(false);
    }
  }


  // console.log('modelNumber', modelNumber)
  // console.log('simpleInventory', simpleInventory)

  // Note: If an error occur below this line, it's most likely that the Variant's "Model Code" has a space
  var stockStatusArray = simpleInventory[modelNumber].stockStatus;
  var stockStatus = 'Not Available';
  if (stockStatusArray.every(item => item === true)) {
    stockStatus = 'Fully Available';
  } else if (stockStatusArray.some(item => item === true)) {
    stockStatus = 'Partially Available';
  }

  window.vars.productStockInfo = window.vars.productStockInfo || {};
  window.vars.productStockInfo.dynamic = {
    'Model Number': modelNumber,
    'Stock Status': stockStatus
  }

  var event = {
    'event': 'stockLevel'
  }

  const stockEventPayload = {...window.vars.productStockInfo.static, ...window.vars.productStockInfo.dynamic, ...event };
  // console.log(stockEventPayload);

  dataLayer.push(stockEventPayload);
}

export default pushStockInfoToDataLayer;
