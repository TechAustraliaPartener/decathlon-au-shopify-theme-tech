// @ts-check
import { within, fireEvent as dtlFireEvent } from '@testing-library/dom';
import { flushAllUpdates } from './create-state';

export * from '@testing-library/dom';

/**
 * Puts an HTML string into the DOM, and returns a wrapped copy of DOM Testing Library
 * @param {string} html
 * @example
 * const { getByText } = render(html`<h1>Hi</h1>`);
 */
export const render = html => {
  const container = document.body;
  container.innerHTML = html;
  return { ...within(container), container };
};

/**
 * No-op tagged template literal for HTML strings.
 * Used so that Prettier formats the contents as HTML,
 * and to get HTML syntax highlighting with the lit-html VSCode plugin: https://marketplace.visualstudio.com/items?itemName=bierner.lit-html
 * @example
 * html`<h1>Hi</h1>`
 */
export const html = (strings, ...values) =>
  strings.reduce(
    (builtString, string, i) => builtString + string + values[i] || ''
  );

/**
 * @type {typeof dtlFireEvent}
 * @see https://github.com/testing-library/react-testing-library/blob/8feb318b68d778c7fdd07337b66bf34e8e201f2b/src/pure.js#L114
 */
// @ts-ignore
export const fireEvent = (...args) => {
  const returnValue = dtlFireEvent(...args);
  flushAllUpdates();
  return returnValue;
};

/**
 * Modifies all the methods on fireEvent to make them flush the state updates
 * synchronously after the event is fired
 */
Object.keys(dtlFireEvent).forEach(key => {
  fireEvent[key] = (...args) => {
    const returnValue = dtlFireEvent[key](...args);
    flushAllUpdates();
    return returnValue;
  };
});
