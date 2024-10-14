import { Given, When, Then, BeforeAll, AfterAll } from '@cucumber/cucumber';
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

BeforeAll(async () => {
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

AfterAll(async () => {
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

Then(
  'I should see a dropdown for Inquiry Type - {string} dropdown, with options: Call, Chat, Form, Referred, Secondary',
  async (dropdown) => {
    await newInquiryPage.verifyDropdownOptions(dropdown, ['CALL', 'CHAT', 'FORM', 'REFERED', 'SECONDARY']);
  },
);

When('I enter {string} in the {string} field for Campaign', async () => {
  await newInquiryPage.selectCampaign();
});

When('I enter {string} in the {string} field for Inquiry Date', async () => {
  await newInquiryPage.enterInquiryDate();
});

When('I enter {string} in the {string} field for Case Type', async () => {
  await newInquiryPage.selectCaseType();
});

When('I enter {string} in the {string} field for Source', async () => {
  await newInquiryPage.selectSource();
});

When('I click {string} button', async () => {
  await newInquiryPage.submitInquiry();
});

Then('the inquiry should be saved', async () => {
  //to be implemented after bug fix
});

Then('I should see a confirmation message indicating the inquiry has been successfully created', async () => {
  //to be implemented after bug fix
});
