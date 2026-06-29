import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { LoginPage } from '../pageObjects/LoginPage';
import { JsonDataConnection } from '../utils/JsonDataConnection';
import { ExcelDataConnection } from '../utils/ExcelDataConnection';
import { world } from './world';

const { Given, When, Then } = createBdd();

Given('login test data is loaded from JSON index {int}', async ({}, index: number) => {
  world.loginData = JsonDataConnection.getLoginDataByIndex(index);
  world.dataSource = `JSON (${JsonDataConnection.getLoginDataFilePath()})`;
});

Given('login test data is loaded from Excel row {int}', async ({}, rowNumber: number) => {
  world.loginData = await ExcelDataConnection.getRowByNumber(rowNumber);
  world.dataSource = `Excel (${ExcelDataConnection.getExcelFilePath()}, row ${rowNumber})`;
});

When('I open the client application', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
});

When('I login with loaded credentials', async ({ page }) => {
  if (!world.loginData) {
    throw new Error('No login data loaded. Run a Given step first.');
  }

  const loginPage = new LoginPage(page);
  await loginPage.validLogin(world.loginData.userEmail, world.loginData.userPassword);
});

When('I add the configured product to cart', async ({ page }) => {
  if (!world.loginData) {
    throw new Error('No login data loaded. Run a Given step first.');
  }

  const products = page.locator('.card-body');
  await expect(page.locator('.card-body b').first()).toBeVisible();

  const count = await products.count();
  for (let i = 0; i < count; i++) {
    const title = await products.nth(i).locator('b').textContent();
    if (title?.trim().toLowerCase() === world.loginData.productName.toLowerCase()) {
      await products.nth(i).locator('button:has-text("Add To Cart")').click();
      return;
    }
  }

  throw new Error(`Product not found: ${world.loginData.productName}`);
});

Then('the configured product should be visible in cart', async ({ page }) => {
  if (!world.loginData) {
    throw new Error('No login data loaded. Run a Given step first.');
  }

  await page.locator("[routerlink*='cart']").click();
  await expect(page.locator(`h3:has-text('${world.loginData.productName}')`)).toBeVisible();
});
