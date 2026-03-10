/**
 * CartPage — Page Object Model
 */
export class CartPage {
  private readonly cartItems    = '[data-test="inventory-item"]'
  private readonly itemName     = '[data-test="inventory-item-name"]'
  private readonly checkoutBtn  = '[data-test="checkout"]'
  private readonly continueBtn  = '[data-test="continue-shopping"]'

  assertOnCartPage(): this {
    cy.url().should('include', '/cart.html')
    return this
  }

  getItemCount(): Cypress.Chainable<number> {
    return cy.get(this.cartItems).its('length')
  }

  assertItemInCart(name: string): this {
    cy.get(this.itemName).should('contain', name)
    return this
  }

  assertCartEmpty(): this {
    cy.get(this.cartItems).should('not.exist')
    return this
  }

  removeByTestId(productTestId: string): this {
    cy.get(`[data-test="remove-${productTestId}"]`).click()
    return this
  }

  proceedToCheckout(): this {
    cy.get(this.checkoutBtn).click()
    return this
  }

  continueShopping(): this {
    cy.get(this.continueBtn).click()
    return this
  }
}
