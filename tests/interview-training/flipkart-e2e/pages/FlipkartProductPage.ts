import { Page, Locator } from '@playwright/test';

export class FlipkartProductPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly productTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.productTitle = page.locator('span.B_NuCI, h1, span[class*="VU-ZEz"]').first();
  }

  async addProductToCart(): Promise<void> {
    await this.addToCartButton.waitFor({ state: 'visible' });
    await this.addToCartButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getProductTitle(): Promise<string> {
    return (await this.productTitle.textContent())?.trim() ?? '';
  }
}
