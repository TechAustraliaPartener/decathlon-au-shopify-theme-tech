// @ts-check

import { PROD_HOSTNAME } from '../shared/constants';

/**
 * Runtime check for prod environment. Just does a test against the hostname.
 * This is being used as a fallback for `process.env`-set variables
 */
export const isProd =
  window &&
  window.location &&
  new RegExp(window.location.hostname).test(PROD_HOSTNAME);

/**
 * Runtime check for non-prod environment. Anything other than production is
 * considered development
 */
export const isDev = !isProd;
