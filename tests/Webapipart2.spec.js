//  Login UI -> JSON
//  test browser  -> .json, cart-order, order-details ,  order-history

const { test, expect } = require('@playwright/test');
let webContext;

test.beforeAll(async({browser})=>
    {   
        const context = await browser.newContext();
        const page = await context.newPage();

        const email = 'deepak5550nigam@gmail.com';

        await page.goto('https://rahulshettyacademy.com/client');
        await page.locator('#userEmail').fill(email);
        await page.locator('#userPassword').type('NOotherway12#@');
        await page.locator("[value='Login']").click();
        await page.waitForSelector('.card-body', { timeout: 30000 });
        await context.storageState({ path: 'state.json' });
        webContext = await browser.newContext({ storageState: 'state.json' });
    
    }
    
    
    )

test.only('Injecting Session Storage in another test', async () => {

    const productName = 'zara coat 3';
    const page = await webContext.newPage();
    await page.goto('https://rahulshettyacademy.com/client');
    
    const products = page.locator('.card-body');
    await page.waitForSelector('.card-body b', { timeout: 20000 });
    await expect(page.locator('.card-body b').first()).toBeVisible({ timeout: 15000 });
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