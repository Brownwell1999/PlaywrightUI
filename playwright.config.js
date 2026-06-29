// @ts-check
import { defineConfig, devices } from '@playwright/test';


/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = ({
  testDir: './tests', 
  retries:1,   // Define the directory where the test files are located
  timeout : 80 * 1000,  // Set a global timeout for each test (40 seconds in this case) but the default is 30 seconds
    expect: {
      timeout: 5000, // Set a timeout for expect assertions (5 seconds in this case) that is 5000 milliseconds
    },
    reporter: process.env.CI
      ? [['html'], ['junit', { outputFile: 'test-results/junit.xml' }]]
      : 'html',

  use: {
    
    browserName : 'chromium',  // Set the default browser to 'chromium' (you can change this to 'firefox' or 'webkit' if needed)
    headless: !!process.env.CI,
    screenshot : 'on', 
    trace : 'on' // Capture trace information for each test
  },

    
});

module.exports = config

