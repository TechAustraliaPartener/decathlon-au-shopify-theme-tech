/**
 * This is a very tightly coupled implmentation being used to manipulate
 * the DOM of checkout Liquid "drops" to reinsert cart links and fix logo links
 * in the case when persistent cart is hijacking checkout and setting location
 * directly to a new checkout's `webUrl`. No other solution exists at this time
 * (that we know of), and it's acknowledged that this is a fragile
 * approach, but it works, for the time being.
 */
import config from '../shared/config';

const {
  SELECTORS: {
    CHECKOUT: {
      IS_CONTACT_INFO_STEP,
      IS_STOCK_PROBLEMS_PAGE,
      TEXT: { CART_TEXT },
      CLASSES: {
        LOGO,
        STEPS: { STEP_FOOTER, STEP_FOOTER_PREVIOUS_LINK },
        BREADCRUMBS: {
          BC_ROOT,
          BC_LINK,
          BC_ITEM,
          BC_ITEM_COMPLETED,
          BC_CHEVRON_ICON
        }
      },
      ATTRIBUTES: {
        BREADCRUMBS: {
          DATA_TREKKIE_ID: { TREKKIE_NAME, TREKKIE_VALUE }
        }
      },
      URLS: { CART_URL, ROOT_URL }
    }
  }
} = config;

/**
 * Check to see whether a breadcrumb cart link exists
 * @returns {boolean} - Has a breadcrumb cart link (or not)
 */
const cartBreadcrumbLinkExists = () => {
  const breadcrumbLinks = document.querySelectorAll(`.${BC_LINK}`);
  for (const link of breadcrumbLinks) {
    if (link.href.indexOf(CART_URL) > -1) {
      return true;
    }
  }
  return false;
};

/**
 * Builds a "step" link in the footer to return to the cart from the first page of checkout
 */
const buildStepLink = () => {
  // Build Return to Cart link
  const returnToCartLink = document.createElement('a');
  returnToCartLink.href = CART_URL;
  returnToCartLink.classList.add(STEP_FOOTER_PREVIOUS_LINK);
  returnToCartLink.innerHTML =
    '<svg focusable="false" aria-hidden="true" class="icon-svg icon-svg--color-accent icon-svg--size-10 previous-link__icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M8 1L7 0 3 4 2 5l1 1 4 4 1-1-4-4"></path></svg><span class="step__footer__previous-link-content">Return to cart</span>';

  // Insert Return to Cart link
  document.querySelector(`.${STEP_FOOTER}`).appendChild(returnToCartLink);
};

/**
 * Builds a breadcrumb to go back to the cart and appends to the list of breadcrumbs (as the 1st)
 */
const buildCartBreadCrumb = () => {
  // Get breadcrumb list
  const breadcrumbs = document.querySelector(`.${BC_ROOT}`);

  // Build crumb
  const cartCrumb = document.createElement('li');
  cartCrumb.classList.add(BC_ITEM, BC_ITEM_COMPLETED);

  // Build crumb link
  const cartCrumbLink = document.createElement('a');
  cartCrumbLink.href = CART_URL;
  cartCrumbLink.classList.add(`${BC_LINK}`);
  cartCrumbLink.appendChild(document.createTextNode(CART_TEXT));
  cartCrumbLink.setAttribute(TREKKIE_NAME, TREKKIE_VALUE);

  // Build crumb separator arrow
  const cartCrumbArrow = document
    .querySelector(`.${BC_CHEVRON_ICON}`)
    .cloneNode(true);

  // Insert crumb and arrow
  cartCrumb.appendChild(cartCrumbLink);
  breadcrumbs.insertBefore(cartCrumb, breadcrumbs.firstChild);
  cartCrumb.insertBefore(cartCrumbArrow, cartCrumbLink.nextSibling);
};

/**
 * If there is no breadcrumb link
 * run this code to build or update
 * 1) A breadcrumb that goes back to the cart
 * 2) A step link in the footer that returns to the cart
 * 3) The href on logos to point back to the web root of the deployed Decathlon site
 */
if (!cartBreadcrumbLinkExists()) {
  if (IS_CONTACT_INFO_STEP) {
    /**
     * Add Return to cart link on Checkout Step 1 (when the current step is "contact_information")
     * In subsequent steps, these links are automatically inserted into the DOM
     */
    buildStepLink();
  }
  buildCartBreadCrumb();
  // Update logo links to link to the "home" page
  const logos = document.querySelectorAll(`.${LOGO}`);
  for (const logo of logos) {
    logo.href = ROOT_URL;
  }
}

if (IS_STOCK_PROBLEMS_PAGE) {
  /**
   * Also add return to cart link on the `stock_problems` page (aka, Out of Stock), so the user has a way
   * to get back to cart. For whatever reason, at least in testing, the breadcrumbs are output correctly
   * but set to display none, so those are not an available option.
   */
  buildStepLink();
}
