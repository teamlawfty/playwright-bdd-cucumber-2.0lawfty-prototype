import { Browser, BrowserContext, Page } from 'playwright';
import playwright from 'playwright';

let browser: Browser | undefined;
let context: BrowserContext | undefined;
let page: Page | undefined;

export const retry = async (fn: () => Promise<any>, retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await fn();
      return;
    } catch (error) {
      if (i < retries - 1) {
        console.warn(`Retry ${i + 1}/${retries} failed: ${(error as Error).message}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

export async function initializeBrowser() {
  await retry(async () => {
    if (!browser) {
      browser = await playwright.chromium.launch({ headless: true });
    }
    if (!context) {
      context = await browser.newContext();
      page = await context.newPage();
    }
  });

  if (!context || !page) {
    throw new Error("Browser initialization failed.");
  }
  await page.waitForTimeout(1000);
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
  await retry(async () => {
    if (browser) {
      await browser.close();
      browser = undefined;
      context = undefined;
      page = undefined;
    }
  }, 3, 2000);
}

