/**
 * Feature: E-Commerce Product Search and Price Sorting
 *
 *   Given the user navigates to the amazon e-commerce homepage
 *   When the user searches for Iphone 15
 *   And the user selects "Price: Low to High" from the sort dropdown
 *   Then the user should see the first page of results refreshed completely
 *   And the displayed product prices should be sorted in ascending order correctly
 */

const { test, expect } = require('@playwright/test');

test('E-Commerce: Search iPhone 15 and verify Price Low to High sort', async ({ page }) => {
  const searchTerm = 'Iphone 15';
  const sortOption = 'price-asc-rank';

  // ─── GIVEN: Navigate to Amazon homepage ────────────────────────────────────
  await page.goto('https://www.amazon.in/', { waitUntil: 'domcontentloaded' });

  try {
    await page.locator("//input[@data-action-type='DISMISS']").click({ timeout: 4000 });
  } catch {
    // Optional popup
  }

  // ─── WHEN: Search for Iphone 15 ────────────────────────────────────────────
  await page.locator("//input[@id='twotabsearchtextbox']").fill(searchTerm);
  await page.locator("//input[@id='nav-search-submit-button']").click();

  const firstResult = page.locator("//div[@data-component-type='s-search-result']").first();
  await firstResult.waitFor({ state: 'visible', timeout: 15000 });

  // ─── WHEN: Select "Price: Low to High" ─────────────────────────────────────
  const sortDropdown = page.locator("//select[@id='s-result-sort-select']");
  await sortDropdown.selectOption(sortOption);

  // ─── THEN: Results refreshed + prices sorted ascending ─────────────────────
  await expect(sortDropdown).toHaveValue(sortOption);
  await firstResult.waitFor({ state: 'visible', timeout: 15000 });

  const searchResults = page.locator(
    "//div[@data-component-type='s-search-result'][.//h2][not(.//span[contains(text(),'Sponsored')])]"
  );

  const prices = [];
  const maxToValidate = Math.min(await searchResults.count(), 12);

  for (let i = 0; i < maxToValidate; i++) {
    const resultCard = searchResults.nth(i);
    const priceInCard = resultCard.locator("span.a-price-whole").first();

    if (await priceInCard.isVisible().catch(() => false)) {
      const rawPrice = (await priceInCard.innerText()).replace(/[,]/g, '').trim();
      const value = parseInt(rawPrice, 10);
      if (!Number.isNaN(value)) {
        prices.push(value);
      }
    }
  }

  expect(prices.length).toBeGreaterThan(1);

  // Ascending: each price <= next price (Low to High)
  for (let i = 0; i < prices.length - 1; i++) {
    expect(
      prices[i],
      `Price at index ${i} (${prices[i]}) should be <= index ${i + 1} (${prices[i + 1]})`
    ).toBeLessThanOrEqual(prices[i + 1]);
  }
});
