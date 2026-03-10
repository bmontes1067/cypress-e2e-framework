export class CheckoutPage {
  private readonly firstNameInput  = '[data-test="firstName"]'
  private readonly lastNameInput   = '[data-test="lastName"]'
  private readonly postalCodeInput = '[data-test="postalCode"]'
  private readonly continueBtn     = '[data-test="continue"]'
  private readonly cancelBtn       = '[data-test="cancel"]'
  private readonly finishBtn       = '[data-test="finish"]'
  private readonly errorMessage    = '[data-test="error"]'
  private readonly subtotalLabel   = '[data-test="subtotal-label"]'
  private readonly taxLabel        = '[data-test="tax-label"]'
  private readonly totalLabel      = '[data-test="total-label"]'
  private readonly completeHeader  = '[data-test="complete-header"]'
  private readonly completeText    = '[data-test="complete-text"]'

  assertOnStepOne(): this {
    cy.url().should('include', '/checkout-step-one.html')
    return this
  }

  assertOnStepTwo(): this {
    cy.url().should('include', '/checkout-step-two.html')
    return this
  }

  /** Skips type() for empty strings to avoid CypressError */
  fillForm(firstName: string, lastName: string, postalCode: string): this {
    cy.get(this.firstNameInput).should('be.visible')
    if (firstName)  cy.get(this.firstNameInput).type(firstName)

    cy.get(this.lastNameInput).should('be.visible')
    if (lastName)   cy.get(this.lastNameInput).type(lastName)

    cy.get(this.postalCodeInput).should('be.visible')
    if (postalCode) cy.get(this.postalCodeInput).type(postalCode)

    cy.get(this.continueBtn).click()
    return this
  }

  assertErrorContains(text: string): this {
    cy.get(this.errorMessage).should('contain', text)
    return this
  }

  assertSubtotal(amount: string): this {
    cy.get(this.subtotalLabel).should('contain', `$${amount}`)
    return this
  }

  assertTax(amount: string): this {
    cy.get(this.taxLabel).should('contain', `$${amount}`)
    return this
  }

  assertTotal(amount: string): this {
    cy.get(this.totalLabel).should('contain', `$${amount}`)
    return this
  }

  finish(): this {
    cy.get(this.finishBtn).click()
    return this
  }

  cancel(): this {
    cy.get(this.cancelBtn).click()
    return this
  }

  assertOrderConfirmed(): this {
    cy.url().should('include', '/checkout-complete.html')
    cy.get(this.completeHeader).should('contain', 'Thank you for your order!')
    cy.get(this.completeText).should('contain', 'Your order has been dispatched')
    return this
  }
}
