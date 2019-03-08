/**
 * Updates the "cart count" in the corner. If there is no cart count, does nothing
 * @param {number} count
 */
const updateCartUI = count => {
  const el = document.querySelector('.js-cart-count');
  if (!el) return;
  el.innerText = count;
};

export default updateCartUI;
