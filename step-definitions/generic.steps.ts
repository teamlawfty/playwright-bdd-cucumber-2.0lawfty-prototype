import { Given, When, Then, After, setDefaultTimeout, Before } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import { initializeBrowser, closeBrowser, getPage } from '../helpers/playwrightContext';

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
    let locators: string[] = []; // Array to hold possible locators

    if (elementType === 'button') {
        locators = [
            `button[type="${buttonText.toLowerCase()}"]`,
            `button[id="${buttonText.toLowerCase()}"]`,
            `button[id="${buttonText}"]`,
            `button:has-text("${buttonText}")`,
            `button[name="${buttonText.toLowerCase()}"]`,
            `button:has-text("${buttonText.toLowerCase()}")`,
            `//button[contains(text(), "${buttonText}")]`,
            `//input[@type="button" and @value="${buttonText}"]`,
        ];
    } else if (elementType === 'link') {
        locators = [
            `a:has-text("${buttonText}")`,
            `a[id="${buttonText.toLowerCase()}"]`,
            `a[href="${buttonText}"]`,
        ];
    } else {
        throw new Error(`Unknown element type: ${elementType}`);
    }

    // Attempt to locate and click the element using each locator strategy
    let elementFound = false;
    for (const locator of locators) {
        try {
            const element = page.locator(locator);
            if (await element.count() > 0) {
                await element.waitFor({ state: 'visible', timeout: 5000 });
                await element.click({ timeout: 20000 });
                elementFound = true;
                break;
            }
        } catch (error) {

            console.warn(`Failed to locate using strategy: ${locator}`, error);
        }
    }

    if (!elementFound) {
        throw new Error(`Failed to click the ${elementType} with text: "${buttonText}" using the available locator strategies.`);
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

Then(/^I should see the "(.+)" (field|button|checkbox|link|textarea)$/, async (label: string, elementType: string) => {
    const page = getPage();
    let locators: string[] = []; // Array to hold possible locators

    switch (elementType) {
        case 'field':
        case 'input':
            locators = [
                `input[name="${label.toLowerCase()}"]`,
                `input[name="${label}"]`,
                `input[id="${label.toLowerCase()}"]`,
                `input[id="${label}"]`,
                `input[placeholder="${label}"]`,
                `//label[contains(text(), "${label}")]/following-sibling::input`
            ];
            break;
        case 'textarea':
            locators = [
                `textarea[name="${label.toLowerCase()}"]`,
                `textarea[id="${label.toLowerCase()}"]`,
                `textarea[placeholder="${label}"]`
            ];
            break;
        case 'button':
            locators = [
                `button[type="${label.toLowerCase()}"]`,
                `button[id="${label}"]`,
                `button[id="${label.toLowerCase()}"]`,
                `//button[contains(text(), "${label}")]`,
                `//input[@type="button" and @value="${label}"]`,
            ];
            break;
        case 'checkbox':
            locators = [
                `//label[contains(text(), "${label}")]/preceding-sibling::input[@type="checkbox"]`,
                `//label[contains(text(), "${label}")]`,
                `input[type="checkbox"][name="${label.toLowerCase()}"]`,
                `input[type="checkbox"][id="${label.toLowerCase()}"]`
            ];
            break;
        case 'link':
            locators = [
                `a[href="${label}"]`,
                `a:has-text("${label}")`,
                `a[id="${label.toLowerCase()}"]`
            ];
            break;
        default:
            throw new Error(`Unknown element type: ${elementType}`);
    }

    let elementFound = false;
    for (const locator of locators) {
        const element = page.locator(locator);
        if (await element.count() > 0) {
            try {

                await element.scrollIntoViewIfNeeded();
                await element.waitFor({ state: 'visible', timeout: 25000 });
                await expect(element).toBeVisible();
                elementFound = true;
                break;

            } catch (error) {
                console.warn(`Failed to interact with element using locator: ${locator}`, error);
            }
        }
    }

    if (!elementFound) {
        throw new Error(`Element "${label}" of type "${elementType}" not found using the available locator strategies.`);
    }
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
        'inquiries': `${process.env.HOST}/inquiries`,
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
        ? `input[name="${fieldName}"]`
        : `textarea[name="${fieldName.toLowerCase()}"]`;

    const element = page.locator(locator);
    await element.scrollIntoViewIfNeeded();
    await element.focus();

    await element.fill(value);
});

When(/^I click "([^"]*)" button and select "([^"]*)" from the "([^"]*)" dropdown$/, async (buttonName: string, option: string, dropdownName: string) => {
    const page = getPage();

    const dropdownButtonLocator = page.locator(`[id="${buttonName}"]`);

    await dropdownButtonLocator.scrollIntoViewIfNeeded();
    await dropdownButtonLocator.waitFor({ state: 'visible', timeout: 5000 });
    await dropdownButtonLocator.click();

    const dropdownLocator = page.locator(`select[name="${dropdownName}"]`);
    await dropdownLocator.scrollIntoViewIfNeeded();
    await dropdownLocator.waitFor({ state: 'visible', timeout: 5000 });

    await page.waitForTimeout(1000);

    await dropdownLocator.selectOption({ value: option });

    await page.keyboard.press('Escape');
});

Then(/^I should see a dropdown for "([^"]*)" with options:$/, async (dropdownName: string, expectedOptionsTable) => {
    const page = getPage();

    const expectedOptions = expectedOptionsTable.raw().flat();

    const dropdownTriggerLocator = page.locator(`[id="${dropdownName}"]`);

    await dropdownTriggerLocator.scrollIntoViewIfNeeded();
    await dropdownTriggerLocator.focus();

    await dropdownTriggerLocator.click();

    await page.waitForTimeout(1000);

    await page.keyboard.press('Escape');

    await page.waitForTimeout(500);

    await dropdownTriggerLocator.click();

    const customOptionsContainer = page.locator('[role="listbox"], .dropdown-container');
    await customOptionsContainer.waitFor({ state: 'visible', timeout: 5000 });

    await customOptionsContainer.scrollIntoViewIfNeeded();

    const visibleOptions = customOptionsContainer.locator('[role="option"], .dropdown-item');
    await visibleOptions.first().waitFor({ state: 'visible', timeout: 5000 });

    const actualOptions = await visibleOptions.evaluateAll((elements) => {
        return elements.map((option) => option.textContent?.trim() || '');
    });

    expect(actualOptions).toEqual(expectedOptions);
});





