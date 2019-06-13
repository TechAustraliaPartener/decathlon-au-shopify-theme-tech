// @ts-check

/**
 * Build a list of stores for pickup, to be displayed in the fulfillment
 * options drawer (or anywhere)
 *
 * @param {Array} stores A collection of stores
 * @returns {String} A collection of store tile components
 */
export const buildStoreTile = stores =>
  stores
    .map(
      store => `
  <li class='de-StoreTile de-u-pad03 de-u-padEnds de-u-cursorPointer'>
    <div class='de-Grid de-u-textSizeBase'>
      <div class='de-StoreTile-info de-u-size4of6 de-u-padRight06'>
        <h3 class='de-StoreTile-name de-u-textGrow de-u-spaceNone de-u-textBold'>${
          store.city
        }</h3>
        <div class='de-StoreTile-address de-u-flex'>
          <p class='de-u-spaceNone de-u-textShrink1 de-u-textDarkGray'>${
            store.street1
          }</p>
        </div>
        <p class='de-u-spaceNone de-u-textDarkGray de-u-textShrink2 de-u-textMedium'>${
          store.street2
        }</p>
      </div>
      <div class='de-StoreTile-actions de-u-size2of6 de-u-textShrink2 de-u-flex'>
        <p class='de-u-spaceLeft06 de-u-textShrink1 de-u-textBlue de-u-textMedium'>${
          store.distance
        }</p>
      </div>
    </div>
  </li>
`
    )
    .join('');

/**
 * Sets a story city and address for display in fulfillment options on the
 * page (in buybox)
 * @param {Object} params
 * @param {Object} params.store - The data for the store closest to a user
 * (determined prior to passing in here)
 * @param {Element} params.storeCityEl - The element for showing a store's city
 * @param {Element} params.storeAddress1El - The element for showing a store's
 * primary address
 */
export const setClosestStoreInfo = ({
  store,
  storeCityEl,
  storeAddress1El
}) => {
  storeCityEl.innerHTML = store.city;
  storeAddress1El.innerHTML = store.street1;
};
