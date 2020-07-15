/**
 * Transforms Military Time to 12h Time Format
 * @param {number} time - Military Time (0000-2359)
 * @returns {number} - 12h Time Format (1:20am)
 */
const militaryTo12hFormat = time => {
  const militaryHours = Number(time.substring(0, 2));
  const militaryMinutes = time.substring(2, 4);
  const hours = ((militaryHours + 11) % 12) + 1;
  const amOrPm = (militaryHours < 12 || militaryHours === 24) ? 'am' : 'pm';
  return `${hours}:${militaryMinutes}${amOrPm}`;
}

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
  hoursObj[store.id] = store.hours.map(function (day) {
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
        const days = ['Sun ', 'Mon ', 'Tue ', 'Wed ', 'Thu ', 'Fri ', 'Sat ', 'Sun '];
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
  let openTime;
  moment.tz.add(
    'Australia/ACT|AEDT AEST|-b0 -a0|01010101010101010101010|1C140 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0'
  );
  const date = moment().tz('Australia/ACT');
  const currentMilitaryTime = Number(date.format('HHmm'));
  const day = date.weekday();

  const store = {
    // Hours from masterStoresVisual comes from Mon to Sun, whereas from moment it comes from Sun to Sat, so we need to remove 1 for today
    yesterday: getStoreOpenClose({ storeId, day: day - 2 }),
    today: getStoreOpenClose({ storeId, day: day - 1 }),
    tomorrow: getStoreOpenClose({ storeId, day })
  };

  const openTimeToday = militaryTo12hFormat(store.today.open);
  const openTimeTomorrow = militaryTo12hFormat(store.tomorrow.open);
  const closeTimeToday = militaryTo12hFormat(store.today.close);
  const closeTimeTomorrow = militaryTo12hFormat(store.tomorrow.close);

  if (currentMilitaryTime >= Number(store.today.open) && currentMilitaryTime < Number(store.today.close)) {
    openTime = `${(store.today.nameDay)} ${openTimeToday}-${closeTimeToday}`;
  } else if (currentMilitaryTime >= Number(store.today.close) && currentMilitaryTime < 2400) {
    openTime = `Open tomorrow ${openTimeTomorrow}-${closeTimeTomorrow}`;
  } else if (currentMilitaryTime >= 0 && currentMilitaryTime < Number(store.tomorrow.open)) {
    openTime = `${(store.today.nameDay)} ${openTimeToday}-${closeTimeToday}`;
  }

  return openTime ? { today: openTime } : {};
};
