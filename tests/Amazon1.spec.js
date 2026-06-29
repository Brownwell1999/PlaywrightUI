/**
 * Feature: E-Commerce End-to-End Purchase Flow

    Given The user navigates to the e-commerce website Amazon
    When The user searches for the product Nothing Phone 4a
    And The user applies the brand filter Nothing
    And The user filters by Storage Capacity 128 GB
    And The user filters by RAM Size 8 GB
    And The user selects the first product from the filtered results
    And The user clicks on the Add to Cart button
    Then The cart count should be updated to "1"
    And The cart page should display the correct product Nothing Phone 4a and brand Nothing
 * INTERVIEW FILE: Amazon E2E Purchase Flow
 * ----------------------------------------
 * In a live SDET interview you would use TypeScript (.spec.ts):
 *   import { test, expect } from '@playwright/test';
 *
 * Here we use the same logic in JS so it runs in this project as-is.
 * Pattern: BDD step → locator (XPath) → action → assertion — all together.
 */ 

const { test, expect } = require('@playwright/test');

test('E-Commerce E2E: Search, filter, add to cart, verify cart', async ({ page }) => {
  // Test data — keep at top; easy to explain "parameterized test data"
  const productName = 'Nothing Phone 4a';
  const brand = 'Nothing';
  const storage = '128 GB';
  const ram = '8 GB';
  // Amazon groups 8 GB RAM under a range label — real-world locator adjustment
  const ramFilterLabel = '8 to 9.9 GB';

  // ─── GIVEN: User navigates to Amazon ───────────────────────────────────────
  await page.goto('https://www.amazon.in/', { waitUntil: 'domcontentloaded' });

  // Optional popup: delivery location / continue shopping (Amazon is dynamic)
  const dismissPopup = page.locator("//input[@data-action-type='DISMISS']");
  try {
    await dismissPopup.click({ timeout: 4000 });
  } catch {
    // Popup not present — safe to continue
  }

  // ─── WHEN: User searches for the product ───────────────────────────────────
  const searchBox = page.locator("//input[@id='twotabsearchtextbox']");
  await searchBox.fill(productName);

  const searchButton = page.locator("//input[@id='nav-search-submit-button']");
  await searchButton.click();

  // Wait for search results page to load
  await page.waitForSelector("//div[@data-component-type='s-search-result']", { timeout: 15000 });

  // ─── WHEN: Apply brand filter "Nothing" ────────────────────────────────────
  // Use .first() — Amazon renders multiple nested spans; strict mode needs one element
  const brandFilter = page.locator(
    "//div[@id='brandsRefinements']//span[@class='a-size-base a-color-base' and normalize-space()='" +
      brand +
      "']"
  ).first();
  await brandFilter.scrollIntoViewIfNeeded();
  await brandFilter.click();
  // Avoid networkidle on Amazon — background calls never stop; wait for results instead
  await page.locator("//div[@data-component-type='s-search-result']").first().waitFor({ state: 'visible' });

  // ─── WHEN: Filter by Storage Capacity 128 GB ───────────────────────────────
  // Amazon filter links expose aria-label — stable XPath for interview
  const storageFilter = page.locator(
    "//a[contains(@aria-label,'Apply the filter " + storage + " to narrow results')]"
  );
  await storageFilter.scrollIntoViewIfNeeded();
  await storageFilter.click();
  await page.locator("//div[@data-component-type='s-search-result']").first().waitFor({ state: 'visible' });

  // ─── WHEN: Filter by RAM Size 8 GB ─────────────────────────────────────────
  // Amazon shows RAM as a range "8 to 9.9 GB" — scroll sidebar; link is below fold
  const ramFilter = page.locator(
    "//a[contains(@aria-label,'Apply the filter " + ramFilterLabel + " to narrow results')]"
  ).first();
  await ramFilter.scrollIntoViewIfNeeded();
  await ramFilter.click();
  await page.locator("//div[@data-component-type='s-search-result']").first().waitFor({ state: 'visible' }); //wait for the results to load

  // ─── WHEN: Select first product from filtered results ──────────────────────
  // Amazon wraps title: <a><h2>Product Name</h2></a> — not h2 > a
  const firstProductLink = page.locator(
    "(//div[@data-component-type='s-search-result']//h2/ancestor::a)[1]"
  );
  await firstProductLink.scrollIntoViewIfNeeded();
  await expect(firstProductLink).toBeVisible({ timeout: 10000 });
  
  // Capture product title from listing (for cart assertion later)
  const listingTitle = (await firstProductLink.innerText()).trim();

  //await firstProductLink.click();

  // Amazon often opens product in a NEW TAB — handle popup (common interview question)
  //const productPage = await page.context().waitForEvent('page'); // this is the new tab 
  //await productPage.waitForLoadState('domcontentloaded');

  const [productPage] = await Promise.all([
    page.context().waitForEvent('page'),  // start listening FIRST - this is the new tab - listen for the new tab to open
    firstProductLink.click(),              // then click - this is the product link - click on the product link
  ]);
  await productPage.waitForLoadState('domcontentloaded');

  // Product detail page — confirm we landed on correct product
  const productTitle = productPage.locator("//span[@id='productTitle']");
  await expect(productTitle).toBeVisible({ timeout: 10000 });
  await expect(productTitle).toContainText(productName);
  await expect(productTitle).toContainText(brand);
  await expect(productTitle).toContainText('128GB');
  await expect(productTitle).toContainText('8GB');

  // ─── WHEN: Click Add to Cart ───────────────────────────────────────────────
  // Scope to main buy box — Amazon duplicates add-to-cart for exchange/buyback widgets
  const addToCartBtn = productPage.locator(
    "//input[@id='add-to-cart-button' and not(ancestor::*[@id='buybackAddToCart'])]"
  ).first();
  await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
  await addToCartBtn.click();

  // Side panel confirmation — cart count lives in header of product tab
  const cartCountBadge = productPage.locator("//span[@id='nav-cart-count']");
  await expect(cartCountBadge).toHaveText('1', { timeout: 15000 });

  // ─── THEN: Cart count should be "1" ────────────────────────────────────────
  await expect(cartCountBadge).toHaveText('1');

  // ─── THEN: Cart page shows correct product and brand ───────────────────────
  const cartIcon = productPage.locator("//a[@id='nav-cart']");
  await cartIcon.click();
  await productPage.waitForLoadState('domcontentloaded');

  const cartProductName = productPage.locator(
    "//div[contains(@class,'sc-list-item-content')]//span[contains(@class,'a-truncate-full')]"
  ).first();
  await expect(cartProductName).toBeVisible({ timeout: 10000 });

  await expect(cartProductName).toContainText(productName);
  await expect(cartProductName).toContainText(brand);

  if (listingTitle) {
    const cartText = await cartProductName.innerText();
    expect(cartText.toLowerCase()).toContain('nothing');
  }
});
