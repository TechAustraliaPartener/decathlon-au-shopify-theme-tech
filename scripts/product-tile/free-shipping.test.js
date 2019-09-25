// @ts-check
import { render, html, fireEvent } from '../utilities/test-utils';
import { initProductTile } from './init';
import { IS_HIDDEN_CLASS } from './constants';

test('Free shipping "over $50" visibility when a swatch gets selected', () => {
  const { getByText, container } = render(html`
    <div class="js-de-ProductTile">
      <a
        href="/"
        class="js-de-ColorSwatchList-action"
        data-color="red"
        data-is-free-shipping="true"
      >
        red
      </a>
      <a
        href="/"
        class="js-de-ColorSwatchList-action"
        data-color="green"
        data-is-free-shipping="false"
      >
        green
      </a>
      <a
        href="/"
        class="js-de-ColorSwatchList-action"
        data-color="brown"
        data-is-free-shipping="true"
      >
        brown
      </a>
      <span class="js-de-DeliveryOptions-freeShippingOverFifty">over $50</span>
    </div>
  `);

  initProductTile(container.querySelector('.js-de-ProductTile'));

  const freeShippingOverFifty = getByText(/over \$50/);

  // When `data-is-free-shipping` is `true`, the "over $50" text should not be visible
  fireEvent.mouseEnter(getByText(/red/));
  expect(freeShippingOverFifty.classList).toContain(IS_HIDDEN_CLASS);

  // When `data-is-free-shipping` is `false`, the "over $50" text should be visible
  fireEvent.mouseEnter(getByText(/green/));
  expect(freeShippingOverFifty.classList).not.toContain(IS_HIDDEN_CLASS);
});
