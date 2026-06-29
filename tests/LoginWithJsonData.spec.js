const { test, expect } = require('@playwright/test');
const { Loginpage } = require('./pageObjects/Loginpage');

// JSON file -> Node module -> JavaScript object -> used in test & page object
const testdata = JSON.parse(JSON.stringify(require('../utils/loginTestdata.json')));

test('login and add product using JSON test data', async ({ page }) => {
    const products = page.locator('.card-body');
    const loginPage = new Loginpage(page);

    await loginPage.goto();
    await loginPage.validLogin(testdata.userEmail, testdata.userPassword);

    await expect(page.locator('.card-body b').first()).toBeVisible();
    const titles = await page.locator('.card-body b').allTextContents();
    console.log('Products on page:', titles);

    for (let i = 0; i < titles.length; i++) {
        const title = await products.nth(i).locator('b').textContent();
        if (title?.trim().toLowerCase() === testdata.productName.toLowerCase()) {
            await products.nth(i).locator('button:has-text("Add To Cart")').click();
            break;
        }
    }

    await page.locator("[routerlink*='cart']").click();
    await expect(page.locator(`h3:has-text('${testdata.productName}')`)).toBeVisible();
});
