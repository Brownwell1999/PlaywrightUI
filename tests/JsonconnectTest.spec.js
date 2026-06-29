const path = require('path');

const { test, expect } = require('@playwright/test');

const { Loginpage } = require('./pageObjects/Loginpage');

const jsonPath = path.join(__dirname, '../utils/loginTestdata.json');

const testdata = JSON.parse(JSON.stringify(require('../utils/loginTestdata.json')));

test('connect JSON test data with UI test', async ({ page }) => {

    const data = testdata[0];

    console.log('JSON file:', jsonPath);

    console.log('Email from JSON:', data.userEmail);
I
    console.log('Product from JSON:', data.productName);

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

    console.log('RESULT: PASS');

});
