/**
 * Feature: NSE India Market Dashboard Interactivity
 *
 * Flow: Ctrl+click → new tab → validate → bringToFront(parent) → next section
 * Run: npx playwright test tests/NSE1.spec.js --headed
 */

const { test, expect } = require('@playwright/test');

test('NSE Market Dashboard - verify Market, IPO and Currency portals in new tab', async ({
  page,
  context,
}) => {
  test.setTimeout(180000);

  // ─── GIVEN: User navigates to NSE India homepage ────────────────────────────
  await page.goto('https://www.nseindia.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });

  try {
    await page.locator("//button[contains(.,'Accept') or contains(.,'OK')]").first().click({
      timeout: 5000,
    });
  } catch {
    // Optional consent banner
  }

  await page.locator("//div[contains(normalize-space(),'Market Statistics')]").first().waitFor({
    state: 'visible',
    timeout: 30000,
  });

  // ─── 1) Market Snapshot → /market-data ─────────────────────────────────────
  await page.bringToFront();

  const marketSnapshotLink = page
    .locator("//div[contains(normalize-space(),'Market Statistics')]//a[contains(@href,'/market-data')]")
    .first();

  await marketSnapshotLink.scrollIntoViewIfNeeded();
  await expect(marketSnapshotLink).toBeVisible({ timeout: 20000 });

  const [marketTab] = await Promise.all([
    context.waitForEvent('page', { timeout: 20000 }),
    marketSnapshotLink.click({ modifiers: ['Control'] }),
  ]);

  await marketTab.waitForLoadState('domcontentloaded');
  await expect(marketTab).toHaveURL(/market-data/, { timeout: 30000 });
  await expect(marketTab.locator('body')).toBeVisible();

  await page.bringToFront();
  await expect(page).toHaveURL(/nseindia\.com/);
  await marketTab.close();

  // ─── 2) IPO Tracker → /ipo ─────────────────────────────────────────────────
  await page.bringToFront();

  const ipoTrackerLink = page
    .locator("//div[normalize-space()='Quick Links']/ancestor::div[1]//a[normalize-space()='IPO']")
    .first();

  await ipoTrackerLink.scrollIntoViewIfNeeded();
  await expect(ipoTrackerLink).toBeVisible({ timeout: 20000 });

  const [ipoTab] = await Promise.all([
    context.waitForEvent('page', { timeout: 20000 }),
    ipoTrackerLink.click({ modifiers: ['Control'] }),
  ]);

  await ipoTab.waitForLoadState('domcontentloaded');
  await expect(ipoTab).toHaveURL(/ipo/, { timeout: 30000 });
  await expect(ipoTab.locator('body')).toBeVisible();

  await page.bringToFront();
  await expect(page).toHaveURL(/nseindia\.com/);
  await ipoTab.close();

  // ─── 3) Currency Snapshot → /currency ──────────────────────────────────────
  await page.bringToFront();

  const currencySnapshotLink = page
    .locator(
      "//div[normalize-space()='Derivatives']/following-sibling::ul//a[normalize-space()='Currency Derivatives']"
    )
    .first();

  await currencySnapshotLink.scrollIntoViewIfNeeded();
  await expect(currencySnapshotLink).toBeVisible({ timeout: 20000 });

  const [currencyTab] = await Promise.all([
    context.waitForEvent('page', { timeout: 20000 }),
    currencySnapshotLink.click({ modifiers: ['Control'] }),
  ]);

  await currencyTab.waitForLoadState('domcontentloaded');
  await expect(currencyTab).toHaveURL(/currency/, { timeout: 30000 });
  await expect(currencyTab.locator('body')).toBeVisible();

  await page.bringToFront();
  await expect(page).toHaveURL(/nseindia\.com/);
});
