/**
 * Feature: Validate Flipkart Banner Navigation
 * Run: npx playwright test tests/Practisefetchallpageproducts.spec.js --headed
 */

const { test, expect } = require('@playwright/test');

test('Flipkart Banner Navigation - Mobiles category @Smoke', async ({ page }) => {
  const targetCategory = 'Mobiles';
  const bannerCategoryXpath =
    "//div[@class='css-g5y9jx r-1awozwy r-1777fci r-6gpygo r-iphfwy r-13zlsnc']";
  const bannerFilters = page.locator(bannerCategoryXpath);
  const bannerCategoryLinks = page.locator(`//a[.${bannerCategoryXpath}]`);

  // Given: User launches Flipkart homepage
  await page.goto('https://www.flipkart.com/', { waitUntil: 'domcontentloaded' });

  const closeLoginPopup = page.locator("//button[normalize-space()='✕']");
  if (await closeLoginPopup.isVisible({ timeout: 3000 }).catch(() => false)) {
    await closeLoginPopup.click();
  }

  // When: User fetches all banner filter categories
  await expect(bannerFilters.first()).toBeVisible();
  const titles = await bannerFilters.allTextContents();
  console.log(titles);

  // And: User clicks on "Mobiles" category
  for (let i = 0; i < titles.length; i++) {
    const category = await bannerFilters.nth(i).textContent();
    if (category?.trim().toLowerCase() === targetCategory.toLowerCase()) {
      await bannerCategoryLinks.nth(i).click();
      break;
    }
  }

  // Then: User should be navigated to Mobiles page
  await page.waitForLoadState('domcontentloaded');
  await expect(
    page
      .locator(
        "//h1[contains(translate(normalize-space(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'mobile')] | //span[contains(translate(normalize-space(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'mobile')]"
      )
      .first()
  ).toBeVisible();

  // And: URL should contain "mobile"
  await expect(page).toHaveURL(/mobile/i);
});
