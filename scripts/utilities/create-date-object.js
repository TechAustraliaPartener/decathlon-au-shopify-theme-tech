// @ts-check

/**
 * Attempt to create a Date object from an ISO-format timestamp.
 * If the raw timestamp does not return a Date object,
 * try to add a colon in the offset portion of the string and
 * pass again to the Date constructor.
 * Meant to handle issues parsing timestamps from Shopify on iOS
 * @see https://stackoverflow.com/questions/6427204/date-parsing-in-javascript-is-different-between-safari-and-chrome#49138448
 * (Note that none of the referenced solutions seemed to work as desired)
 * @param {string} timestamp - An ISO-format timestamp
 * @returns {Date|null} - A JavaScript Date object or null if the
 * Date could not be created
 */
export const createDateObject = timestamp => {
  let date = new Date(timestamp);
  if (isNaN(date.getMonth())) {
    /**
     * Original timestamps are in the format "2018-09-12T08:52:30+0200"
     * If parsing fails, modTimestamp is set to have timezone
     * offset digits separated by a colon, e.g. "2018-09-12T08:52:30+02:00"
     */
    const modTimestamp = timestamp.replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
    date = new Date(modTimestamp);
  }
  return isNaN(date.getMonth()) ? null : date;
};
