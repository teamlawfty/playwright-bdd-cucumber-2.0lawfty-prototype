import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect, Page } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { NewInquiryPage } from '../page-objects/NewInquiryPage';
import { chromium, Browser, BrowserContext } from 'playwright';
import * as dotenv from 'dotenv';

dotenv.config();

let browser: Browser;
let context: BrowserContext;
let page: Page;
let loginPage: LoginPage;
let newInquiryPage: NewInquiryPage;

Before(async () => {
  browser = await chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();
  loginPage = new LoginPage(page);
  newInquiryPage = new NewInquiryPage(page);

  await loginPage.navigateToLogin(process.env.SIGN_IN_URL || '');
  await loginPage.enterEmail(process.env.EMAIL || '');
  await loginPage.enterPassword(process.env.PASSWORD || '');
  await loginPage.clickSignIn();
  await expect(loginPage.dashboardSpan).toBeVisible();
});

After(async () => {
  await browser.close();
});

Given('I am on the New Inquiry form page', async () => {
    await newInquiryPage.navigateToNewInquiryPage(process.env.NEW_INQUIRY_URL || '');
});

When('I view the form fields', async () => {
    await newInquiryPage.verifyFormFieldsVisible();
});

Then('I should see all required fields on the New Inquiry form', async (dataTable) => {
  const fieldNames = dataTable.rawTable.slice(1).map((row: string[]) => row[1]);
  await newInquiryPage.verifyFieldsExist(fieldNames);
});

Then('I should see a dropdown for {string} with options: Call, Chat, Form, Referred, Secondary', async (dropdown) => {
    await newInquiryPage.verifyDropdownOptions(dropdown, ['Call', 'Chat', 'Form', 'Referred', 'Secondary']);
});

When('I enter {string} in the {string} field', async (value, fieldName) => {
    await newInquiryPage.enterFieldValue(fieldName, value);
});

When('I select {string} from the {string} dropdown', async (option, dropdownName) => {
    await newInquiryPage.selectDropdownOption(dropdownName, option);
});

When('I click the {string} button', async (buttonText) => {
    await newInquiryPage.clickButton(buttonText);
});

Then('the inquiry should be saved', async () => {
    await newInquiryPage.verifyInquirySaved();
});

Then('I should see a confirmation message indicating the inquiry has been successfully created', async () => {
    await newInquiryPage.verifyInquirySaved();
});
