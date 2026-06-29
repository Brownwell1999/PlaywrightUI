/**
 * INTERVIEW: ONE-FILE E2E (JSON data + Page Object + Test)
 * In real projects you split: utils/loginTestdata.json | pageObjects/Loginpage.js | *.spec.js
 * Here everything is in one tab so you can type/explain quickly.
 */

const { test, expect } = require('@playwright/test');

// ========== STEP 1: TEST DATA (JSON) ==========
// Real project: const testdata = require('../utils/loginTestdata.json');
// JSON on disk looks like:
// { "userEmail": "...", "userPassword": "...", "productName": "zara coat 3" }
const testdata = {
    userEmail: 'deepak5550nigam@gmail.com',
    userPassword: 'NOotherway12#@',
    productName: 'zara coat 3',
};

// ========== STEP 2: PAGE OBJECT (reusable UI layer) ==========
class LoginPage {
    constructor(page) {
        this.page = page;
        this.userEmail = page.locator('#userEmail');
        this.userPassword = page.locator('#userPassword');
        this.signInBtn = page.locator("[value='Login']");
    }

    async goto() {
        await this.page.goto('https://rahulshettyacademy.com/client');
    }

    async validLogin(email, password) {
        await this.userEmail.fill(email);
        await this.userPassword.fill(password);
        await this.signInBtn.click();
    }
}

// ========== STEP 3: E2E TEST (connect JSON -> POM -> assertions) ==========
test('E2E: login with JSON data, add product, verify cart', async ({ page }) => {
    const products = page.locator('.card-body');
    const loginPage = new LoginPage(page);

    // Use JSON fields (not hardcoded strings in test)
    await loginPage.goto();
    await loginPage.validLogin(testdata.userEmail, testdata.userPassword);

    await expect(page.locator('.card-body b').first()).toBeVisible();
    const titles = await page.locator('.card-body b').allTextContents();

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
