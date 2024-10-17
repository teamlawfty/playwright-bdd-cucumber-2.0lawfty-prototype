import { Browser, BrowserContext, Page } from 'playwright';
import playwright from 'playwright';
import fs from 'fs';
import path from 'path';

let browser: Browser | undefined;
let context: BrowserContext | undefined;
let page: Page | undefined;

export const retry = async (fn: () => Promise<unknown>, retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await fn();
      return;
    } catch (error) {
      if (i < retries - 1) {
        console.warn(`Retry ${i + 1}/${retries} failed: ${(error as Error).message}`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

export async function deleteOldTraces() {
  const tracesDir = path.join(__dirname, '../traces');
  try {
    const files = await fs.promises.readdir(tracesDir);
    for (const file of files) {
      const traceFile = path.join(tracesDir, file);
      await fs.promises.unlink(traceFile);
      console.log(`Deleted trace: ${file}`);
    }
    console.log('Previous traces deleted.');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('No traces directory found, nothing to delete.');
    } else {
      console.warn('Failed to delete traces:', err);
    }
  }
}

export async function initializeBrowser() {
  await retry(async () => {
    if (!browser) {
      browser = await playwright.chromium.launch({ headless: false });
    }
    if (!context) {
      context = await browser.newContext();
      page = await context.newPage();

      await context.tracing.start({ screenshots: true, snapshots: true });
    }
  });

  if (!context || !page) {
    throw new Error('Browser initialization failed.');
  }
  await page.waitForTimeout(3000);
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
  await retry(
    async () => {
      if (browser) {
        if (context) {
          const traceTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const traceFilename = `trace-${traceTimestamp}.zip`;

          await context.tracing.stop({ path: `traces/${traceFilename}` });
        }
        await browser.close();
        browser = undefined;
        context = undefined;
        page = undefined;
      }
    },
    3,
    2000,
  );
}
