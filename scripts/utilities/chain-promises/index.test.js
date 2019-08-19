// @ts-check

import { chainPromises } from '.';

test('calls callback for each item', async () => {
  /** @type {(input:string) => Promise<string>} */
  const asyncFunction = jest.fn(
    input => new Promise(resolve => setTimeout(() => resolve(`${input}1`), 1))
  );

  const results = await chainPromises(['a', 'b', 'c'], asyncFunction);

  expect(results).toEqual(['a1', 'b1', 'c1']);

  expect(asyncFunction).toHaveBeenNthCalledWith(1, 'a');
  expect(asyncFunction).toHaveBeenNthCalledWith(2, 'b');
  expect(asyncFunction).toHaveBeenNthCalledWith(3, 'c');
  expect(asyncFunction).toHaveBeenCalledTimes(3);
});
