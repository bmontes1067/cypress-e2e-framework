# 🧪 Cypress E2E Framework

![E2E Tests](https://github.com/bmontes1067/cypress-e2e-framework/actions/workflows/e2e-tests.yml/badge.svg)
![Cypress](https://img.shields.io/badge/Cypress-13.x-04C38E?logo=cypress&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node-20.x-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

End-to-end test automation framework built with **Cypress 13**, **TypeScript** and **Page Object Model**. Tests run against [SauceDemo](https://www.saucedemo.com), a reference e-commerce app. CI/CD pipeline with GitHub Actions running on Chrome and Firefox on every push and PR.

---

## 📋 Table of Contents

- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Test Coverage](#-test-coverage)
- [Getting Started](#-getting-started)
- [Running Tests](#-running-tests)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Reporting](#-reporting)
- [Design Decisions](#-design-decisions)
- [What I Learned](#-what-i-learned)

---

## 🎬 Demo

> Tests running in headless mode on GitHub Actions:

```
  🔐 Authentication
    ✅ Happy path
      ✓ should log in successfully with valid credentials (1.2s)
      ✓ should redirect to inventory after login (0.8s)
      ✓ should log out correctly (1.1s)
    ❌ Negative cases
      ✓ should show error with invalid credentials (0.9s)
      ✓ should show error when username is empty (0.7s)
      ✓ should show error when password is empty (0.7s)
      ✓ should block the locked out user (0.8s)

  🛍️ Product Inventory
    ✓ should display 6 products (1.0s)
    ✓ should sort products A → Z by default (0.9s)
    ✓ should sort products Z → A (1.0s)
    ✓ should add a product to cart and update badge (0.8s)

  💳 Checkout Flow
    ✓ should complete checkout with valid personal info (2.1s)
    ✓ should display correct total on checkout summary (1.8s)
    ✓ should show error when first name is missing (0.9s)
    ...

  18 passing (14.2s)
```

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Cypress](https://www.cypress.io/) | 13.x | E2E test runner |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety across the framework |
| [Allure](https://allurereport.org/) | 2.x | Visual HTML test reports |
| [GitHub Actions](https://github.com/features/actions) | — | CI/CD pipeline |
| [ESLint](https://eslint.org/) | 8.x | Code quality |

---

## 📁 Project Structure

```
cypress-e2e-framework/
├── .github/
│   └── workflows/
│       └── e2e-tests.yml        # CI/CD pipeline (Chrome + Firefox)
├── cypress/
│   ├── e2e/                     # Test specs
│   │   ├── login.cy.ts          # Authentication tests (happy + negative)
│   │   ├── inventory.cy.ts      # Product listing & sorting tests
│   │   └── checkout.cy.ts       # Full checkout flow tests
│   ├── fixtures/                # Test data
│   │   ├── users.json           # User credentials
│   │   └── products.json        # Product data & checkout info
│   ├── pages/                   # Page Object Models
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   └── CheckoutPage.ts
│   └── support/
│       ├── commands.ts          # Custom Cypress commands
│       └── e2e.ts               # Global hooks & Allure setup
├── cypress.config.ts            # Cypress configuration
├── tsconfig.json
└── package.json
```

---

## ✅ Test Coverage

| Area | Tests | Happy Path | Negative Cases |
|------|-------|-----------|----------------|
| Authentication | 7 | ✅ | ✅ |
| Product listing | 6 | ✅ | — |
| Sorting | 4 | ✅ | — |
| Cart management | 3 | ✅ | ✅ |
| Checkout flow | 7 | ✅ | ✅ |
| **Total** | **27** | | |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 9+

### Installation

```bash
git clone https://github.com/bmontes1067/cypress-e2e-framework.git
cd cypress-e2e-framework
npm install
```

---

## ▶️ Running Tests

```bash
# Open Cypress interactive mode
npm run cy:open

# Run all tests headless (default Electron)
npm run cy:run

# Run on Chrome
npm run cy:run:chrome

# Run headed (you see the browser)
npm run cy:run:headed

# Generate and open Allure report
npm run cy:report
```

### Override environment variables

```bash
npx cypress run --env STANDARD_USER=my_user,PASSWORD=my_pass
```

Or create a local `cypress.env.json` (already in `.gitignore`):

```json
{
  "STANDARD_USER": "standard_user",
  "PASSWORD": "secret_sauce"
}
```

---

## ⚙️ CI/CD Pipeline

The pipeline runs automatically on every **push** and **pull request** to `main` and `develop`, and as a **nightly scheduled run** at 07:00 UTC.

```
┌─────────────────────────────────────────────┐
│           GitHub Actions Pipeline            │
│                                              │
│  push / PR / nightly cron                   │
│         ↓                                   │
│  ┌──────────────┐  ┌──────────────────┐     │
│  │ Chrome tests │  │  Firefox tests   │     │
│  └──────┬───────┘  └────────┬─────────┘     │
│         ↓                   ↓               │
│     Artifacts           Artifacts           │
│  (screenshots,        (screenshots,         │
│    videos)               videos)            │
│         ↓                                   │
│    Allure report → GitHub Pages             │
└─────────────────────────────────────────────┘
```

---

## 📊 Reporting

Allure reports are automatically generated after each CI run and deployed to **GitHub Pages**.

To generate reports locally:

```bash
npm run cy:report
```

---

## 🧠 Design Decisions

**Why Page Object Model?**
POM decouples test logic from UI selectors. When the UI changes, you only update one file, not every test. It also makes tests much more readable.

**Why TypeScript?**
Type safety catches errors at compile time, enables IDE autocompletion for custom commands, and makes the codebase much easier to maintain as it grows.

**Why fixtures instead of hardcoded data?**
Centralizing test data in JSON files makes it trivial to run the same tests against different environments or datasets without touching the test logic.

**Why custom commands?**
`cy.login()` appears in almost every test. Having it as a custom command makes tests shorter, DRY, and self-documenting.

---

## 📚 What I Learned

- How to structure a scalable Cypress framework from scratch with TypeScript
- The importance of meaningful selector strategies (`data-test` attributes vs CSS classes)
- How to balance test isolation vs speed (session reuse for non-auth tests)
- Setting up multi-browser CI pipelines with matrix strategies
- Integrating Allure for rich reporting beyond the default Cypress output

---

## 📄 License

MIT © [Belén Montes](https://github.com/bmontes1067)
