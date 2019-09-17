// @ts-check

import { render, html, fireEvent } from '../utilities/test-utils';
import { initProductTile } from './init';

test('Product Tile + color swatch hover logic', () => {
  const { getByText, getByAltText, container } = render(html`
    <div class="js-de-ProductTile">
      <img
        class="js-de-ProductTile-featureImage"
        src="redImage"
        alt="Red Feature Image"
      />
      <a
        class="js-de-ColorSwatchList-action"
        data-image="redImage"
        data-image-alt="Red Feature Image"
        data-color="red"
      >
        red
      </a>
      <a
        class="js-de-ColorSwatchList-action"
        data-image="greenImage"
        data-image-alt="Green Feature Image"
        data-color="green"
      >
        green
      </a>
      <a
        class="js-de-ColorSwatchList-action"
        data-image="blueImage"
        data-image-alt="Blue Feature Image"
        data-color="blue"
      >
        blue
      </a>
    </div>
  `);

  initProductTile(container.querySelector('.js-de-ProductTile'));

  const featureImage = getByAltText('Red Feature Image');

  // The default state is that the image has `alt` and `src` for the first swatch color
  expect(featureImage.getAttribute('src')).toEqual('redImage');

  // Hovering over another color swatch changes both the `alt` & `src` of the `featureImage`
  fireEvent.mouseEnter(getByText(/green/));
  expect(featureImage.getAttribute('src')).toEqual('greenImage');

  // Hover off of the color swatch does not affect the `alt` or `src` of the `featureImage`
  // It's "sticky" while the pointer is inside the Product Tile
  fireEvent.mouseLeave(getByText(/green/));
  expect(featureImage.getAttribute('src')).toEqual('greenImage');

  // Leaving the product tile resets the `alt` and `src` of the `featureImage`
  // to the default, first swatch color.
  fireEvent.mouseLeave(container.querySelector('.js-de-ProductTile'));
  expect(featureImage.getAttribute('src')).toEqual('redImage');
});
