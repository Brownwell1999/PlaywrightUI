const { test, expect } = require('@playwright/test');

test('test', async ({ page }) => {
  await page.goto('https://www.amazon.in/');
  await page.getByRole('searchbox', { name: 'Search Amazon.in' }).fill('Nothing 4a');
  await page.getByRole('button', { name: 'Go', exact: true }).click();
  await page.goto('https://www.amazon.in/s?k=Nothing+4a&crid=39JAXPT12Y5IU&sprefix=nothing+4a%2Caps%2C716&ref=nb_sb_noss_1');
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Nothing Phone 4a (8GB 256GB White)' }).click();
  const page1 = await page1Promise;
  const productTitle = page1.locator("//span[@id = 'productTitle']").textContent();
  const productPrice = page1.locator(`//span[normalize-space()='36,899']`)
  await page1.getByRole('button', { name: 'Add to cart' }).click();
  await page1.getByRole('link', { name: 'item in cart' }).click();
  await expect(page1.getByLabel('Shopping Cart', { exact: true }).locator('h3')).toContainText('Nothing Phone 4a (8GB 256GB White)');
  await expect(page1.getByLabel('Shopping Cart', { exact: true })).toContainText('₹36,899.00');
});
