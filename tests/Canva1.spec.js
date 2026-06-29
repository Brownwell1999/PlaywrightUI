/** The Multi-Step Oauth / Third-Party Gateway
 * This test is used to test the login functionality of the Canva website using Google OAuth.
 * Feature: User Authentication via Third-Party OAuth
 *
 *   Given the user navigates to the Canva login page
 *   When the user initiates login with "Continue with Google"
 *   Then a secure Google accounts authentication popup should appear
 *   When the user submits valid Google credentials in the popup
 *   Then the authentication popup should close automatically
 *   And the user should be redirected to the Canva home dashboard
 *
 * Setup before run (PowerShell):
 *   $env:GOOGLE_PASSWORD = "your-google-password"
 *   npx playwright test tests/Canva1.spec.js --headed
 */

const { test, expect } = require('@playwright/test');

test('Canva login via Google OAuth', async ({ page, context }) => {
  test.setTimeout(120000);

  const googleEmail = process.env.GOOGLE_EMAIL || 'nigamdeepak8880email@gmail.com';
  const googlePassword = process.env.GOOGLE_PASSWORD;

  if (!googlePassword) {
    throw new Error(
      'GOOGLE_PASSWORD is not set. Run: $env:GOOGLE_PASSWORD = "your-password" before the test.'
    );
  }

  // ─── GIVEN: Navigate to Canva login page ───────────────────────────────────
  await page.goto('https://www.canva.com/login/', { waitUntil: 'domcontentloaded' });

  try {
    await page.locator("//button[contains(.,'Accept') or contains(.,'Agree')]").first().click({
      timeout: 5000,
    });
  } catch {
    // Cookie banner may not appear
  }

  // ─── WHEN: Click "Continue with Google" ────────────────────────────────────
  const continueWithGoogle = page.locator(
    "//button[contains(.,'Continue with Google') or contains(.,'Continue with google')]"
  );

  const googlePopupPromise = context.waitForEvent('page', { timeout: 30000 });
  await continueWithGoogle.click();
  const googlePage = await googlePopupPromise;
  await googlePage.waitForLoadState('domcontentloaded');

  // ─── THEN: Google authentication popup should appear ───────────────────────
  await expect(googlePage).toHaveURL(/accounts\.google\.com/, { timeout: 15000 });

  // ─── WHEN: Submit valid Google credentials in popup ────────────────────────
  const emailInput = googlePage.locator("//input[@type='email' or @id='identifierId']");
  await emailInput.fill(googleEmail);
  await googlePage.locator("//button[@id='identifierNext'] | //span[text()='Next']/ancestor::button").first().click();

  const passwordInput = googlePage.locator("//input[@type='password' or @name='Passwd']");
  await passwordInput.waitFor({ state: 'visible', timeout: 15000 });
  await passwordInput.fill(googlePassword);
  await googlePage.locator("//button[@id='passwordNext'] | //span[text()='Next']/ancestor::button").first().click();

  // Optional: Google "Continue" / Canva consent screen
  try {
    await googlePage.locator("//button[contains(.,'Continue')]").first().click({ timeout: 8000 });
  } catch {
    // Not always shown
  }

  // ─── THEN: Popup closes + user lands on Canva dashboard ────────────────────
  await googlePage.waitForEvent('close', { timeout: 60000 }).catch(() => null);

  await page.waitForURL(/canva\.com/, { timeout: 60000 });
  await expect(page).not.toHaveURL(/\/login/);
  await expect(page).toHaveURL(/canva\.com/);

  // Dashboard/home indicator — profile or create design area
  const dashboardMarker = page.locator(
    "//a[contains(@href,'/create')] | //button[contains(.,'Create a design')] | //nav"
  ).first();
  await expect(dashboardMarker).toBeVisible({ timeout: 30000 });
});
