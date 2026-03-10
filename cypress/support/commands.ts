/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>
      loginAsStandardUser(): Chainable<void>
      logout(): Chainable<void>
      resetAppState(): Chainable<void>
      completeCheckoutForm(firstName: string, lastName: string, postalCode: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit(Cypress.env('BASE_URL'))
  cy.get('[data-test="username"]').type(username)
  cy.get('[data-test="password"]').type(password)
  cy.get('[data-test="login-button"]').click()
})

Cypress.Commands.add('loginAsStandardUser', () => {
  cy.login(
    Cypress.env('STANDARD_USER_USERNAME'),
    Cypress.env('PASSWORD')
  )
  cy.url().should('include', '/inventory.html')
})

Cypress.Commands.add('logout', () => {
  cy.get('#react-burger-menu-btn').click()
  cy.get('[data-test="logout-sidebar-link"]').click()
})

Cypress.Commands.add('resetAppState', () => {
  cy.get('#react-burger-menu-btn').click()
  cy.get('[data-test="reset-sidebar-link"]').click()
  cy.get('#react-burger-cross-btn').click()
})

/**
 * Fill checkout form — skips .type() for empty fields so Cypress doesn't throw.
 * Empty fields are left blank to trigger the required-field validation errors.
 */
Cypress.Commands.add('completeCheckoutForm', (
  firstName: string,
  lastName: string,
  postalCode: string
) => {
  cy.get('[data-test="firstName"]').should('be.visible')
  if (firstName) cy.get('[data-test="firstName"]').type(firstName)

  cy.get('[data-test="lastName"]').should('be.visible')
  if (lastName) cy.get('[data-test="lastName"]').type(lastName)

  cy.get('[data-test="postalCode"]').should('be.visible')
  if (postalCode) cy.get('[data-test="postalCode"]').type(postalCode)

  cy.get('[data-test="continue"]').click()
})

export {}
