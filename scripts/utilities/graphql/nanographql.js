/**
 * A custom implementation (not a fork) of the NPM module `nanographql`
 * The original module stringified variables and then stringified the entire data object,
 * leading to a payload format that would not work with the Shopify Storefront API.
 * This version is amended to pass our ESLint setup
 * @see https://github.com/yoshuawuyts/nanographql
 */
const getOpname = /(query|mutation) ?([\w\d-_]+)? ?\(.*?\)? \{/;

export default function nanographql(str) {
  const _str = Array.isArray(str) ? str.join('') : str;
  const name = getOpname.exec(_str);
  return function(variables) {
    const data = { query: _str };
    if (variables) data.variables = variables;
    if (Array.isArray(name) && name[2]) {
      const operationName = name[2];
      if (operationName) {
        data.operationName = name[2];
      }
    }
    return JSON.stringify(data);
  };
}
