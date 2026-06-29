const { test, expect } = require ('@playwright/test');

test('browser Playwright Test', async ({ page }) => 
    {
        const username = page.locator('#username');
        const password = page.locator('#password');
        const signInBtn = page.locator('#signInBtn');
        const pagetitles = page.locator(".card-body a");


        await page.goto('https://rahulshettyacademy.com/loginpagePractise/'); // This is like typing the URL in the address bar and hitting enter
        console.log(await page.title());
        expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");
        
        await username.type('rahulshettyacademy');
        await password.fill('Learning@830$3mK2');
        await signInBtn.click();
        console.log(await pagetitles.first().textContent()); // change
        //console.log(await pagetitles.nth(2).textContent());

        console.log(await pagetitles.allTextContents());
    });

test('Navigate to Notion', async ({ page }) => 
    {
        //const context = await browser.newContext(); // This is like opening a new browser window
        //const page = await context.newPage(); // This is like opening a new tab in the browser
        await page.goto('https://www.notion.com/'); // This is like typing the URL in the address bar and hitting enter
        console.log(await page.title());
        await expect(page).toHaveTitle("The AI workspace that works for you. | Notion")
    });

test('Static dropdown and radio button and check box', async ({ page }) => 
    {
        const username = page.locator('#username');
        const password = page.locator('#password');
        const signInBtn = page.locator('#signInBtn');
        const pagetitles = page.locator(".card-body a");
        const blinklink = page.locator('[href*="documents-request"]');


        await page.goto('https://rahulshettyacademy.com/loginpagePractise/'); // This is like typing the URL in the address bar and hitting enter
        console.log(await page.title());
        expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");
        
        await username.type('rahulshettyacademy');
        await password.fill('Learning@830$3mK2');
        const dropdown = page.locator('select.form-control');
        await dropdown.selectOption('Teacher'); // This is like selecting the option from the dropdown by value, if we want to select the option by text, we can use the selectOptionText method.
        await page.locator('.checkmark').last().click();
        await page.locator('#terms').click();
        await signInBtn.click();
        await expect(page.locator('.checkmark').last()).toBeChecked();
        await expect(page.locator('#terms')).toBeChecked();
        await page.locator('#terms').uncheck();
        await expect(page.locator('#terms')).not.toBeChecked() ;
        await expect(blinklink).toHaveAttribute('class', 'blinkingText');
        
    }); 

test.only('Handle child Windows', async ({ browser }) => 
    {
        const context = await browser.newContext(); // This is like opening a new browser window
        const page = await context.newPage(); // This is like opening a new tab in the browser 
       

        await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
        const blinklink = page.locator('[href*="documents-request"]');
        const username = page.locator('#username');

        const [newPage] = await Promise.all([

        context.waitForEvent('page'),   // Listening - Wait for the new page to open and store the reference of the new page in the variable [newPage] array 
        blinklink.click(),

        ])

         const text = await newPage.locator(".red").textContent();
         const arraytext = text.split("@");
         const domain =  arraytext[1].split(" ")[0];
         //console.log(domain);
         await page.locator('#username').type(domain);
         await page.pause();
         console.log(await page.locator('#username').inputValue());

 
    });


