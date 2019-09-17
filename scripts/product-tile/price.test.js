// @ts-check

import * as price from './price';

const mockHtml = `
<div class="js-de-ProductTile">
  <p class="js-de-ProductTile-price">
    <span class="js-de-ProductTile-currentPrice"></span>
    <span class="js-de-ProductTile-crossedOutPrice"></span>
  </p>
</div>
`;

/**
 * Helper to get the Product Tile element
 * @returns {HTMLElement}
 */
const getProductTileEl = () => document.querySelector('.js-de-ProductTile');

describe('Product Tile Price Module', () => {
  let baseState;

  beforeEach(() => {
    document.body.innerHTML = mockHtml;

    /**
     * The base state for each test
     * @type {import('./init').ProductTileState}
     */
    baseState = {
      prices: '999==999==999',
      priceVaries: false,
      compareAtPrice: ''
    };
  });

  test('Renders price range when priceVaries is true', () => {
    /** @type {import('./price').PriceData} */
    const state = {
      ...baseState,
      productTileEl: getProductTileEl(),
      prices: '123==455==1000==',
      priceVaries: true
    };

    price.render(state);

    // @see https://jestjs.io/docs/en/snapshot-testing#inline-snapshots
    // @todo Remove whitespace in snapshot
    // @see https://favro.com/organization/3b9e0cac6fa6e11b48d8b159/9250833f54e7836c6801659c?card=DEC-3414
    expect(document.body).toMatchInlineSnapshot(`
      <body>
        

        <div
          class="js-de-ProductTile"
        >
          
        
          <p
            class="js-de-ProductTile-price"
          >
            
          
            <span
              class="js-de-ProductTile-currentPrice"
            >
              $1.23 — $10.00
            </span>
            
          
            <span
              class="js-de-ProductTile-crossedOutPrice"
            />
            
        
          </p>
          

        </div>
        

      </body>
    `);
  });

  /**
   * This use case exists when the price varies at the product level
   * but not at the color (variant) level
   */
  test('Renders single price when priceVaries is true but prices do not vary', () => {
    /** @type {import('./price').PriceData} */
    const state = {
      ...baseState,
      productTileEl: getProductTileEl(),
      prices: '349==349==349==349==',
      priceVaries: true
    };

    price.render(state);

    // @see https://jestjs.io/docs/en/snapshot-testing#inline-snapshots
    // @todo Remove whitespace in snapshot
    // @see https://favro.com/organization/3b9e0cac6fa6e11b48d8b159/9250833f54e7836c6801659c?card=DEC-3414
    expect(document.body).toMatchInlineSnapshot(`
      <body>
        

        <div
          class="js-de-ProductTile"
        >
          
        
          <p
            class="js-de-ProductTile-price"
          >
            
          
            <span
              class="js-de-ProductTile-currentPrice"
            >
              $3.49
            </span>
            
          
            <span
              class="js-de-ProductTile-crossedOutPrice"
            />
            
        
          </p>
          

        </div>
        

      </body>
    `);
  });

  test('Renders single price when priceVaries is false', () => {
    /** @type {import('./price').PriceData} */
    const state = {
      ...baseState,
      productTileEl: getProductTileEl()
    };

    price.render(state);

    // @see https://jestjs.io/docs/en/snapshot-testing#inline-snapshots
    // @todo Remove whitespace in snapshot
    // @see https://favro.com/organization/3b9e0cac6fa6e11b48d8b159/9250833f54e7836c6801659c?card=DEC-3414
    expect(document.body).toMatchInlineSnapshot(`
      <body>
        

        <div
          class="js-de-ProductTile"
        >
          
        
          <p
            class="js-de-ProductTile-price"
          >
            
          
            <span
              class="js-de-ProductTile-currentPrice"
            >
              $9.99
            </span>
            
          
            <span
              class="js-de-ProductTile-crossedOutPrice"
            />
            
        
          </p>
          

        </div>
        

      </body>
    `);
  });

  test('Renders compareAtPrice price when available and priceVaries is false', () => {
    /** @type {import('./price').PriceData} */
    const state = {
      ...baseState,
      productTileEl: getProductTileEl(),
      compareAtPrice: '1500'
    };

    price.render(state);

    // @see https://jestjs.io/docs/en/snapshot-testing#inline-snapshots
    // @todo Remove whitespace in snapshot
    // @see https://favro.com/organization/3b9e0cac6fa6e11b48d8b159/9250833f54e7836c6801659c?card=DEC-3414
    expect(document.body).toMatchInlineSnapshot(`
      <body>
        

        <div
          class="js-de-ProductTile"
        >
          
        
          <p
            class="js-de-ProductTile-price"
          >
            
          
            <span
              class="js-de-ProductTile-currentPrice"
            >
              $9.99
            </span>
            
          
            <span
              class="js-de-ProductTile-crossedOutPrice"
            >
              $15.00
            </span>
            
        
          </p>
          

        </div>
        

      </body>
    `);
  });

  test('Does not render compareAtPrice price when available and priceVaries is true', () => {
    /** @type {import('./price').PriceData} */
    const state = {
      ...baseState,
      productTileEl: getProductTileEl(),
      prices: '123==455==1000',
      priceVaries: true,
      compareAtPrice: '1500'
    };

    price.render(state);

    // @see https://jestjs.io/docs/en/snapshot-testing#inline-snapshots
    // @todo Remove whitespace in snapshot
    // @see https://favro.com/organization/3b9e0cac6fa6e11b48d8b159/9250833f54e7836c6801659c?card=DEC-3414
    expect(document.body).toMatchInlineSnapshot(`
      <body>
        

        <div
          class="js-de-ProductTile"
        >
          
        
          <p
            class="js-de-ProductTile-price"
          >
            
          
            <span
              class="js-de-ProductTile-currentPrice"
            >
              $1.23 — $10.00
            </span>
            
          
            <span
              class="js-de-ProductTile-crossedOutPrice"
            />
            
        
          </p>
          

        </div>
        

      </body>
    `);
  });
});
