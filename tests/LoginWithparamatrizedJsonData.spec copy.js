const { test, expect } = require('@playwright/test');
const { Loginpage } = require('./pageObjects/Loginpage');

// JSON file -> Node module -> JavaScript object -> used in test & page object
const testdata = JSON.parse(JSON.stringify(require('../utils/loginTestdata.json')));

for (const data of testdata) { // This is a loop that is used to iterate over the testdata array and the data is passed as a parameter to the test case

test(`login and add product using JSON test data ${data.productName}`, async ({ page }) => { // This is a test case that is used to login and add a product using JSON test data and the product name is passed as a parameter to the test case
    const products = page.locator('.card-body');
    const loginPage = new Loginpage(page);

    await loginPage.goto();
    await loginPage.validLogin(data.userEmail, data.userPassword);

    await expect(page.locator('.card-body b').first()).toBeVisible();
    const titles = await page.locator('.card-body b').allTextContents();
    console.log('Products on page:', titles);

    for (let i = 0; i < titles.length; i++) {
        const title = await products.nth(i).locator('b').textContent();
        if (title?.trim().toLowerCase() === data.productName.toLowerCase()) {
            await products.nth(i).locator('button:has-text("Add To Cart")').click();
            break;
        }
    }

    await page.locator("[routerlink*='cart']").click();
    await expect(page.locator(`h3:has-text('${data.productName}')`)).toBeVisible();
});
}