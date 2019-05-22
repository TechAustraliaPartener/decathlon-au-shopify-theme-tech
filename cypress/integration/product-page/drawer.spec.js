/**
 * @todo Consider moving this value to a higher level location so we don't need
 * to pull it in directly from the Drawer module.
 */
import { IS_CLOSED_CLASS } from '../../../scripts/product-page/drawer';

/**
 * Some string constants that are reused in the tests
 */
const SIZE_GUIDE_DRAWER = 'size-guide-drawer';
const SIZE_GUIDE_LABEL = 'Size Guide';
const REVIEWS_DRAWER = 'reviews-drawer';
const REVIEWS_LABEL = 'Customer Reviews';
/**
 * This allows us to generate tests at different viewport sizes
 * @see https://docs.cypress.io/api/commands/viewport.html#Arguments
 */
const VIEWPORT_SIZES = ['macbook-13','iphone-6+'];

/**
 * Helper to generate the `data-test` attribute selector
 *
 * It is a best practice to use `data-test` selectors. This helpers reduces
 * the repetition when writing the selector.
 * @see https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements
 *
 * @todo Potentially pull this out as a reusable utility
 *
 * @param {string} attributeValue The data-test attribute value
 * @returns {string} A `data-test` attribute selector
 */
const dataCySelector = attributeValue => `[data-test=${attributeValue}]`;

/**
 * Some basic tests to make sure the custom Drawer UI works. Also verifies
 * some of the accessibility efforts.
 *
 * @todo Can we test keyboard accessiblity efforts (e.g. focus)?
 */
describe('Drawer', () => {
  /**
   * Dynamically generate tests at different viewport sizes
   */
  VIEWPORT_SIZES.forEach(viewportSize => {
    it(`should work and be accessible (${viewportSize})`, () => {
      /**
       * Set the viewport
       */
      cy.viewport(viewportSize);
      /**
       * @todo Should we dynamically test multiple products?
       * @see https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Dynamically-Generate-Tests
       */
      cy.visit(
        Cypress.env('DEC_ONE_SIZE_PRODUCT_PATH')
      );

      /**
       * Size Guide Drawer
       *
       * Test interactions with the Size Guide Drawer
       */
      cy.get(dataCySelector('size-and-fit-toggle')).click();
      /**
       * Verify the Drawer has proper accessibility data
       */
      cy.get(dataCySelector(SIZE_GUIDE_DRAWER))
        .should('have.attr', 'aria-label', SIZE_GUIDE_LABEL)
        .and('have.attr', 'role', 'dialog');
      /**
       * Use the toggle to know if the Drawer is hidden after clicking "close".
       * Since the Drawer content is still visible on the page, we can't rely
       * on the Drawer itself to check if it's not visible.
       */
      cy.get(dataCySelector(`${SIZE_GUIDE_DRAWER}-close-toggle`))
        .should('be.visible')
        .and('have.attr', 'aria-label', `Close the ${SIZE_GUIDE_LABEL} dialog.`)
        .click()
        .should('not.be.visible');
      /**
       * Confirm the Drawer "closed" state
       */
      cy.get(dataCySelector(SIZE_GUIDE_DRAWER))
        .should('have.class', IS_CLOSED_CLASS)
        .and('not.have.attr', 'role');

      /**
       * Customer Reviews Drawer
       *
       * Test interactions with the Customer Reviews Drawer
       */
      cy.get(dataCySelector('customer-reviews-toggle')).click();
      /**
       * Verify the Drawer has proper accessibility data
       */
      cy.get(dataCySelector(REVIEWS_DRAWER))
        .should('have.attr', 'aria-label', REVIEWS_LABEL)
        .and('have.attr', 'role', 'dialog');
      /**
       * Use the toggle to know if the Drawer is hidden after clicking "close"
       * Since the Drawer content is still visible on the page, we can't rely
       * on the Drawer itself to check if it's not visible.
       */
      cy.get(dataCySelector(`${REVIEWS_DRAWER}-close-toggle`))
        .should('be.visible')
        .and('have.attr', 'aria-label', `Close the ${REVIEWS_LABEL} dialog.`)
        .click()
        .should('not.be.visible');
      /**
       * Confirm the Drawer "closed" state
       */
      cy.get(dataCySelector(REVIEWS_DRAWER))
        .should('have.class', IS_CLOSED_CLASS)
        .and('not.have.attr', 'role');
    });
  });
});
