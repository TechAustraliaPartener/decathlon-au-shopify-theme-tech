/**
 * Checks whether the value passed in has a property message,
 * returns either the original value or the value of the `.message`
 * property, if it exists
 * @param {Object|string} error - An error object or string
 * @returns {string} An error messsage
 */
const getErrorMessage = error =>
  typeof error.message === 'string' ? error.message : error;

export default getErrorMessage;
