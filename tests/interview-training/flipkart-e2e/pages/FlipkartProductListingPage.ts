import { Page, Locator } from '@playwright/test';

export class FlipkartProductListingPage {
  readonly page: Page;
  readonly filtersSection: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.filtersSection = page.locator('div').filter({ hasText: 'Filters' }).first();
    this.productCards = page.locator('a[href*="/p/"]');
  }

  async applyBrandFilter(brand: string): Promise<void> {
    const brandCheckbox = this.page
      .locator('div')
      .filter({ hasText: /^BRAND$/ })
      .locator('..')
      .getByText(brand, { exact: true })
      .first();

    await brandCheckbox.click();
    await this.page.waitForLoadState('networkidle');
  }

  async applyPriceRange(min: number, max: number): Promise<void> {
    const minInput = this.page.getByRole('textbox', { name: 'Min' });
    const maxInput = this.page.getByRole('textbox', { name: 'Max' });

    if (await minInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await minInput.fill(String(min));
      await maxInput.fill(String(max));
      await this.page.getByRole('button', { name: 'Go' }).click();
      await this.page.waitForLoadState('networkidle');
      return;
    }

    // Fallback: predefined price bucket on Flipkart sidebar
    const priceBucket = this.page.getByText(`₹${min.toLocaleString('en-IN')}`, { exact: false }).first();
    await priceBucket.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectFirstProduct(): Promise<void> {
    const firstProduct = this.productCards.first();
    await firstProduct.waitFor({ state: 'visible' });
    await firstProduct.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
