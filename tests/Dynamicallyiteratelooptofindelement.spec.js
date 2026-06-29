const { test, expect } = require('@playwright/test');

test.only('browser Playwright Test', async ({ page }) => {
    const email = 'deepak5550nigam@gmail.com';
    const productName = 'zara coat 3';
    const products = page.locator('.card-body');
    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').type('NOotherway12#@');
    await page.locator("[value='Login']").click();

    await expect(page.locator('.card-body b').first()).toBeVisible();
    const titles = await page.locator('.card-body b').allTextContents();
    console.log(titles);

    for (let i = 0; i < titles.length; i++) {
        const title = await products.nth(i).locator('b').textContent();
        if (title?.trim().toLowerCase() === productName.toLowerCase()) {
            await products.nth(i).locator('button:has-text("Add To Cart")').click();
            break;
        }
    }

    await page.locator("[routerlink*='cart']").click();
    await expect(page.locator("h3:has-text('zara coat 3')")).toBeVisible();
});