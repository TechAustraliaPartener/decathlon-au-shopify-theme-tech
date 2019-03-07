context('Persistent Cart', () => {
  beforeEach(() => {
    // Log in + allow to redirect to product page
    cy.visit(
      `/account/login?checkout_url=${Cypress.env('DEC_ONE_SIZE_PRODUCT_PATH')}`
    );

    cy.get('[name="customer[email]"]').type(Cypress.env('DEC_USERNAME'));
    cy.get('[name="customer[password]"]').type(
      `${Cypress.env('DEC_PASSWORD')}{enter}`
    );
  });

  /**
   * A basic test to make sure localStorage has the expected items
   */
  it('localStorage should have "de_pc*" items', () => {
    cy.get('.addToCart')
      .click()
      .should(() => {
        const LOGGED_IN_ITEM = 'de_pc_logged_in';
        const SHOPIFY_CART_ITEM = 'de_pc_shopify_cart';

        expect(localStorage.getItem(LOGGED_IN_ITEM)).to.not.be.null;
        expect(localStorage.getItem(LOGGED_IN_ITEM)).to.eq('true');

        expect(localStorage.getItem(SHOPIFY_CART_ITEM)).to.not.be.null;
      });
  });
});
