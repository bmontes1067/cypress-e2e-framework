# 🧪 Cypress E2E Framework

![E2E Tests](https://github.com/bmontes1067/cypress-e2e-framework/actions/workflows/e2e-tests.yml/badge.svg)
![Cypress](https://img.shields.io/badge/Cypress-14.x-04C38E?logo=cypress&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node-20.x-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

End-to-end test automation framework built with **Cypress 14**, **TypeScript** and **Page Object Model**. Tests run against [SauceDemo](https://www.saucedemo.com). CI/CD pipeline with GitHub Actions running on Chrome and Firefox on every push and PR.

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

```
  🔐 Login & Logout
    ✓ should log in and log out as standard_user (1.2s)
    ✓ should log in and log out as problem_user (1.1s)
    ✓ should show error when logging in as locked_out_user (0.9s)
    ✓ should show error with invalid credentials (0.8s)
    ✓ should show error when username is empty (0.7s)
    ✓ should show error when password is empty (0.7s)

  🛍️ Product Inventory
    ✓ should display 6 products (1.0s)
    ✓ should sort products by name A → Z (0.9s)
    ✓ should sort products by price low → high (1.0s)
    ✓ should add a product to cart and show badge (0.8s)

  💳 Checkout Flow
    ✓ should complete checkout with all products and verify totals (3.1s)
    ✓ should show error when first name is missing (0.9s)
    ✓ should cancel checkout and return to cart (0.8s)
    ...

  25 passing (22.4s)
```

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Cypress](https://www.cypress.io/) | 14.x | E2E test runner |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety |
| [Allure](https://allurereport.org/) | 3.x | Visual HTML reports |
| [GitHub Actions](https://github.com/features/actions) | — | CI/CD pipeline |
| [dotenv](https://github.com/motdotla/dotenv) | 16.x | Environment variables |

---

## 📁 Project Structure

```
cypress-e2e-framework/
├── .github/
│   └── workflows/
│       └── e2e-tests.yml        # CI/CD — Chrome + Firefox matrix
├── cypress/
│   ├── e2e/
│   │   ├── login.cy.ts          # Authentication tests
│   │   ├── inventory.cy.ts      # Product listing & sorting
│   │   └── checkout.cy.ts       # Full checkout flow
│   ├── pages/                   # Page Object Models
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   └── CheckoutPage.ts
│   └── support/
│       ├── commands.ts          # Custom Cypress commands
│       └── e2e.ts               # Global hooks
├── .env                         # Local credentials (not committed)
├── cypress.config.ts
├── tsconfig.json
└── package.json
```

---

## ✅ Test Coverage

| Suite | Tests | Happy Path | Negative Cases |
|-------|-------|-----------|----------------|
| Authentication | 7 | ✅ | ✅ |
| Product Inventory | 9 | ✅ | — |
| Cart management | 3 | ✅ | ✅ |
| Checkout flow | 7 | ✅ | ✅ |
| **Total** | **26** | | |

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

### Environment variables

The project includes a `.env` file with the default SauceDemo credentials ready to use. No setup needed for local runs.

If you want to override them, edit `.env`:

```env
BASE_URL=https://www.saucedemo.com
STANDARD_USER_USERNAME=standard_user
PASSWORD=secret_sauce
FIRST_NAME=Belén
LAST_NAME=Montes
POSTAL_CODE=41000
```

---

## ▶️ Running Tests

```bash
# Open Cypress interactive mode
npm run cy:open

# Run all tests headless (Electron)
npm run cy:run

# Run on Chrome
npm run cy:run:chrome
```

---

## 📊 Reporting

This project uses [Allure](https://allurereport.org/) for rich HTML reports with steps, screenshots and environment info.

### Step 1 — Run the tests

```bash
npm run cy:run
```

This generates the raw results in `cypress/allure-results/`.

### Step 2 — Generate and open the report

```bash
npm run cy:report
```

> ⚠️ **Requires Allure CLI installed on your machine.**
>
> Install it with one of these options:
> ```bash
> # macOS
> brew install allure
>
> # npm global
> npm install -g allure-commandline
> ```

Alternatively, run without installing globally:

```bash
npx allure generate cypress/allure-results --clean -o allure-report
npx allure open allure-report
```

---

## ⚙️ CI/CD Pipeline

Runs automatically on every **push** and **pull request** to `main` and `develop`, and as a **nightly run** at 07:00 UTC.

```
push / PR / nightly cron
        ↓
┌───────────────┐  ┌─────────────────┐
│ Chrome tests  │  │  Firefox tests  │
└──────┬────────┘  └────────┬────────┘
       ↓                    ↓
   Artifacts            Artifacts
(screenshots,         (screenshots,
   videos)               videos)
       ↓
  Allure report → GitHub Pages
```

Credentials are stored as **GitHub Secrets** — never hardcoded.

---

## 🧠 Design Decisions

**Why Page Object Model?**
Decouples test logic from UI selectors. When the UI changes, only the Page Object needs updating — not every test.

**Why `data-test` attributes as selectors?**
They are stable, independent of CSS classes and styles, and communicate clearly that the element is used in tests.

**Why `resetAppState()` instead of logout/login between tests?**
SauceDemo rate-limits repeated logins. Using the built-in reset option via the side menu clears the cart state without making a new HTTP login request, keeping tests fast and reliable.

**Why TypeScript?**
Catches errors at compile time, enables autocompletion for custom commands, and makes the codebase easier to maintain as it grows.

**Why dotenv?**
Keeps credentials out of the code and makes it easy to override values per environment without touching the config file.

---

## 📚 What I Learned

- How to structure a scalable Cypress framework with TypeScript and POM from scratch
- The importance of `data-test` selectors vs CSS classes for test resilience
- How SauceDemo's rate limiting works and how to design tests around it
- Setting up multi-browser CI pipelines with matrix strategies in GitHub Actions
- Integrating Allure for rich reporting with steps, epics and environment metadata

---

## 📄 License

MIT © [Belén Montes](https://github.com/bmontes1067)
