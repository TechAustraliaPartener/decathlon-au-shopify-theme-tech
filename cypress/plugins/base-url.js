/**
 * Sets the Cypress test base URL
 *
 * Looks for the `DEC_SHARED_PREVIEW_URL`, defaults to an empty string.
 * @param {Object} processEnv The `process.env` object
 * @returns {string} The Cypress base URL
 */
const baseUrl = processEnv => processEnv.DEC_SHARED_PREVIEW_URL || '';

module.exports = baseUrl;
