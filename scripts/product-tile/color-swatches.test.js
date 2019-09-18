// @ts-check

import * as colorSwatches from './color-swatches';
import { html, render, fireEvent } from '../utilities/test-utils';

test('Color swatch mouseEnter passes data attribute values to callback', () => {
  const { getByText } = render(html`
    <div class="js-de-ProductTile">
      <button class="js-de-ColorSwatchList-action" data-color="red">
        red
      </button>
      <button class="js-de-ColorSwatchList-action" data-color="green">
        green
      </button>
      <button class="js-de-ColorSwatchList-action" data-color="brown">
        brown
      </button>
    </div>
  `);

  colorSwatches.init(document.querySelector('.js-de-ProductTile'));

  const mockCallback = jest.fn();

  colorSwatches.onColorSelect(mockCallback);

  fireEvent.mouseEnter(getByText(/red/));
  expect(mockCallback).toHaveBeenCalledWith('red');
  expect(mockCallback).toHaveBeenCalledTimes(1);

  fireEvent.mouseEnter(getByText(/green/));
  expect(mockCallback).toHaveBeenCalledWith('green');
  expect(mockCallback).toHaveBeenCalledTimes(2);

  fireEvent.mouseEnter(getByText(/brown/));
  expect(mockCallback).toHaveBeenCalledWith('brown');
  expect(mockCallback).toHaveBeenCalledTimes(3);
});
