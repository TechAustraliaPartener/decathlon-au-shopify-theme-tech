/**
 * Plugins enable you to tap into, modify, or extend the internal behavior of Cypress.
 * @see https://on.cypress.io/plugins-guide
 */

// Allows reading of environment variables from `.env` file
require('dotenv').config();

const baseUrl = require('./base-url');
const decathlonEnvVars = require('./decathlon-env-vars');
const customEnvironmentVariables = require('./custom-environment-variables');

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // Set Cypress base URL
  config.baseUrl = baseUrl(process.env);

  // Set Cypress environment variables needed to run the tests
  config.env = customEnvironmentVariables(process.env, decathlonEnvVars);

  return config;
};
