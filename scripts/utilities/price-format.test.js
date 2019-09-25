// @ts-check

import {
  convertToDecimal,
  formatPriceSingle,
  formatPriceRange
} from './price-format';

test('Convert to decimal', () => {
  expect(convertToDecimal('30099')).toEqual('300.99');
  expect(convertToDecimal('1000')).toEqual('10.00');
  expect(convertToDecimal('599')).toEqual('5.99');
  expect(convertToDecimal('')).toEqual('');
  expect(convertToDecimal(null)).toEqual('');
});

test('Single price format', () => {
  expect(formatPriceSingle('30099')).toEqual('$300.99');
  expect(formatPriceSingle('1000')).toEqual('$10.00');
  expect(formatPriceSingle('599')).toEqual('$5.99');
  expect(formatPriceSingle('')).toEqual('');
  expect(formatPriceSingle(null)).toEqual('');
});

test('Price range format', () => {
  expect(formatPriceRange('30099==34999==50000')).toEqual('$300.99 — $500.00');
  expect(formatPriceRange('1599==1000==2175==999')).toEqual('$9.99 — $21.75');
  expect(formatPriceRange('599==250==')).toEqual('$2.50 — $5.99');
  expect(formatPriceRange('599====250')).toEqual('$2.50 — $5.99');
  expect(formatPriceRange('5999==5999==5999')).toEqual('$59.99');
  expect(formatPriceRange('5999==')).toEqual('$59.99');
  expect(formatPriceRange('')).toEqual('');
  expect(formatPriceRange(null)).toEqual('');
  expect(formatPriceRange('1099|1299|499', '|')).toEqual('$4.99 — $12.99');
  expect(formatPriceRange('1099|1099', '|')).toEqual('$10.99');
});
