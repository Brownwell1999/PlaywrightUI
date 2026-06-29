import type { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly userEmail: Locator;
  readonly userPassword: Locator;
  readonly signInBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userEmail = page.locator('#userEmail');
    this.userPassword = page.locator('#userPassword');
    this.signInBtn = page.locator("[value='Login']");
  }

  async goto(): Promise<void> {
    await this.page.goto('https://rahulshettyacademy.com/client');
  }

  async validLogin(email: string, password: string): Promise<void> {
    await this.userEmail.fill(email);
    await this.userPassword.fill(password);
    await this.signInBtn.click();
  }
}
