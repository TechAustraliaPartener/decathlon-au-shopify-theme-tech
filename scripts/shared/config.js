import { isDev } from '../utilities/env-utils';

const config = {
  SELECTORS: {
    PREFIX: '.js-de-',
    get CART() {
      return `${this.PREFIX}cart`;
    },
    get LOGOUT() {
      return `${this.PREFIX}logout`;
    },
    get CART_COUNT() {
      return `${this.PREFIX}cart-count`;
    },
    get CUSTOMER_ID() {
      return `${this.PREFIX}cid`;
    },
    CHECKOUT: {
      // @see https://help.shopify.com/en/themes/development/layouts/checkout#step-identification
      STEPS: {
        CONTACT_INFORMATION: 'contact_information',
        SHIPPING_METHOD: 'shipping_method',
        PAYMENT_METHOD: 'payment_method',
        PROCESSING: 'processing',
        REVIEW: 'review'
      },
      URLS: {
        ROOT_URL: '/',
        get CART_URL() {
          return `${this.ROOT_URL}cart`;
        }
      },
      TEXT: {
        CART_TEXT: 'Cart'
      },
      CLASSES: {
        BREADCRUMBS: {
          BC_ROOT: 'breadcrumb',
          get PREFIX() {
            return `${this.BC_ROOT}__`;
          },
          get BC_LINK() {
            return `${this.PREFIX}link`;
          },
          get BC_ITEM() {
            return `${this.PREFIX}item`;
          },
          get BC_ITEM_COMPLETED() {
            return `${this.BC_ITEM}--completed`;
          },
          get BC_CHEVRON_ICON() {
            return `${this.PREFIX}chevron-icon`;
          }
        },
        STEPS: {
          STEP_ROOT: 'step',
          get PREFIX() {
            return `${this.STEP_ROOT}__`;
          },
          get STEP_FOOTER() {
            return `${this.PREFIX}footer`;
          },
          get STEP_FOOTER_PREVIOUS_LINK() {
            return `${this.STEP_FOOTER}__previous-link`;
          }
        },
        LOGO: 'logo'
      },
      ATTRIBUTES: {
        BREADCRUMBS: {
          DATA_TREKKIE_ID: {
            TREKKIE_NAME: 'data-trekkie-id',
            get TREKKIE_VALUE() {
              return `${config.SELECTORS.CHECKOUT.CLASSES.BREADCRUMBS.BC_ROOT}_cart_link`;
            }
          }
        }
      }
    }
  },
  STOREFRONT_API: {
    HEADER_NAME: 'X-Shopify-Storefront-Access-Token',
    /**
     * This key is public, and the fallback is here in case the project is built
     * without a value passed in.
     * Will not break the compiled asset file. The key would be accessible
     * in either case.
     */
    KEY:
      process.env.STOREFRONT_API_KEY ||
      (isDev
        ? 'd5d7d74c65c818a0d63d8926a9d7ec01'
        : 'f6c7c4e4db56de88295c2ba45762a331'),
    URL: '/api/graphql'
  },
  NO_CACHE_HEADERS: {
    'cache-control': 'no-store',
    pragma: 'no-store',
    cache: 'no-store'
  }
};

export const DEBUG = process.env.DEBUG === 'true';

export default config;
