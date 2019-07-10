# Product Page Scripts

If you haven't already read the [JavaScript section of the main README](../../README.md#javascript), read that first.

## Architectural Patterns

We didn't always follow all of these patterns, and places where we didn't are usually good opportunities for refactoring.

1. Modules should be created to update distinct parts of UI.
   - A module is a file or set of files within the product-page folder that is responsible for updating a distinct portion of the UI
2. The product page `index.js` file shouldn't directly access the DOM.
3. Don't use jQuery, except for features where there isn't an equivalent native DOM feature. This is to prevent us from getting even more locked into depending on jQuery
4. If a module depends on a piece of state, that state should be stored within that module, _unless_ that state needs to be shared between several independent modules. In that case, the shared state should be stored in the main product page file (`index.js`), and it should be passed down to the modules that depend on it. Modules should fire events or callbacks to tell the main product page file to modify the state.
5. Modules shouldn't directly interact with other modules. If modules need to interact with each other, they should interact through the main product page file.
6. Most modules should follow this format:

   ```js
   /**
    * @typedef {Object} State
    */

   /** @type {State} */
   const initialState = /* Whatever state you need to store */;
   const state = createState(initialState);

   // Should be named whatever makes sense for your use case
   export const onButtonClick = () => {
     state.updateState({
       /* State modifications (gets shallow merged with existing state) */
     });
   };

   /**
    * @param {State} state
    */
   const render = state => {
     // Update the DOM to match the state
   };

   // Whenever state changes, the DOM should be updated to match it
   // The DOM should never be out-of-sync with the state
   state.onChange(render);

   export const init = () => {
     // Attach DOM event listeners
   };
   ```

7. Many of the modules expose an `updateUI` method that gets imported into the main product-page `index.js` file and gets called whenever one of the color or size swatches gets clicked. In many cases it would make more sense to instead expose an `onVariantSelect` method that gets called _only_ when the selected variant is different from the previously-selected variant, and gets passed the new variant object.
8. Create `constants.js` files for CSS classes, selectors, UI text, and other variables. The `constants.js` files should export each value individually.
