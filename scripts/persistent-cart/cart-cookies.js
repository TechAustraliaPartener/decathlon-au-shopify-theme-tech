import Cookies from 'js-cookie';
import config from './config';
const { CART_COOKIE, ALL_CART_COOKIES } = config;

/**
 * Sets the cart cookie
 * @param {string} cartId The cookie to set
 */
export const setCartCookie = cartId => Cookies.set(CART_COOKIE, cartId);

/**
 * Get the cart cookie value
 * @returns {string|undefined}
 */
export const getCartCookie = () => Cookies.get(CART_COOKIE);

/**
 * Remove the cart cookie
 */
export const removeCartCookie = () => Cookies.remove(CART_COOKIE);

/**
 * Clears all cart-related cookies that aren't HTTP only
 */
export const clearCartCookies = () => {
  ALL_CART_COOKIES.forEach(key => Cookies.remove(key));
};
