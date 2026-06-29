/**
 * INTERVIEW: ONE-FILE E2E with EXCEL test data (same scenario as JSON version)
 * Excel file (real project): utils/loginTestdata.xlsx
 * Sheet "LoginData" -> row1 headers, row2+ data rows
 */

const path = require('path');
const ExcelJS = require('exceljs');
const { test, expect } = require('@playwright/test');

const excelPath = path.join(__dirname, '../utils/loginTestdata.xlsx');

// ----- READ EXCEL -> JavaScript object (like JSON require) -----
async function getTestDataFromExcel(filePath, rowNumber = 2) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.getWorksheet('LoginData');

    const headers = sheet.getRow(1).values.slice(1); // skip index 0 (exceljs quirk)
    const row = sheet.getRow(rowNumber).values.slice(1);

    const testdata = {};
    headers.forEach((header, index) => {
        testdata[header] = row[index];
    });
    return testdata;
}

// ----- PAGE OBJECT -----
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

// ----- E2E TEST: Excel -> testdata -> POM -> assertions -----
test('E2E: login with Excel data, add product, verify cart', async ({ page }) => {
    const testdata = await getTestDataFromExcel(excelPath);

    const products = page.locator('.card-body');
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.validLogin(testdata.userEmail, testdata.userPassword);

    await expect(page.locator('.card-body b').first()).toBeVisible();
    const titles = await page.locator('.card-body b').allTextContents();

    for (let i = 0; i < titles.length; i++) {
        const title = await products.nth(i).locator('b').textContent();
        if (title?.trim().toLowerCase() === String(testdata.productName).toLowerCase()) {
            await products.nth(i).locator('button:has-text("Add To Cart")').click();
            break;
        }
    }

    await page.locator("[routerlink*='cart']").click();
    await expect(page.locator(`h3:has-text('${testdata.productName}')`)).toBeVisible();
});
