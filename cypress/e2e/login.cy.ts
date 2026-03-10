import * as allure from 'allure-js-commons'
import { LoginPage }     from '../pages/LoginPage'
import { InventoryPage } from '../pages/InventoryPage'

const loginPage     = new LoginPage()
const inventoryPage = new InventoryPage()

describe('🔐 Login & Logout', () => {
  beforeEach(() => {
    allure.epic('Saucedemo E2E Framework')
    allure.feature('Authentication')
  })

  it('should log in and log out as standard_user', () => {
    allure.story('Login / Logout')
    cy.login(Cypress.env('STANDARD_USER_USERNAME'), Cypress.env('PASSWORD'))
    cy.url().should('include', '/inventory.html')
    cy.logout()
    loginPage.assertOnLoginPage()
  })

  it('should log in and log out as problem_user', () => {
    allure.story('Login / Logout')
    cy.login(Cypress.env('PROBLEM_USER_USERNAME'), Cypress.env('PASSWORD'))
    cy.url().should('include', '/inventory.html')
    cy.logout()
    loginPage.assertOnLoginPage()
  })

  it('should log in and log out as performance_glitch_user', () => {
    allure.story('Login / Logout')
    cy.login(Cypress.env('PERFORMANCE_GLITCH_USER_USERNAME'), Cypress.env('PASSWORD'))
    cy.url().should('include', '/inventory.html')
    cy.logout()
    loginPage.assertOnLoginPage()
  })

  it('should show error when logging in as locked_out_user', () => {
    allure.story('Negative cases')
    cy.login(Cypress.env('LOCKED_OUT_USER_USERNAME'), Cypress.env('PASSWORD'))
    loginPage.assertErrorContains('Sorry, this user has been locked out.')
  })

  it('should show error with invalid credentials', () => {
    allure.story('Negative cases')
    cy.visit(Cypress.env('BASE_URL'))
    loginPage.login('invalid_user', 'wrong_password')
    loginPage.assertErrorContains('Username and password do not match')
  })

  it('should show error when username is empty', () => {
    allure.story('Negative cases')
    cy.visit(Cypress.env('BASE_URL'))
    cy.get('[data-test="password"]').type(Cypress.env('PASSWORD'))
    cy.get('[data-test="login-button"]').click()
    loginPage.assertErrorContains('Username is required')
  })

  it('should show error when password is empty', () => {
    allure.story('Negative cases')
    cy.visit(Cypress.env('BASE_URL'))
    cy.get('[data-test="username"]').type(Cypress.env('STANDARD_USER_USERNAME'))
    cy.get('[data-test="login-button"]').click()
    loginPage.assertErrorContains('Password is required')
  })
})
