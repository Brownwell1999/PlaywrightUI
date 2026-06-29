const { test, expect } = require('@playwright/test');

test('browser Playwright client', async ({ page }) => {
   const email = "deepak5550nigam@gmail.com";
   const productName = 'zara coat 3';
   const products = page.locator(".card-body");

   await page.goto("https://rahulshettyacademy.com/client");
   await page.locator("#userEmail").fill(email);
   await page.locator("#userPassword").type("NOotherway12#@");
   await page.locator("[value='Login']").click();
   //await page.waitForLoadState('networkidle');
   await page.locator(".card-body b").first().waitFor();
   const titles = await page.locator(".card-body b").allTextContents();
   console.log(titles);
});

test('browser Playwright Test', async ({ page }) => {
    const email = 'deepak5550nigam@gmail.com';
    const productName = 'zara coat 3';
    const products = page.locator('.card-body');

    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').type('NOotherway12#@');
    await page.locator("[value='Login']").click();

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

    await page.locator('text=Checkout').click();
    await page.locator("[placeholder*='Country']").type('ind', { delay: 150 });
    const options = await page.locator("[class*='results']");
    await options.waitFor();
    const countryOptionCount = await options.locator('button').count();

    for (let i = 0; i < countryOptionCount; i++) {
        const text = await options.locator('button').nth(i).textContent();
        if (text?.trim() === 'India') {
            await options.locator('button').nth(i).click();
            break;
        }
    }

    await expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    await page.locator('.action__submit').click();

    await expect(page.locator('.hero-primary')).toContainText('Thankyou for the order');
    const orderId = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
   console.log(orderId);

   await page.locator("button[routerlink*='myorders']").click();
   await page.locator("tbody").waitFor();
   const rows = await page.locator("tbody tr");
 
 
   for (let i = 0; i < await rows.count(); ++i) {
      const rowOrderId = await rows.nth(i).locator("th").textContent();
      if (orderId.includes(rowOrderId)) {
         await rows.nth(i).locator("button").first().click();
         break;
      }
   }
   const orderIdDetails = await page.locator(".col-text").textContent();
   expect(orderId.includes(orderIdDetails)).toBeTruthy();

   //await expect(page.locator("div .email-title")).toHaveText(" order summary ");
   //await expect(page.locator(""))


});

test('Locators Playwright Test', async ({ page }) => {

   await page.goto("https://rahulshettyacademy.com/angularpractice/");
   await page.getByLabel('Check me out if you Love IceCreams!').click();
   await page.getByLabel('Employed').check();
   await page.getByLabel('Gender').selectOption("Female");
   await page.getByPlaceholder('Password').fill('12345678');
   await page.getByRole('button', {name: 'Submit'}).click();
   await page.getByText(' The Form has been submitted successfully!.').isVisible();
   await page.getByRole('link', {name: 'Shop'} ).click();
   await page.locator("app-card").filter({hasText: "Nokia Edge"}).getByRole('button', {name: 'Add'}).click();


   });

test('Calendar Playwright Test', async ({ page }) => {

   const monthNumber  = "7";
   const date = "23";
   const year = "2024";

   const expectedInput = [monthNumber, date, year];

   await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
   await page.locator(".react-date-picker").click();
   await page.locator("react-calendar__navigation__label").click();
   await page.locator("react-calendar__navigation__label").click();
   await page.getByText(year).click();
   await page.locator(".react-calendar__year-view__months__month").nth(Number(monthNumber)-1).click();
   await page.locator("//abbr [text()= ' "+date+" ']").click();

   const input = await page.locator(".react-date-picker__inputGroup__input");

   for (let i = 0; i < expectedInput.length; i++) 
      {
      const value =await input.nth(i).inputValue();
      expect(value).toEqual(expectedInput[i]);
      }

   });

   test('Hidden Textbox Playwright Test', async ({ page }) => {
      await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
      await expect(page.locator("#displayed-text")).toBeVisible;
      await page.locator("#hide-textbox").click();
      await expect(page.locator("#displayed-text")).toBeHidden();

      });

test('Java Pop-up & Hover Playwright Test', async ({ page }) => {
      await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
      await page.pause();
      page.on("dialog", dialog => dialog.accept());
      await page.locator("#confirmbtn").click();
      // Hover
      await page.locator("#mousehover").hover();


      });

test.only('Frames Playwright Test', async ({ page }) => {
      await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
      const frame = page.frameLocator("courses-iframe");
      await frame.locator("li a[href*='lifetime-access']").waitFor({ state: 'visible' });
      await frame.locator("li a[href*='lifetime-access']:visible").click();
      const text = await frame.locator(".text h2").textContent();
      console.log(text.split(" ")[1]);

      


      });