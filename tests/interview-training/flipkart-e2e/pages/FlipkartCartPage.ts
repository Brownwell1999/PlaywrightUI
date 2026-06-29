import { Page, Locator } from '@playwright/test';

export class FlipkartCartPage {
  readonly page: Page;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('div[class*="e1paam5a"], a[href*="/p/"]');
  }

  async getCartProductNames(): Promise<string[]> {
    const titles = this.page.locator('a[href*="/p/"] span, div[class*="e1paam5a"]');
    const count = await titles.count();
    const names: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await titles.nth(i).textContent();
      if (text?.trim()) {
        names.push(text.trim());
      }
    }

    return names;
  }

  async isProductInCart(productKeyword: string, brand: string): Promise<boolean> {
    const cartText = (await this.page.locator('body').textContent()) ?? '';
    const normalized = cartText.toLowerCase();
    return (
      normalized.includes(productKeyword.toLowerCase()) &&
      normalized.includes(brand.toLowerCase())
    );
  }
}
