import { Given, When, Then } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from 'playwright';
import playwright from 'playwright';
import { expect } from '@playwright/test';
import { Before, After } from '@cucumber/cucumber';
import * as dotenv from 'dotenv';
import { LoginPage } from '../page-objects/LoginPage'; // Adjust the path as necessary

let browser: Browser;
let context: BrowserContext;
let page: Page;
let loginPage: LoginPage;

dotenv.config();

Before(async () => {
  browser = await playwright.chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();
  loginPage = new LoginPage(page);
});

Given('I am a user who needs to sign in', async () => {
  // Implement this step
});

When('I navigate to the sign-in URL {string}', async (url: string) => {
  await loginPage.navigateToLogin(process.env.SIGN_IN_URL || url);
});

Then('I should see the sign-in page with the fields "Email address" and "Password"', async () => {
  await expect(loginPage.emailInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
});

Then('I should see a "Remember me" checkbox', async () => {
  await expect(loginPage.rememberMeCheckbox).toBeVisible();
});

Then('I should see a "Sign in" button', async () => {
  await expect(loginPage.signInButton).toBeVisible();
});

Then('I should see a "Forgot your password?" link', async () => {
  await expect(loginPage.forgotPasswordLink).toBeVisible();
});

Given('I am on the sign-in page', async () => {
  await loginPage.navigateToLogin(process.env.SIGN_IN_URL || '');
});

When('I enter a valid email address in the "Email address" field', async () => {
  await loginPage.enterEmail(process.env.EMAIL || '');
});

When('I enter a valid password in the "Password" field', async () => {
  await loginPage.enterPassword(process.env.PASSWORD || '');
});

When('I check the "Remember me" checkbox', async () => {
  await loginPage.checkRememberMe();
});

When('I click the "Sign in" button', async () => {
  await loginPage.clickSignIn();
});

Then('I should be signed in successfully', async () => {
  await expect(loginPage.dashboardSpan).toBeVisible();

  const cookies = await loginPage.getCookies();
  const authToken = cookies.find(cookie => cookie.name === 'accessToken');

  expect(authToken).toBeDefined();
  expect(authToken?.value).not.toEqual('');

  console.log('Auth Token:', authToken?.value);
});

Then('the application should store the authentication token', async () => {
  const cookies = await loginPage.getCookies();
  const authTokenCookie = cookies.find(cookie => cookie.name === 'accessToken');

  expect(authTokenCookie).toBeDefined();
  expect(authTokenCookie?.value).not.toEqual('');
});

When('I press the "Tab" key', async () => {
  await loginPage.pressTabKey();
});

Then('the focus should move sequentially through the "Email address", "Password", "Remember me" checkbox, and "Sign in" button', async () => {
  await expect(loginPage.emailInput).toBeFocused();
  await loginPage.pressTabKey();
  await expect(loginPage.passwordInput).toBeFocused();
  await loginPage.pressTabKey();
  await expect(loginPage.rememberMeCheckbox).toBeFocused();
  await loginPage.pressTabKey();
  await expect(loginPage.signInButton).toBeFocused();
});

Given('I have entered a valid email and password', async () => {
  await loginPage.enterEmail(process.env.EMAIL || '');
  await loginPage.pressTabKey();
  await loginPage.enterPassword(process.env.PASSWORD || '');
  await loginPage.pressTabKey();
  await loginPage.pressTabKey();
});

When('I press the "Enter" key', async () => {
  await loginPage.pressEnterKey();
});

Then('the form should be submitted', async () => {
  await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 });
  await expect(loginPage.dashboardSpan).toBeVisible({ timeout: 10000 });
});

// Closing the browser after all steps are done
After(async () => {
  await browser.close();
});
