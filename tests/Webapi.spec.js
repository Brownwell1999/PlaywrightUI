const { test, expect, request } = require('@playwright/test');

const loginPayload = {"userEmail":"deepak5550nigam@gmail.com","userPassword":"NOotherway12#@"};

let token;
test.beforeAll( async() =>
{
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
    {
        data : loginPayload,
    })

    expect(loginResponse.ok()).toBeTruthy();
    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;
    console.log(token);
});

test('Injecting Token in another test via API', async ({ page }) => {

    await page.addInitScript((value) => {
        window.localStorage.setItem('token', value);
    }, token);

    const productName = 'zara coat 3';
    const products = page.locator('.card-body');

    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator('.card-body b').first().waitFor();
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



