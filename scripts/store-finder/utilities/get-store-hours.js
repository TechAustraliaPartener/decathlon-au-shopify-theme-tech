/**
 * Transforms Military Time to Standard Time
 * @param {number} time - Military Time (0 - 23)
 * @returns {number} - Standard Time
 */
const militaryToStandardTime = time => ((time + 11) % 12) + 1;

/**
 * Lookup store and determine open/close time by day offset
 * @param {Object} params
 * @param {string} storeId - A store ID
 * @param {number} day - Day of the week (0 Sunday - 6 Saturday)
 * @returns {Object} - A store's opening and closing time of the specified day
 */
const visualStoresHours = window.visualStoresHours;
const getStoreOpenClose = ({ storeId, day }) => {
  const store = visualStoresHours[storeId];
  let storeDay = null;
  if (day > 6) {
    storeDay = store[0];
  } else if (day < 0) {
    storeDay = store[6];
  } else {
    storeDay = store[day];
  }
  return {
    open: storeDay && storeDay[0],
    close: storeDay && storeDay[1]
  };
};

export default storeId => {
  const hoursOfOperation = {};
  moment.tz.add(
    'Australia/ACT|AEDT AEST|-b0 -a0|01010101010101010101010|1C140 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0'
  );
  const date = moment().tz('Australia/ACT');
  const hour = parseInt(date.format('H'), 10);
  const day = date.weekday();

  const store = {
    yesterday: getStoreOpenClose({ storeId, day: day - 1 }),
    today: getStoreOpenClose({ storeId, day }),
    tomorrow: getStoreOpenClose({ storeId, day: day + 1 })
  };

  if (hour >= store.today.open && hour < store.today.close) {
    hoursOfOperation.today = `Open ${militaryToStandardTime(
      store.today.open
    )}am-${militaryToStandardTime(store.today.close)}pm`;
  } else if (hour >= store.today.close && hour < 24) {
    hoursOfOperation.today = `Open tomorrow ${militaryToStandardTime(
      store.tomorrow.open
    )}am-${militaryToStandardTime(store.tomorrow.close)}pm`;
  } else if (hour >= 0 && hour < store.tomorrow.open) {
    hoursOfOperation.today = `Open ${militaryToStandardTime(
      store.today.open
    )}am-${militaryToStandardTime(store.today.close)}pm`;
  }

  // hoursOfOperation.today = `Open ${militaryToStandardTime(
  //   store.tomorrow.open
  // )}am-${militaryToStandardTime(store.tomorrow.close)}pm`;

  // // TEMPORARY: Can be deleted after Emeryville's opening
  // if (Date.now() <= 1555084800000 && storeId === 'adr_K6s3Kaja') {
  //   hoursOfOperation.today = 'Grand Opening April 12th 9am';
  //   hoursOfOperation.tomorrow = 'Grand Opening April 12th 9am';
  // }

  return hoursOfOperation;
};
