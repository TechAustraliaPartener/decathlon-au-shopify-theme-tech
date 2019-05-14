/**
 * Remove or add a role from an element
 * @param {Object} params
 * @param {HTMLElement} params.el - The element to add or remove a role on
 * @param {string} params.name - The name of the attribute to be changed, added,
 * or removed
 * @param {string} params.value - The value to add or remove from a particular
 * attribute
 * @param {boolean} params.remove - Whether to remove the value. If false,
 * the value or attribute will be added
 */
export const toggleAttributeValue = ({ el, name, value, remove }) => {
  if (!el || !el.getAttribute || !name || typeof remove !== 'boolean') {
    return;
  }
  let attrValues = el.getAttribute(name);
  /**
   * If there are no existing roles set on the element, either return or if
   * the role is to be added, just set it directly
   */
  if (!attrValues) {
    if (remove) {
      return;
    }
    el.setAttribute(name, value);
    return;
  }
  /**
   * Make an array of roles
   */
  attrValues = attrValues.split(' ');
  /**
   * If there are existing roles, either filter out the role to be removed or
   * add it to
   */
  if (remove) {
    attrValues = attrValues.filter(val => val !== value);
  } else {
    attrValues.push(value);
  }
  /**
   * If there are no longer any roles, remove the attribute
   */
  if (attrValues.length === 0) {
    el.removeAttribute(name);
    return;
  }
  /**
   * Convert roles back to a string and set on the element
   */
  attrValues = attrValues.join(' ');
  el.setAttribute(name, attrValues);
};
