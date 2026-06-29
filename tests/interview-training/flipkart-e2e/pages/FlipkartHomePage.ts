import { Page, Locator } from '@playwright/test';

export class FlipkartHomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly cartIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search for products, brands and more');
    this.cartIcon = page.locator('a[href*="viewcart"]');
  }

  async navigate(): Promise<void> {
    await this.page.goto('https://www.flipkart.com', { waitUntil: 'domcontentloaded' });
    await this.dismissPopups();
  }

  /**
   * Flipkart shows login + location popups on first visit.
   * Interview tip: always isolate popup handling in one reusable method.
   */
  async dismissPopups(): Promise<void> {
    const closeLogin = this.page.getByRole('button', { name: '✕' });
    if (await closeLogin.isVisible({ timeout: 3000 }).catch(() => false)) {
      await closeLogin.click();
    }
  }

  async searchProduct(productName: string): Promise<void> {
    await this.searchInput.fill(productName);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  async getCartCount(): Promise<string> {
    const cartBadge = this.cartIcon.locator('span');
    if (await cartBadge.isVisible({ timeout: 2000 }).catch(() => false)) {
      return (await cartBadge.textContent())?.trim() ?? '0';
    }
    return '0';
  }

  async openCart(): Promise<void> {
    await this.cartIcon.click();
    await this.page.waitForLoadState('networkidle');
  }
}
