import * as allure from 'allure-js-commons'
import { InventoryPage } from '../pages/InventoryPage'

const inventoryPage = new InventoryPage()

describe('🛍️ Product Inventory', () => {
  beforeEach(() => {
    allure.epic('Saucedemo E2E Framework')
    allure.feature('Product Inventory')
    cy.loginAsStandardUser()
  })

  afterEach(() => {
    cy.resetAppState()
  })

  context('📦 Product listing', () => {
    it('should display 6 products', () => {
      allure.story('Product listing')
      inventoryPage.getProductCount().should('eq', 6)
    })

    it('should display product name, description, price and image for each item', () => {
      allure.story('Product listing')
      cy.get('[data-test="inventory-item"]').each(($item) => {
        cy.wrap($item).find('[data-test="inventory-item-name"]').should('not.be.empty')
        cy.wrap($item).find('[data-test="inventory-item-desc"]').should('not.be.empty')
        cy.wrap($item).find('[data-test="inventory-item-price"]').should('not.be.empty')
        cy.wrap($item).find('img').should('be.visible')
      })
    })
  })

  context('🔃 Sorting', () => {
    it('should sort products by name A → Z', () => {
      allure.story('Sorting')
      inventoryPage.sortBy('az')
      inventoryPage.getProductNames().then((names) => {
        const sorted = [...names].sort((a, b) => a.localeCompare(b))
        expect(names).to.deep.equal(sorted)
      })
    })

    it('should sort products by name Z → A', () => {
      allure.story('Sorting')
      inventoryPage.sortBy('za')
      inventoryPage.getProductNames().then((names) => {
        const sorted = [...names].sort((a, b) => b.localeCompare(a))
        expect(names).to.deep.equal(sorted)
      })
    })

    it('should sort products by price low → high', () => {
      allure.story('Sorting')
      inventoryPage.sortBy('lohi')
      inventoryPage.getProductPrices().then((prices) => {
        const sorted = [...prices].sort((a, b) => a - b)
        expect(prices).to.deep.equal(sorted)
      })
    })

    it('should sort products by price high → low', () => {
      allure.story('Sorting')
      inventoryPage.sortBy('hilo')
      inventoryPage.getProductPrices().then((prices) => {
        const sorted = [...prices].sort((a, b) => b - a)
        expect(prices).to.deep.equal(sorted)
      })
    })
  })

  context('🛒 Add / Remove from cart', () => {
    it('should add a product to cart and show badge', () => {
      allure.story('Cart')
      inventoryPage.addToCartByTestId('sauce-labs-backpack')
      inventoryPage.assertCartBadge(1)
    })

    it('should add two products and show correct badge count', () => {
      allure.story('Cart')
      inventoryPage.addToCartByTestId('sauce-labs-backpack')
      inventoryPage.addToCartByTestId('sauce-labs-bike-light')
      inventoryPage.assertCartBadge(2)
    })

    it('should remove a product from inventory page and clear badge', () => {
      allure.story('Cart')
      inventoryPage.addToCartByTestId('sauce-labs-backpack')
      inventoryPage.assertCartBadge(1)
      inventoryPage.removeFromCartByTestId('sauce-labs-backpack')
      inventoryPage.assertCartBadgeNotExists()
    })
  })
})
