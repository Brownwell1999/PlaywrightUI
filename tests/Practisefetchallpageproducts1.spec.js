/**
 * Feature: Banner Category Navigation
 *
 * Background: User is on Flipkart homepage
 * Run: npx playwright test tests/Practisefetchallpageproducts1.spec.js --headed
 */

const { test, expect } = require('@playwright/test');

test('Banner Category Navigation - Mobiles to Snapdragon @Regression', async ({ page }) => {
  test.setTimeout(120000);

  const targetCategory = 'Mobiles';
  const snapdragonCategory = 'Snapdragon Mobile'; // UI shows label as "Snapdragon"

  const bannerCategoryXpath =
    "//div[@class='css-g5y9jx r-1awozwy r-1777fci r-6gpygo r-iphfwy r-13zlsnc']";
  const bannerFilters = page.locator(bannerCategoryXpath);
  const bannerCategoryLinks = page.locator(`//a[.${bannerCategoryXpath}]`);
  const snapdragonMobileXpath =
    "//a[contains(translate(normalize-space(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'snapdragon')]";
  const snapdragonLinksXpath = "//a[contains(@href, 'snapdragon')]";

  // ─── Background: User is on Flipkart homepage ───────────────────────────────
  await page.goto('https://www.flipkart.com/', { waitUntil: 'domcontentloaded' });

  const closeLoginPopup = page.locator("//button[normalize-space()='✕']");
  if (await closeLoginPopup.isVisible({ timeout: 3000 }).catch(() => false)) {
    await closeLoginPopup.click();
  }

  // ─── When: User retrieves all banner categories ─────────────────────────────
  await expect(bannerFilters.first()).toBeVisible({ timeout: 15000 });
  const bannerCategories = await bannerFilters.allTextContents();
  console.log('Banner categories:', bannerCategories);

  // ─── Then: Banner category list should not be empty ───────────────────────────
  expect(bannerCategories.length).toBeGreaterThan(0);

  // ─── When: User iterates through banner categories ──────────────────────────
  // ─── And: User selects category "Mobiles" ───────────────────────────────────
  for (let i = 0; i < bannerCategories.length; i++) {
    const category = await bannerFilters.nth(i).textContent();
    if (category?.trim().toLowerCase() === targetCategory.toLowerCase()) {
      await bannerCategoryLinks.nth(i).click();
      break;
    }
  }

  // ─── Then: User should be redirected to the selected category page ──────────
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('body')).toBeVisible();

  // ─── And: The URL should be updated accordingly ─────────────────────────────
  await expect(page).toHaveURL(/mobile/i);

  // ─── When: User selects "Snapdragon Mobile" ─────────────────────────────────
  const snapdragonLink = page.locator(snapdragonMobileXpath).first();
  await expect(snapdragonLink).toBeVisible({ timeout: 15000 });
  await snapdragonLink.click();

  // ─── Then: User should be redirected to the Snapdragon Mobile page ──────────
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(/snapdragon/i);

  // ─── When: User retrieves all clickable links available on the page ─────────
  const snapdragonLinks = page.locator(snapdragonLinksXpath);
  await expect(snapdragonLinks.first()).toBeVisible({ timeout: 15000 });

  const storedLinks = []; // ArrayList to store snapdragonLinks
  const linkCount = await snapdragonLinks.count();

  for (let i = 0; i < linkCount; i++) {
    storedLinks.push(await snapdragonLinks.nth(i).getAttribute('href'));
  }

  // ─── Then: All clickable links should be stored successfully ────────────────
  expect(storedLinks.length).toBeGreaterThan(0);

  // ─── And: User should print the total clickable link count in the console ───
  console.log(`Total clickable link count for ${snapdragonCategory}:`, storedLinks.length);
  console.log('Stored links:', storedLinks);
});
