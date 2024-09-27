import { Browser, BrowserContext, Page } from 'playwright';
import playwright from 'playwright';

let browser: Browser | undefined;
let context: BrowserContext | undefined;
let page: Page | undefined;

export async function initializeBrowser() {
  if (!browser) {
    browser = await playwright.chromium.launch({ headless: true });
  }
  if (!context) {
    context = await browser.newContext();
    page = await context.newPage();
  }
}

export function getContext(): BrowserContext {
  if (!context) {
    throw new Error('Context is not initialized. Did you forget to call initializeBrowser()?');
  }
  return context;
}

export function getPage(): Page {
  if (!page) {
    throw new Error('Page is not initialized. Did you forget to call initializeBrowser()?');
  }
  return page;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = undefined;
    context = undefined;
    page = undefined;
  }
}
