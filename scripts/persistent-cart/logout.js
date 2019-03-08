import { removeCartCookie } from './cart-cookies';
import scriptsConfig from '../shared/config';
const {
  SELECTORS: { LOGOUT }
} = scriptsConfig;

/**
 * LOGOUT HANDLING
 * Clear the cart cookie on logout
 */

const logoutHandler = () => {
  removeCartCookie();
};

const logoutHandlerInit = () => {
  const logoutLink = document.querySelector(LOGOUT);
  if (logoutLink) {
    logoutLink.addEventListener('click', logoutHandler);
  }
};

export default logoutHandlerInit;
