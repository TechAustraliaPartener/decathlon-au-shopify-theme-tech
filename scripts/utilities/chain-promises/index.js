// @ts-check

/**
 * Takes an array of parameters, each of which should be passed into a
 * Promise-returning function. The functions will be run sequentially, after
 * the previous one has resolved. Any rejection will short-circuit the chain.
 * @template InputType
 * @template OutputType
 * @param {InputType[]} array - An array of parameters, any kind, to pass
 * into the Promise-returning function defined in the 2nd parameter
 * @param {function(InputType):Promise<OutputType>} fn - Any Promise-returning function
 * @returns {Promise<OutputType[]>} - A Promise for the array of the results from the
 * chained Promise calls
 */
export const chainPromises = (array, fn) =>
  array.reduce(
    (p, item) =>
      p.then(prevArray => fn(item).then(data => prevArray.concat(data))),
    Promise.resolve([])
  );
