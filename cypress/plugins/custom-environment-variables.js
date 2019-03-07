/**
 * Collects given environment variables into a tidy usable object
 * @param {Object} processEnv The `process.env` object
 * @param {Array} customEnvVars A list of custom environment variables
 */
const customEnvironmentVariables = (processEnv, customEnvVars = []) =>
  customEnvVars.reduce((acc, envVar) => {
    acc[envVar] = processEnv[envVar];
    return acc;
  }, {});

module.exports = customEnvironmentVariables;
