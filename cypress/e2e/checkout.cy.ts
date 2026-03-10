import * as allure from 'allure-js-commons'
import { InventoryPage } from '../pages/InventoryPage'
import { CartPage }       from '../pages/CartPage'
import { CheckoutPage }   from '../pages/CheckoutPage'

const inventoryPage = new InventoryPage()
const cartPage      = new CartPage()
const checkoutPage  = new CheckoutPage()

describe('💳 Checkout Flow', () => {
  beforeEach(() => {
    allure.epic('Saucedemo E2E Framework')
    allure.feature('Checkout')
    cy.loginAsStandardUser()
  })

  afterEach(() => {
    cy.resetAppState()
  })

  context('🛒 Cart management', () => {
    it('should add a product and verify it appears in cart', () => {
      allure.story('Cart management')
      inventoryPage.addToCartByTestId('sauce-labs-backpack')
      inventoryPage.goToCart()
      cartPage.assertOnCartPage()
      cartPage.assertItemInCart('Sauce Labs Backpack')
      cartPage.getItemCount().should('eq', 1)
    })

    it('should remove a product from the cart page', () => {
      allure.story('Cart management')
      inventoryPage.addToCartByTestId('sauce-labs-backpack')
      inventoryPage.goToCart()
      cartPage.removeByTestId('sauce-labs-backpack')
      cartPage.assertCartEmpty()
    })

    it('should continue shopping from cart and return to inventory', () => {
      allure.story('Cart management')
      inventoryPage.addToCartByTestId('sauce-labs-backpack')
      inventoryPage.goToCart()
      cartPage.continueShopping()
      inventoryPage.assertOnInventoryPage()
    })
  })

  context('✅ Happy path — complete checkout', () => {
    it('should complete checkout with all products and verify totals', () => {
      allure.story('Full checkout')

      // Collect product info before adding to cart
      const products: { name: string; price: string }[] = []

      cy.get('[data-test="inventory-item"]').each(($item) => {
        const name  = Cypress.$($item).find('[data-test="inventory-item-name"]').text()
        const price = Cypress.$($item).find('[data-test="inventory-item-price"]').text()
        products.push({ name, price })
        cy.wrap($item).find('[data-test^="add-to-cart-"]').click()
      })

      inventoryPage.assertCartBadge(6)
      inventoryPage.goToCart()
      cartPage.assertOnCartPage()
      cartPage.proceedToCheckout()

      checkoutPage.assertOnStepOne()
      cy.completeCheckoutForm(
        Cypress.env('FIRST_NAME'),
        Cypress.env('LAST_NAME'),
        Cypress.env('POSTAL_CODE')
      )
      checkoutPage.assertOnStepTwo()

      // Verify products in summary
      cy.get('[data-test="inventory-item-name"]').each(($item, index) => {
        cy.wrap($item).should('contain', products[index].name)
      })
      cy.get('[data-test="inventory-item-price"]').each(($item, index) => {
        cy.wrap($item).should('contain', products[index].price)
      })

      // Verify totals
      cy.then(() => {
        const subtotal = products
          .reduce((sum, p) => sum + parseFloat(p.price.replace('$', '')), 0)
          .toFixed(2)
        const tax   = (parseFloat(subtotal) * 0.08).toFixed(2)
        const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2)

        checkoutPage.assertSubtotal(subtotal).assertTax(tax).assertTotal(total)
      })

      checkoutPage.finish()
      checkoutPage.assertOrderConfirmed()
    })
  })

  context('❌ Checkout validation — negative cases', () => {
    beforeEach(() => {
      inventoryPage.addToCartByTestId('sauce-labs-backpack')
      inventoryPage.goToCart()
      cartPage.proceedToCheckout()
      checkoutPage.assertOnStepOne()
    })

    it('should show error when first name is missing', () => {
      allure.story('Validation')
      cy.completeCheckoutForm('', Cypress.env('LAST_NAME'), Cypress.env('POSTAL_CODE'))
      checkoutPage.assertErrorContains('First Name is required')
    })

    it('should show error when last name is missing', () => {
      allure.story('Validation')
      cy.completeCheckoutForm(Cypress.env('FIRST_NAME'), '', Cypress.env('POSTAL_CODE'))
      checkoutPage.assertErrorContains('Last Name is required')
    })

    it('should show error when postal code is missing', () => {
      allure.story('Validation')
      cy.completeCheckoutForm(Cypress.env('FIRST_NAME'), Cypress.env('LAST_NAME'), '')
      checkoutPage.assertErrorContains('Postal Code is required')
    })

    it('should cancel checkout and return to cart', () => {
      allure.story('Validation')
      checkoutPage.cancel()
      cartPage.assertOnCartPage()
    })
  })
})
