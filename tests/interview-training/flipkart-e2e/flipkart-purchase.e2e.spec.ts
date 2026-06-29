/**
 * INTERVIEW SCENARIO 1: Complex E-Commerce E2E Flow (Flipkart)
 *
 * What interviewer checks:
 * 1. BDD thinking (Given/When/Then mapping)
 * 2. Page Object Model separation
 * 3. Dynamic UI handling (popups, filters, async loads)
 * 4. Data-driven testing
 * 5. Assertions at business level (cart count + product details)
 */

import { test, expect } from '@playwright/test';
import testData from './testdata/flipkartData.json';
import { FlipkartHomePage } from './pages/FlipkartHomePage';
import { FlipkartProductListingPage } from './pages/FlipkartProductListingPage';
import { FlipkartProductPage } from './pages/FlipkartProductPage';
import { FlipkartCartPage } from './pages/FlipkartCartPage';

type FlipkartTestData = {
  platform: string;
  product: string;
  brand: string;
  priceMin: number;
  priceMax: number;
};

for (const data of testData as FlipkartTestData[]) {
  test.describe(`E-Commerce E2E on ${data.platform}`, () => {
    test(`Search, filter, add to cart: ${data.product}`, async ({ page }) => {
      const homePage = new FlipkartHomePage(page);
      const listingPage = new FlipkartProductListingPage(page);
      const productPage = new FlipkartProductPage(page);
      const cartPage = new FlipkartCartPage(page);

      // Given: user navigates to e-commerce website
      await homePage.navigate();

      // When: user searches for product
      await homePage.searchProduct(data.product);

      // And: user applies brand + price filters
      await listingPage.applyBrandFilter(data.brand);
      await listingPage.applyPriceRange(data.priceMin, data.priceMax);

      // And: user selects first filtered product
      await listingPage.selectFirstProduct();

      // And: user adds product to cart
      await productPage.addProductToCart();

      // Then: cart count should be updated
      const cartCount = await homePage.getCartCount();
      expect(cartCount).toBe('1');

      // And: cart page shows correct product + brand
      await homePage.openCart();
      const isValidCartItem = await cartPage.isProductInCart(data.product, data.brand);
      expect(isValidCartItem).toBeTruthy();
    });
  });
}
