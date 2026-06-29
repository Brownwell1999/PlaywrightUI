const { test, expect } = require('@playwright/test');
const { Loginpage } = require('./pageObjects/Loginpage'); // This is a module that is used to import the Loginpage class so it can be used in the test file
// Json -> String _> Js Object -> use in the test
const testdata = JSON.parse(JSON.stringify(require('../utils/loginTestdata.json'))); // This is a module that is used to import the testdata object so it can be used in the test file
test.only('browser Playwright Test to create a page object classes', async ({ page }) => {
    
    const products = page.locator('.card-body');
    const loginpage = new Loginpage(page);      // This is a object of the Loginpage class and we are passing the page object to the constructor
    await loginpage.goto();
    await loginpage.validlogin(testdata.useremail, testdata.userpassword);

    await expect(page.locator('.card-body b').first()).toBeVisible();
    const titles = await page.locator('.card-body b').allTextContents();
    console.log(titles);

    for (let i = 0; i < titles.length; i++) {
        const title = await products.nth(i).locator('b').textContent();
        if (title?.trim().toLowerCase() === testdata.productName.toLowerCase()) {
            await products.nth(i).locator('button:has-text("Add To Cart")').click();
            break;
        }
    }

    await page.locator("[routerlink*='cart']").click();
    await expect(page.locator("h3:has-text('zara coat 3')")).toBeVisible();
});