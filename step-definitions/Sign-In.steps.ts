import { When, Then, After, setDefaultTimeout, Before } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from 'playwright';
import playwright from 'playwright';
import { expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import { LoginPage } from '../page-objects/LoginPage'; // Adjust the path as necessary

let browser: Browser;
let context: BrowserContext;
let page: Page;
let loginPage: LoginPage;

dotenv.config();

setDefaultTimeout(25000);

Before(async () => {
  browser = await playwright.chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();
  loginPage = new LoginPage(page);
});

After(async () => {
  await browser.close();
});


When(/^I navigate to "(.+)"$/, async (path: string) => {
  const url = process.env.host + path;
  await page.goto(url);
});

When(/^I enter "(.+)" in the "(.+)" field$/, async (value: string, fieldName: string) => {

  if (value.startsWith('{env.')) {
    const envVarName = value.slice(5, -1);
    value = process.env[envVarName] || `default-${envVarName}`;
  }

  const locator = `input[name="${fieldName}"], textarea[name="${fieldName}"]`;
  await page.fill(locator, value);
});


When(/^I click the "(.+)" button$/, async (buttonText: string) => {
  await page.locator(`button:has-text("${buttonText}"), input[type="submit"]:has-text("${buttonText}")`).click();
});


When(/^I (check|uncheck) the "(.+)" checkbox$/, async (action: string, label: string) => {
  const locator = `input[type="checkbox"] + label:has-text("${label}")`;
  if (action === 'check') {
    await page.check(locator);
  } else {
    await page.uncheck(locator);
  }
});


Then(/^I should see the "(.+)" (field|button|checkbox|link)$/, async (label: string, elementType: string) => {
  let locator;
  switch (elementType) {
    case 'field':
      locator = `input[name="${label}"], textarea[name="${label}"]`;
      break;
    case 'button':
      locator = `button:has-text("${label}"), input[type="submit"]:has-text("${label}")`;
      break;
    case 'checkbox':
      locator = `input[type="checkbox"] + label:has-text("${label}")`;
      break;
    case 'link':
      locator = `a:has-text("${label}")`;
      break;
  }
  await expect(page.locator(locator)).toBeVisible();
});


When(/^I press the "Enter" key$/, async () => {
  await page.keyboard.press('Enter');
});

When(/^I press the "Tab" key$/, async () => {
  await page.keyboard.press('Tab');
});


Then(/^I should see the "Dashboard" page$/, async () => {
  await expect(page.locator('text=Dashboard')).toBeVisible();
});


Then(/^I should see an error message "Invalid login credentials\. Please try again\."$/, async () => {
  await expect(loginPage.invalidLoginMessage).toBeVisible();
});


Then(/^I should see an error message for invalid email format$/, async () => {
  await expect(loginPage.invalidEmailFormatMessage).toBeVisible();
});


Then(/^the application should store the authentication token$/, async () => {
  const cookies = await context.cookies();
  const authToken = cookies.find(cookie => cookie.name === 'accessToken');
  expect(authToken).toBeDefined();
  expect(authToken?.value).not.toBe('');
  console.log('Auth Token:', authToken?.value);
});
