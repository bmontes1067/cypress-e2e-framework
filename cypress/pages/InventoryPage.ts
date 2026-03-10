/**
 * InventoryPage — Page Object Model
 */
export class InventoryPage {
  private readonly sortDropdown  = '[data-test="product-sort-container"]'
  private readonly inventoryItem = '[data-test="inventory-item"]'
  private readonly itemName      = '[data-test="inventory-item-name"]'
  private readonly itemPrice     = '[data-test="inventory-item-price"]'
  private readonly cartBadge     = '[data-test="shopping-cart-badge"]'
  private readonly cartLink      = '[data-test="shopping-cart-link"]'
  private readonly burgerMenu    = '#react-burger-menu-btn'
  private readonly resetLink     = '[data-test="reset-sidebar-link"]'
  private readonly closeBurger   = '#react-burger-cross-btn'
  private readonly logoutLink    = '[data-test="logout-sidebar-link"]'

  assertOnInventoryPage(): this {
    cy.url().should('include', '/inventory.html')
    return this
  }

  getProductCount(): Cypress.Chainable<number> {
    return cy.get(this.inventoryItem).its('length')
  }

  sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): this {
    cy.get(this.sortDropdown).select(option)
    return this
  }

  getProductNames(): Cypress.Chainable<string[]> {
    return cy.get(this.itemName).then(($els) =>
      Array.from($els).map((el) => el.innerText)
    )
  }

  getProductPrices(): Cypress.Chainable<number[]> {
    return cy.get(this.itemPrice).then(($els) =>
      Array.from($els).map((el) => parseFloat(el.innerText.replace('$', '')))
    )
  }

  addToCartByTestId(productTestId: string): this {
    cy.get(`[data-test="add-to-cart-${productTestId}"]`).click()
    return this
  }

  removeFromCartByTestId(productTestId: string): this {
    cy.get(`[data-test="remove-${productTestId}"]`).click()
    return this
  }

  assertCartBadge(count: number): this {
    cy.get(this.cartBadge).should('contain', count)
    return this
  }

  assertCartBadgeNotExists(): this {
    cy.get(this.cartBadge).should('not.exist')
    return this
  }

  goToCart(): this {
    cy.get(this.cartLink).click()
    return this
  }

  clickFirstProduct(): this {
    cy.get(this.itemName).first().click()
    return this
  }

  resetAppState(): this {
    cy.get(this.burgerMenu).click()
    cy.get(this.resetLink).click()
    cy.get(this.closeBurger).click()
    return this
  }

  logout(): this {
    cy.get(this.burgerMenu).click()
    cy.get(this.logoutLink).click()
    return this
  }
}
