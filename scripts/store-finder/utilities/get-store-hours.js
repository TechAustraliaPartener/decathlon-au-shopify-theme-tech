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

var hoursObj = {};

for (var i = 0; i < window.masterStoresVisual.length; i++) {
  var store = window.masterStoresVisual[i];
  hoursObj[store.id] = store.hours.map(function(day) {
    return [day.open, day.close];
  });
}
const visualStoresHours = hoursObj;

const getStoreOpenClose = ({ storeId, day }) => {
  for (var i = 0; i < window.masterStoresVisual.length; i++) {
    var x = window.masterStoresVisual[i];
    if (x.id === storeId) {
      if (x.is_same_hours_weekly === false && x.tooltip_hours === true) {
        const weekday = new Date().getDay();
        const days = ['Sun. ', 'Mon. ', 'Tue. ', 'Wed. ', 'Thu. ', 'Fri. ', 'Sat. ', 'Sun. '];
        for (var d = 0; d < 7; d++) {
          const day = days[d];
          if (weekday === d) {
            var nameDay = day;
          }
        }
      } else {
        var nameDay = 'Open ';
      }
    }
  }
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
    close: storeDay && storeDay[1],
    nameDay: nameDay
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
    // Hours from masterStoresVisual comes from Mon to Sun, whereas from moment it comes from Sun to Sat, so we need to remove 1 for today
    yesterday: getStoreOpenClose({ storeId, day: day - 2 }),
    today: getStoreOpenClose({ storeId, day: day - 1 }),
    tomorrow: getStoreOpenClose({ storeId, day })
  };

  if (hour >= store.today.open && hour < store.today.close) {
    hoursOfOperation.today = `${(store.today.nameDay)} ${militaryToStandardTime(
      store.today.open
    )}am-${militaryToStandardTime(store.today.close)}pm`;
  } else if (hour >= store.today.close && hour < 24) {
    hoursOfOperation.today = `Open tomorrow ${militaryToStandardTime(
      store.tomorrow.open
    )}am-${militaryToStandardTime(store.tomorrow.close)}pm`;
  } else if (hour >= 0 && hour < store.tomorrow.open) {
    hoursOfOperation.today = `${(store.today.nameDay)} ${militaryToStandardTime(
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
