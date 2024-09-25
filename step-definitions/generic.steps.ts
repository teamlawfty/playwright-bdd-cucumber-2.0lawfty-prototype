// generic.steps.ts
import { Given, When, Then, After, setDefaultTimeout, Before } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import { initializeBrowser, closeBrowser, getPage } from '../helpers/playwrightContext'; // Adjust the path as necessary

dotenv.config();

setDefaultTimeout(25000);

Before(async () => {
    await initializeBrowser();
});

After(async () => {
    await closeBrowser();
});

When(/^I navigate to "(.+)"$/, async (path: string) => {
    const page = getPage(); // Get the page instance
    const url = process.env.HOST + path;
    await page.goto(url);
});

When(/^I click the "(.+)" (button|link)$/, async (buttonText: string, elementType: string) => {
    const page = getPage();
    try {
        let locator: string;
        if (elementType === 'button') {
            locator = `button[type="${buttonText.toLowerCase()}"]`;
        } else if (elementType === 'link') {
            locator = `a:has-text("${buttonText}")`;
        } else {
            throw new Error(`Unknown element type: ${elementType}`);
        }

        await page.locator(locator).waitFor({ state: 'visible', timeout: 5000 });
        await page.locator(locator).click({ timeout: 20000 });
    } catch (error) {
        console.error(`Failed to click the ${elementType} with text: "${buttonText}"`, error);
        throw error;
    }
});

When(/^I (check|uncheck) the "(.+)" checkbox$/, async (action: string, label: string) => {
    const page = getPage();
    const locator = `//label[contains(text(), "${label}")]`;
    if (action === 'check') {
        await page.check(locator);
    } else {
        await page.uncheck(locator);
    }
});

Then(/^I should see the "(.+)" (field|button|checkbox|link)$/, async (label: string, elementType: string) => {
    const page = getPage();
    let locator: string;

    switch (elementType) {
        case 'field':
        case 'input':
            locator = `input[name="${label.toLowerCase()}"]`;
            break;
        case 'textarea':
            locator = `textarea[name="${label.toLowerCase()}"]`;
            break;
        case 'button':
            locator = `button[type="${label.toLowerCase()}"]`;
            break;
        case 'checkbox':
            locator = `//label[contains(text(), "${label}")]`;
            break;
        case 'link':
            locator = `a[href="${label}"]`;
            break;
        default:
            throw new Error(`Unknown element type: ${elementType}`);
    }

    await expect(page.locator(locator)).toBeVisible();
});

When(/^I press the "(.*)" key$/, async (key: string) => {
    const page = getPage();
    await page.keyboard.press(key);
});

Then(/^I should see the "(.*)" text$/, async (text: string) => {
    const page = getPage();
    await expect(page.locator(`//span[contains(text(), "${text}")]`)).toBeVisible();
});

Then(/^I should see (an error|normal) message "([^"]*)"$/, async (messageType: string, expectedMessage: string) => {
    const page = getPage();
    await expect(page.locator(`//p[contains(text(), "${expectedMessage}")]`)).toBeVisible();
});

Given(/^I am on the "([^"]*)" page$/, async (pageName: string) => {
    const page = getPage();
    const pages: Record<string, string> = {
        'sign-in': `${process.env.HOST}/login`,
        // Add more pages as needed
    };

    if (!(pageName in pages)) {
        throw new Error(`Page "${pageName}" is not defined in the pages mapping.`);
    }

    await page.goto(pages[pageName]);
});

Given(/^I am a user who needs to sign in$/, async () => {
    const page = getPage();
    await page.goto(`${process.env.HOST}/login`);
});

Then(/^the focus should move sequentially through the "(.*)", "(.*)", "(.*)" checkbox, and "(.*)" button$/, async (emailField: string, passwordField: string, checkboxField: string, buttonField: string) => {
    const page = getPage();
    await expect(page.locator(`input[name="${emailField.toLowerCase()}"]`)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator(`input[name="${passwordField.toLowerCase()}"]`)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator(`button[role="checkbox"]`)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator(`button[type="${buttonField.toLowerCase()}"]`)).toBeFocused();
});

When(/^I enter (a valid|an invalid) "(.*)" in the "(.+)" (field|input|textarea)$/, async (validity: string, value: string, fieldName: string, elementType: string) => {
    const page = getPage();
    const envVarPattern = /^\{env\.(.+)\}$/;
    const match = value.match(envVarPattern);

    if (match) {
        const envVarName = match[1];
        value = process.env[envVarName] || `default-${envVarName}`; // Fallback if the env variable is not set
    }

    const locator = elementType === 'field' || elementType === 'input'
        ? `input[name="${fieldName.toLowerCase()}"]`
        : `textarea[name="${fieldName.toLowerCase()}"]`;

    await page.fill(locator, value);
});
