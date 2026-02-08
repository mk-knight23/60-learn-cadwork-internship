import { chromium } from 'playwright';

(async () => {
  console.log('Launching Chromium browser...');
  const browser = await chromium.launch({
    headless: false,
    devtools: true
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  // Capture console logs
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[${type.toUpperCase()}] ${text}`);
  });

  // Capture errors
  page.on('pageerror', error => {
    console.error(`[PAGE ERROR] ${error.message}`);
  });

  // Capture network failures
  page.on('requestfailed', request => {
    console.error(`[NETWORK FAIL] ${request.url()} - ${request.failure().errorText}`);
  });

  console.log('Navigating to http://localhost:4200...');
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle', timeout: 60000 });

  // Wait for the app to fully render
  await page.waitForSelector('app-root', { timeout: 30000 });

  // Wait a bit more for any async content
  await page.waitForTimeout(3000);

  console.log('Taking screenshot...');
  await page.screenshot({
    path: '/Users/mkazi/60 Projects/screenshots/starters/starter-60.png',
    fullPage: true
  });

  console.log('Screenshot saved to /Users/mkazi/60 Projects/screenshots/starters/starter-60.png');

  // Get page info
  const title = await page.title();
  console.log(`Page title: ${title}`);

  // Check for any visible errors
  const bodyText = await page.textContent('body');
  if (bodyText.includes('Error') || bodyText.includes('error')) {
    console.warn('Warning: Page may contain error messages');
  }

  console.log('Browser verification complete. Keeping browser open for 10 seconds...');
  await page.waitForTimeout(10000);

  await browser.close();
  console.log('Browser closed.');
})();
