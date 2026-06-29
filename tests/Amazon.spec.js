const { test, expect } = require('@playwright/test');
test('Amazon Playwright Test', async ({ page }) => {

    // Home page locators
    const searchBox = page.locator("//input[@id='twotabsearchtextbox']");
    const productName = "Nothing 4a";
    const searchButton = page.locator("//input[@id='nav-search-submit-button']");
    const searchResult = page.locator("//div[contains(@data-component-type,'s-search-result')]");
    const productLink = searchResult.locator("//span[contains(normalize-space(), 'Nothing Phone 4a')]").first();

    await page.goto("https://www.amazon.in/");
    await searchBox.fill(productName);

    await Promise.all([
        page.waitForNavigation(),
        searchButton.click()
    ]);

    await expect(searchResult.first()).toBeVisible({ timeout: 15000 });
    await expect(productLink).toBeVisible({ timeout: 15000 });

    await Promise.all([
        page.waitForNavigation(),
        productLink.click()
    ]);

    await page.waitForLoadState();

    // Product page locators
    const productTitle = page.locator(`#productTitle`);
    const productPrice = page.locator("#priceblock_ourprice, #priceblock_dealprice");
    const addToCartButton = page.locator("#add-to-cart-button");
    const cartButton = page.locator("//a[@id='nav-cart']");
    const cartTitleText = page.locator("//h2[normalize-space()='Shopping Cart']");
    const cartProductTitle = page.locator("//span[contains(@class,'a-truncate-cut')]").first();
    const cartProductPrice = page.locator("//span[contains(@class,'sc-price')]").first();

    await addToCartButton.click();
    await cartButton.click();

    const cartTitleContent = await cartTitleText.textContent();
    await expect(cartTitleContent).toContain('Shopping Cart');

    const productTitleContent = await productTitle.textContent();
    const productPriceContent = await productPrice.textContent();
    const cartProductTitleContent = await cartProductTitle.textContent();
    const cartProductPriceContent = await cartProductPrice.textContent();

    expect(cartProductTitleContent).toBe(productTitleContent.trim());
    expect(cartProductPriceContent).toBe(productPriceContent.trim());     








});