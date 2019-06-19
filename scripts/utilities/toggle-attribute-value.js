/**
 * Remove or add a role from an element
 * @param {Object} params
 * @param {HTMLElement} params.el - The element on which to add or remove an
 * attribute / attribute + value
 * @param {string} params.name - The name of the attribute to be changed, added,
 * or removed
 * @param {string} params.value - The value to add or remove from a particular
 * attribute
 * @param {boolean} params.remove - Whether to remove the value. If false,
 * the value or attribute will be added
 *
 * @todo Consider a refactor using the MDN `Element.toggleAttribute()` polyfill
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/toggleAttribute#Polyfill
 */
export const toggleAttributeValue = ({ el, name, value, remove }) => {
  if (!el || !el.getAttribute || !name || typeof remove !== 'boolean') {
    return;
  }
  let attrValues = el.getAttribute(name);
  /**
   * If there are no existing values for the given attribute set on the element,
   * just return. If the attribute is to be set, just set it directly and return.
   */
  if (!attrValues) {
    if (remove) {
      return;
    }
    el.setAttribute(name, value);
    return;
  }
  /**
   * Make an array of attribute values
   */
  attrValues = attrValues.split(' ');
  /**
   * If there are existing values, either filter out the value to be removed or
   * add the new one, if it isn't already in the list of values
   */
  if (remove) {
    attrValues = attrValues.filter(val => val !== value);
  } else if (!attrValues.some(val => val === value)) {
    attrValues.push(value);
  }
  /**
   * If there are no longer any values, remove the attribute
   */
  if (attrValues.length === 0) {
    el.removeAttribute(name);
    return;
  }
  /**
   * Convert values back to a string and set the attribute on the element
   */
  attrValues = attrValues.join(' ');
  el.setAttribute(name, attrValues);
};
