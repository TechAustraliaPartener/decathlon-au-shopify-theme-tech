/**
 * @TODO - Note that the /scripts/checkout/state module was removed here
 * in favor of using the STEP getter from config.
 * Decide whether the state module is really needed anywhere and remove
 * duplicate code, if possible.
 */
import STATE from './state';
import { CHECKOUT_STEPS } from './constants';
import contactInformation from './steps/contact-information';
import config from '../shared/config';
const {
  SELECTORS: {
    CHECKOUT: {
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
const { checkoutStep, checkoutPage } = STATE;

/**
 * Return true if this is any step in checkout,
 * meaning that it's a candidate for breadcrumbs and step links
 * @returns {boolean} - Is or isn't a documented Shopify checkout step
 */
const isCheckoutStep = () => {
  return Object.keys(CHECKOUT_STEPS).some(
    step => CHECKOUT_STEPS[step] === checkoutStep
  );
};

/**
 * The first step in checkout is the contact information step
 * and that is where we'll want to add a breadcrumb and step link to cart
 * @returns {boolean} - Is or isn't the contact info step
 */
const isContactInfoStep = () => {
  // @see https://help.shopify.com/en/themes/development/layouts/checkout/#shopify-checkout-step
  return checkoutStep === CHECKOUT_STEPS.CONTACT_INFORMATION;
};

/**
 * Whether or not this is the shipping method step in checkout
 * @returns {boolean} - Is or isn't the shipping method step
 */
const isShippingMethodStep = () => {
  // @see https://help.shopify.com/en/themes/development/layouts/checkout/#shopify-checkout-step
  return checkoutStep === CHECKOUT_STEPS.SHIPPING_METHOD;
};

/**
 * Whether or not this is the stock problems page in checkout
 * @returns {boolean} - Is or isn't the stock problems page
 */
const isStockProblemsPage = () => {
  // @see https://help.shopify.com/en/themes/development/layouts/checkout/#shopify-checkout-page
  return checkoutPage === 'stock_problems';
};

/**
 * Check to see whether a cart step link should be built and inserted in DOM
 * @returns {boolean} - Needs a cart step link built (or not)
 */
const needCartStepLink = () => {
  const stepFooter = document.querySelector(`.${STEP_FOOTER}`);
  if (stepFooter) {
    const existingCartStepLink = stepFooter.querySelector(
      `.${STEP_FOOTER_PREVIOUS_LINK}`
    );
    if (existingCartStepLink) {
      return false;
    }
    return true;
  }
  return false;
};

/**
 * Check to see whether a breadcrumb cart link exists
 * @returns {boolean} - Has a breadcrumb cart link (or not)
 */
const cartBreadcrumbLinkExists = () => {
  const breadcrumbLinks = document.querySelectorAll(`.${BC_LINK}`);
  let hasLink = false;
  breadcrumbLinks.forEach(link => {
    if (link.href.indexOf(CART_URL) > -1) {
      hasLink = true;
    }
  });
  return hasLink;
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

// Update logo links to link to the "home" page
const setLogoLinkHome = () => {
  const logos = document.querySelectorAll(`.${LOGO}`);
  logos.forEach(logo => {
    logo.href = ROOT_URL;
  });
};

/**
 * This is a very tightly coupled implementation being used to manipulate
 * the DOM of checkout Liquid "drops" to reinsert cart links and fix logo links
 * in the case when persistent cart is hijacking checkout and setting location
 * directly to a new checkout's `webUrl`. No other solution exists at this time
 * (that we know of), and it's acknowledged that this is a fragile
 * approach, but it works, for the time being.
 */
const fixCustomCheckoutLinks = () => {
  /**
   * If there is no breadcrumb link
   * run this code to build or update
   * 1) A breadcrumb that goes back to the cart
   * 2) A step link in the footer that returns to the cart
   * 3) The href on logos to point back to the web root of the deployed Decathlon site
   */
  if (!cartBreadcrumbLinkExists() && isCheckoutStep()) {
    if (isContactInfoStep() && needCartStepLink()) {
      /**
       * Add Return to cart link on Checkout Step 1 (when the current step is "contact_information")
       * In subsequent steps, these links are automatically inserted into the DOM
       */
      buildStepLink();
    }
    buildCartBreadCrumb();
  }

  if (isStockProblemsPage() && needCartStepLink()) {
    /**
     * Also add return to cart link on the `stock_problems` page (aka, Out of Stock), so the user has a way
     * to get back to cart. For whatever reason, at least in testing, the breadcrumbs are output correctly
     * but set to display none, so those are not an available option.
     */
    buildStepLink();
  }

  setLogoLinkHome();
};

const updateUI = () => {
  if (isContactInfoStep()) {
    contactInformation.updateUI();
  }

  if (isShippingMethodStep()) {
    // Update Shipping (Step 2) UI
  }

  fixCustomCheckoutLinks();
};

export default updateUI;
