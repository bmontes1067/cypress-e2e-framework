import { defineConfig } from 'cypress'
import { allureCypress } from 'allure-cypress/reporter'
import * as os from 'os'
import * as dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com',

    env: {
      BASE_URL:                           process.env.BASE_URL                           || 'https://www.saucedemo.com',
      STANDARD_USER_USERNAME:             process.env.STANDARD_USER_USERNAME             || 'standard_user',
      LOCKED_OUT_USER_USERNAME:           process.env.LOCKED_OUT_USER_USERNAME           || 'locked_out_user',
      PROBLEM_USER_USERNAME:              process.env.PROBLEM_USER_USERNAME              || 'problem_user',
      PERFORMANCE_GLITCH_USER_USERNAME:   process.env.PERFORMANCE_GLITCH_USER_USERNAME   || 'performance_glitch_user',
      PASSWORD:                           process.env.PASSWORD                           || 'secret_sauce',
      FIRST_NAME:                         process.env.FIRST_NAME                         || 'Belén',
      LAST_NAME:                          process.env.LAST_NAME                          || 'Montes',
      POSTAL_CODE:                        process.env.POSTAL_CODE                        || '41000',
    },

    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    video: true,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',

    setupNodeEvents(on, config) {
      allureCypress(on, config, {
        environmentInfo: {
          os_platform: os.platform(),
          os_release:  os.release(),
          node_version: process.version,
        },
        resultsDir: 'cypress/allure-results',
      })
      return config
    },
  },
})
