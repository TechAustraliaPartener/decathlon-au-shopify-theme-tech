/**
 * NOTE: The schema that is being used to validate these queries was pulled
 * using https://github.com/prisma/graphql-config at a point before we
 * implemented a tighter CORS implementation on the Persistent Cart app.
 * As of this time, the schema cannot be automatically updated. If validations
 * fail at any time, see the PC app for changes to its schema, and update accordingly
 */

import gql from '../utilities/graphql/nanographql';
import { makeRequest } from '../utilities/graphql/make-request';
import config from './config';

const { API_URL } = config;

/**
 * Request to create or update a customer in the DB
 * @param {Object} params
 * @param {*} params.mutation - A GQL mutation for the PC application to create or update a customer with a cart
 * @param {string} params.customerID - A GQL ID
 * @param {Object} params.cart - A Shopify cart
 * @returns {Promise<Object>} - A customer (with cart) from our DB
 */
const createOrUpdateCustomerRequest = ({ mutation, customerID, cart }) =>
  makeRequest(mutation, { customerID, cart }, API_URL)
    .then(data => data.createOrUpdateCustomer)
    .catch(error => {
      throw new Error(
        `Error creating or updating customer in database: ${error.message}`
      );
    });

/**
 * Takes a customerID and queries our DB for a customer
 * @param {Object} params
 * @param {*} params.query - A GQL query for sending data to the PC GQL endpoint to get a customer from the DB
 * @param {string} params.customerID - A customer ID string
 * @returns {Promise<Object|null>} - A customer from the DB (or null if there is no customer with this ID)
 */
const getCustomerRequest = ({ query, customerID }) =>
  makeRequest(query, { customerID }, API_URL)
    .then(data => data.getCustomer)
    .catch(error => {
      throw new Error(`Error getting customer from database: ${error.message}`);
    });

/**
 * A GQL mutation for creating or updating a customer with a cart object
 */
const createOrUpdateCustomerMutation = gql`
  mutation($customerID: ID!, $cart: JSON) {
    createOrUpdateCustomer(customerID: $customerID, cart: $cart) {
      customerID
      cart
      cartID
    }
  }
`;

/**
 * A GQL query for getting a customer by customerID from the DB
 */
const getCustomerQuery = gql`
  query($customerID: ID!) {
    getCustomer(customerID: $customerID) {
      customerID
      cart
      cartID
    }
  }
`;

/**
 * Wraps the request, using the default query for getting a full customer from the GQL interface
 * @param {string} customerID
 * @returns {Object} customer - From the database
 */
const getCustomer = customerID =>
  getCustomerRequest({ query: getCustomerQuery, customerID });

/**
 * Wraps the request to a GQL mutation passing in the mutation and data for the request
 * @param {Object} params
 * @param {string} params.customerID
 * @param {Object} params.cart - A cart object
 * @returns {Object} customer - A newly created or updated customer object
 */
const createOrUpdateCustomer = ({ customerID, cart }) =>
  createOrUpdateCustomerRequest({
    mutation: createOrUpdateCustomerMutation,
    customerID,
    cart
  });

export { getCustomer, createOrUpdateCustomer };
