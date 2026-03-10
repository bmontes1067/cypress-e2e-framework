/**
 * LoginPage — Page Object Model
 * All selectors use data-test attributes for resilience.
 */
export class LoginPage {
  private readonly usernameInput = '[data-test="username"]'
  private readonly passwordInput = '[data-test="password"]'
  private readonly loginButton   = '[data-test="login-button"]'
  private readonly errorMessage  = '[data-test="error"]'

  visit(): this {
    cy.visit(Cypress.env('BASE_URL'))
    return this
  }

  fillUsername(username: string): this {
    cy.get(this.usernameInput).type(username)
    return this
  }

  fillPassword(password: string): this {
    cy.get(this.passwordInput).type(password)
    return this
  }

  submit(): this {
    cy.get(this.loginButton).click()
    return this
  }

  login(username: string, password: string): this {
    return this.fillUsername(username).fillPassword(password).submit()
  }

  assertErrorContains(text: string): this {
    cy.get(this.errorMessage).should('contain', text)
    return this
  }

  assertOnLoginPage(): this {
    cy.url().should('eq', Cypress.env('BASE_URL') + '/')
    return this
  }
}
