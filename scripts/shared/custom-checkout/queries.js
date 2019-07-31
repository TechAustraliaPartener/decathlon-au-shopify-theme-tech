/**
 * NOTE: We were unable to pull in the schema for Storefront queries
 * If any Storefront queries should stop working, consult the Storefront API
 * docs for reference: https://help.shopify.com/en/api/custom-storefronts/storefront-api/reference
 */

import { makeShopifyStorefrontRequest } from '../../utilities/graphql/make-request';
import gql from '../../utilities/graphql/nanographql';

/**
 * A tagged template literal that will take data and return the object to be used
 * to make a GraphQL request to the Shopify Storefront API, to return a new checkout object.
 * Currently has no schema to be tested against, so ESLint-wrapped to ignore schema checks.
 */
/* eslint-disable graphql/template-strings */
const createCheckoutMutation = gql`
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;
/* eslint-enable */

/**
 * Simple Storefront API GQL query to be used as a health check
 */
/* eslint-disable graphql/template-strings */
const testStorefrontAPIQuery = gql`
  query testStorefrontAPIQuery {
    shop {
      name
    }
  }
`;
/* eslint-enable */

/**
 * Create a request for a new Shopify checkout from the Storefront API
 * Passes off to a wrapper over our generic makeShopifyStorefrontRequest function to issue a GraphQL
 * request to the passed-in URL with appropriate headers set for accessing the Storefront API
 * @param {Object} params
 * @param {*} params.mutation - A GraphQL query template
 * @param {Object} params.input - The data to be used within the query (mutation)
 * @returns {Promise<Object>} - A Shopify checkout object
 */
const createCheckoutRequest = ({ mutation, input }) => {
  return makeShopifyStorefrontRequest(mutation, { input })
    .then(data => data.checkoutCreate)
    .catch(error => {
      throw new Error(`Error getting customer from database: ${error.message}`);
    });
};

/**
 * Take an input object to be used to create a request to the Shopify Storefront API
 * @param {Object} input - The variables object to be passed to the query (mutation)
 * @returns {Promise<Object>} - A Shopify checkout object
 */
export const createCheckout = input =>
  createCheckoutRequest({ mutation: createCheckoutMutation, input });

/**
 * Test that a request to the Storefront API GraphQL endpoint works and
 * returns a value
 * @returns {Promise<Boolean>} - The request succeeded
 */
export const testStorefrontAPI = () =>
  makeShopifyStorefrontRequest(testStorefrontAPIQuery)
    .then(data => Boolean(data.shop && data.shop.name))
    .catch(error => {
      console.error('Storefront API Test Request Failed:', error);
      return false;
    });
