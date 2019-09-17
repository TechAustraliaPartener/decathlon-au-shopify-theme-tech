// @ts-check
import { render, html, fireEvent } from '../utilities/test-utils';
import { initProductTile } from './init';

test('Updates the image when a swatch gets selected', () => {
  const { getByText, getByAltText, container } = render(html`
    <div class="js-de-ProductTile">
      <img
        class="js-de-ProductTile-featureImage"
        src="redImage"
        alt="red alt"
      />
      <button
        class="js-de-ColorSwatchList-action"
        data-image="redImage"
        data-image-alt="red alt"
        data-image2="redImage2"
        data-image2-alt="red alt 2"
        data-color="red"
      >
        red
      </button>
      <button
        class="js-de-ColorSwatchList-action"
        data-image="greenImage"
        data-image-alt="green alt"
        data-color="green"
      >
        green
      </button>
      <button
        class="js-de-ColorSwatchList-action"
        data-image="blueImage"
        data-image-alt="blue alt"
        data-image2="blueImage2"
        data-image2-alt="blue alt 2"
        data-color="blue"
      >
        blue
      </button>
    </div>
  `);

  initProductTile(container.querySelector('.js-de-ProductTile'));

  const image = getByAltText('red alt');

  expect(image.getAttribute('src')).toEqual('redImage');
  expect(image.getAttribute('alt')).toEqual('red alt');

  fireEvent.mouseEnter(image);
  expect(image.getAttribute('src')).toEqual('redImage2');
  expect(image.getAttribute('alt')).toEqual('red alt 2');

  fireEvent.mouseLeave(image);
  expect(image.getAttribute('src')).toEqual('redImage');
  expect(image.getAttribute('alt')).toEqual('red alt');

  fireEvent.mouseEnter(getByText(/green/));
  expect(image.getAttribute('src')).toEqual('greenImage');
  expect(image.getAttribute('alt')).toEqual('green alt');

  fireEvent.mouseEnter(getByText(/blue/));
  expect(image.getAttribute('src')).toEqual('blueImage');
  expect(image.getAttribute('alt')).toEqual('blue alt');

  fireEvent.mouseEnter(image);
  expect(image.getAttribute('src')).toEqual('blueImage2');
  expect(image.getAttribute('alt')).toEqual('blue alt 2');

  fireEvent.mouseLeave(image);
  expect(image.getAttribute('src')).toEqual('blueImage');
  expect(image.getAttribute('alt')).toEqual('blue alt');
});
