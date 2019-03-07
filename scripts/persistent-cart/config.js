/**
 * List of production domains
 * Can be set as a comma-delimited list via a `PRODUCTION_DOMAINS` environment variable
 */
const PRODUCTION_DOMAINS = process.env.PRODUCTION_DOMAINS
  ? process.env.PRODUCTION_DOMAINS.split(/,\s*/g)
  : ['www.decathlon.com'];

/**
 * List of staging domains
 * Can be set as a comma-delimited list via a `STAGING_DOMAINS` environment variable
 */
const STAGING_DOMAINS = process.env.STAGING_DOMAINS
  ? process.env.STAGING_DOMAINS.split(/,\s*/g)
  : ['testing-decathlon-usa.myshopify.com'];

/**
 * The production Persistent Cart app API URL
 */
const PRODUCTION_API_URL =
  process.env.PRODUCTION_API_URL ||
  'https://persistent-cart-decathlonusa.herokuapp.com';

/**
 * The staging Persistent Cart app API URL
 */
const STAGING_API_URL =
  process.env.STAGING_API_URL ||
  'https://persistent-cart-decathlonusa-s.herokuapp.com';

/**
 * Persistent Cart client-side config
 */
const config = {
  /**
   * URL for sending GQL requests. Can be set on process.env or use a local
   * @TODO - How to setup for production (Discuss with DE Team)?
   * Consider removing local definition
   */
  get API_URL() {
    const LOCAL_API_URL = 'http://localhost:8080';

    // Set default to local
    let persistentCartUrl = LOCAL_API_URL;
    // Because DRY
    const hostname = window.location.hostname;

    // Set to staging API URL if we match a staging domain
    // Regular Expressions are supported
    if (STAGING_DOMAINS.some(domain => hostname.match(new RegExp(domain)))) {
      persistentCartUrl = STAGING_API_URL;
    }

    // Set to production API URL if we match a production domain
    // Regular Expressions are supported
    if (PRODUCTION_DOMAINS.some(domain => hostname.match(new RegExp(domain)))) {
      persistentCartUrl = PRODUCTION_API_URL;
    }

    // Allow override via `DECATHLON_PERSISTENT_CART_URL` environment variable
    return `${process.env.DECATHLON_PERSISTENT_CART_URL ||
      persistentCartUrl}/shopify/graphql`;
  },
  STORAGE: {
    PREFIX: 'de_pc_',
    get SHOPIFY_CART() {
      return `${this.PREFIX}shopify_cart`;
    },
    get LOGGED_IN() {
      return `${this.PREFIX}logged_in`;
    }
  },
  SHOPIFY_API: {
    GET_CART: '/cart.js',
    UPDATE_CART: '/cart/update.js'
  },
  COOKIES: {
    CART: 'cart',
    CART_TS: 'cart_ts',
    CART_SIG: 'cart_sig',
    CART_CURRENCY: 'cart_currency'
  },
  get ALL_CART_COOKIES() {
    return Object.keys(this.COOKIES).map(key => this.COOKIES[key]);
  },
  get CART_COOKIE() {
    return this.COOKIES.CART;
  }
};

export default config;
