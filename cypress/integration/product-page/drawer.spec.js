/**
 * @todo Consider moving this value to a higher level location so we don't need
 * to pull it in directly from the Drawer module.
 */
import { IS_CLOSED_CLASS } from '../../../scripts/product-page/drawer';

/**
 * Some string constants that are reused in the tests
 */
const SIZE_GUIDE_DRAWER = 'size-guide-drawer';
const SIZE_AND_FIT_TOGGLE = 'size-and-fit-toggle';
const SIZE_GUIDE_LABEL = 'Size Guide';
const SIZE_GUIDE_CLOSE_LABEL = `Close the ${SIZE_GUIDE_LABEL} dialog.`;
const REVIEWS_DRAWER = 'reviews-drawer';
const CUSTOMER_REVIEWS_TOGGLE = 'customer-reviews-toggle';
const REVIEWS_LABEL = 'Customer Reviews';
const REVIEWS_CLOSE_LABEL = `Close the ${REVIEWS_LABEL} dialog.`;
/**
 * An array to help us generate tests at different viewport sizes
 * @see https://docs.cypress.io/api/commands/viewport.html#Arguments
 */
const VIEWPORT_SIZES = ['macbook-13', 'iphone-6+'];

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
const dataTestSelector = attributeValue => `[data-test=${attributeValue}]`;

/**
 * Some basic tests to make sure the custom Drawer UI works. Also verifies
 * some of the accessibility efforts.
 *
 * @todo Can we test keyboard accessiblity efforts (e.g. focus)?
 */
describe('Drawer', () => {
  /**
   * Runs once before all tests in the block
   * @see https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Hooks
   */
  before(() => {
    /**
     * @todo Should we dynamically test multiple products?
     * @see https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Dynamically-Generate-Tests
     */
    cy.visit(Cypress.env('DEC_ONE_SIZE_PRODUCT_PATH'));
  });

  /**
   * Dynamically generate tests at different viewport sizes
   */
  VIEWPORT_SIZES.forEach(viewportSize => {
    it(`should work and be accessible (${viewportSize})`, () => {
      // Set the viewport
      cy.viewport(viewportSize);

      /**
       * Size Guide Drawer
       *
       * Test interactions with the Size Guide Drawer
       */
      cy.get(dataTestSelector(SIZE_AND_FIT_TOGGLE)).click();

      // Verify the Drawer has proper accessibility data
      cy.get(dataTestSelector(SIZE_GUIDE_DRAWER))
        .should('have.attr', 'aria-label', SIZE_GUIDE_LABEL)
        .and('have.attr', 'role', 'dialog');

      // Make sure the "Close" button is focused
      cy.focused()
        .should('have.attr', 'aria-label', SIZE_GUIDE_CLOSE_LABEL)
        .and('have.attr', 'data-drawer-id', SIZE_GUIDE_DRAWER)
        .and('match', 'button');

      /**
       * Use the toggle to know if the Drawer is hidden after clicking "close".
       * Since the Drawer content is still visible on the page, we can't rely
       * on the Drawer itself to check if it's not visible.
       */
      cy.get(dataTestSelector(`${SIZE_GUIDE_DRAWER}-close-toggle`))
        .should('be.visible')
        .and('have.attr', 'aria-label', SIZE_GUIDE_CLOSE_LABEL)
        .click()
        .should('not.be.visible');

      // Confirm the Drawer "closed" state
      cy.get(dataTestSelector(SIZE_GUIDE_DRAWER))
        .should('have.class', IS_CLOSED_CLASS)
        .and('not.have.attr', 'role');

      // Open the Size Guide Drawer again
      cy.get(dataTestSelector(SIZE_AND_FIT_TOGGLE)).click();

      // Make sure the Drawer is open
      cy.get(dataTestSelector(SIZE_GUIDE_DRAWER))
        // @todo Use shared `de-is-open` constant
        .should('have.class', 'de-is-open')
        .and('have.attr', 'role', 'dialog');

      // Make sure the a Drawer overlay click closes the Drawer
      cy.get(dataTestSelector(`${SIZE_GUIDE_DRAWER}-overlay`)).click({
        // Force the click since the overlay is behind the Drawer element
        force: true
      });

      // Confirm the Drawer "closed" state
      cy.get(dataTestSelector(SIZE_GUIDE_DRAWER))
        .should('have.class', IS_CLOSED_CLASS)
        .and('not.have.attr', 'role', 'dialog');

      /**
       * @todo Finish writing these tests to check a toggle double-click
       * The drawer should open after a double-click but not add multiple
       * `dialog` values to the `role` attribute. Currently, the drawer
       * opens and adds multiple `dialog` values to the `role` attribute.
       */
      // Test when user double-clicks toggle
      // cy.get(dataTestSelector('size-and-fit-toggle')).dblclick();
      // // The drawer should be closed, in theory, after a double-click
      // cy.get(dataTestSelector(SIZE_GUIDE_DRAWER))
      //   .should('not.have.attr', 'role', 'dialog');

      /**
       * Customer Reviews Drawer
       *
       * Test interactions with the Customer Reviews Drawer
       */
      cy.get(dataTestSelector(CUSTOMER_REVIEWS_TOGGLE)).click();

      // Verify the Drawer has proper accessibility data
      cy.get(dataTestSelector(REVIEWS_DRAWER))
        .should('have.attr', 'aria-label', REVIEWS_LABEL)
        .and('have.attr', 'role', 'dialog');

      // Make sure the "Close" button is focused
      cy.focused()
        .should('have.attr', 'aria-label', REVIEWS_CLOSE_LABEL)
        .and('have.attr', 'data-drawer-id', REVIEWS_DRAWER)
        .and('match', 'button');

      /**
       * Use the toggle to know if the Drawer is hidden after clicking "close"
       * Since the Drawer content is still visible on the page, we can't rely
       * on the Drawer itself to check if it's not visible.
       */
      cy.get(dataTestSelector(`${REVIEWS_DRAWER}-close-toggle`))
        .should('be.visible')
        .and('have.attr', 'aria-label', REVIEWS_CLOSE_LABEL)
        .click()
        .should('not.be.visible');

      // Confirm the Drawer "closed" state
      cy.get(dataTestSelector(REVIEWS_DRAWER))
        .should('have.class', IS_CLOSED_CLASS)
        .and('not.have.attr', 'role');

      // Open the Customer Reviews Drawer again
      cy.get(dataTestSelector(CUSTOMER_REVIEWS_TOGGLE)).click();

      // Make sure the Drawer is open
      cy.get(dataTestSelector(REVIEWS_DRAWER))
        // @todo Use shared `de-is-open` constant
        .should('have.class', 'de-is-open')
        .and('have.attr', 'role', 'dialog');

      // Make sure the a Drawer overlay click closes the Drawer
      cy.get(dataTestSelector(`${REVIEWS_DRAWER}-overlay`)).click({
        // Force the click since the overlay is behind the Drawer element
        force: true
      });

      // Confirm the Drawer "closed" state
      cy.get(dataTestSelector(REVIEWS_DRAWER))
        .should('have.class', IS_CLOSED_CLASS)
        .and('not.have.attr', 'role', 'dialog');
    });
  });
});
