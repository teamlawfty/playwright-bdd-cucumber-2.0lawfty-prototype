
import { Given, When, Then } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from 'playwright';
import playwright from 'playwright';
import { expect } from '@playwright/test';
import { Before, After } from '@cucumber/cucumber';
import * as dotenv from 'dotenv';

let browser: Browser;
let context: BrowserContext;
let page: Page;

dotenv.config();

Before(async () => {
  browser = await playwright.chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();
});

Given('I am a user who needs to sign in', async () => {
  // Implement this step
});

When('I navigate to the sign-in URL "/sign-in"', async () => {
  await page.goto(process.env.SIGN_IN_URL || '');
});

Then('I should see the sign-in page with the fields "Email address" and "Password"', async () => {
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
});

Then('I should see a "Remember me" checkbox', async () => {
  await expect(page.locator('input[name="rememberMe"]')).toBeVisible();
});

Then('I should see a "Sign in" button', async () => {
  await expect(page.locator('button:has-text("Sign in")')).toBeVisible();
});

Then('I should see a "Forgot your password?" link', async () => {
  await expect(page.locator('a:has-text("Forgot Your Password?")')).toBeVisible();
});

Given('I am on the sign-in page', async () => {
  await page.goto(process.env.SIGN_IN_URL || '');
});

When('I enter a valid email address in the "Email address" field', async () => {
  await page.fill('input[name="email"]', process.env.VALID_EMAIL || '');
});

When('I enter a valid password in the "Password" field', async () => {
  await page.fill('input[name="password"]', process.env.VALID_PASSWORD || '');
});

When('I check the "Remember me" checkbox', async () => {
  await page.check('input[name="rememberMe"]');
});

When('I click the "Sign in" button', async () => {
  await page.click('button:has-text("Sign in")');
});

Then('I should be signed in successfully', async () => {
  await expect(page).toHaveURL(/dashboard/);
});

Then('the application should store the authentication token', async () => {
  const cookies = await page.context().cookies();
  const authToken = cookies.find(cookie => cookie.name === 'auth_token');
  expect(authToken).toBeDefined();
});

When('I press the "Tab" key', async () => {
  await page.keyboard.press('Tab');
});

Then('the focus should move sequentially through the "Email address", "Password",', async () => {
  await expect(page.locator('input[name="email"]')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('input[name="password"]')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('input[name="rememberMe"]')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('button:has-text("Sign in")')).toBeFocused();
});

Given('I have entered a valid email and password', async () => {
  await page.fill('input[name="email"]', process.env.VALID_EMAIL || '');
  await page.fill('input[name="password"]', process.env.VALID_PASSWORD || '');
});

When('I press the "Enter" key', async () => {
  await page.keyboard.press('Enter');
});

Then('the form should be submitted', async () => {
  await expect(page).toHaveURL(/dashboard/);
});

// Closing the browser after all steps are done
After(async () => {
  await browser.close();
});
