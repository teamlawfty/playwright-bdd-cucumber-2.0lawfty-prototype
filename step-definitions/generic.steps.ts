import { Given, When, Then, After, setDefaultTimeout, Before, BeforeAll } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import { initializeBrowser, closeBrowser, getPage, retry, deleteOldTraces } from '../helpers/playwrightContext';

dotenv.config();

setDefaultTimeout(25000);

BeforeAll(async () => {
  console.log('Starting test suite...');
  await deleteOldTraces();
  console.log('Old traces deleted.');
});

Before(async () => {
  console.log('Initializing browser...');
  await initializeBrowser();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('Browser initialized.');
});

After(async () => {
  console.log('Closing browser...');
  await closeBrowser();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('Browser closed.');
});

When(/^I navigate to "(.+)"$/, async (path: string) => {
  const page = getPage(); // Get the page instance
  const url = process.env.HOST + path;
  console.log(`Navigating to ${url}`);
  await retry(() => page.goto(url, { waitUntil: 'networkidle' }));
  console.log(`Successfully navigated to ${url}`);
});

When(/^I click the "(.+)" (button|link)$/, async (buttonText: string, elementType: string) => {
  const page = getPage();
  console.log(`Attempting to click the "${buttonText}" ${elementType}...`);
  let locators: string[] = []; // Array to hold possible locators

  if (elementType === 'button') {
    locators = [
      `//button[@type="${buttonText.toLowerCase()}"]`,
      `//button[@id="${buttonText.toLowerCase()}"]`,
      `//button[@id="${buttonText}"]`,
      `//button[contains(text(),"${buttonText}")]`,
      `//button[@name="${buttonText.toLowerCase()}"]`,
      `//button[contains(text(),"${buttonText.toLowerCase()}")]`,
      `//input[@type="button" and @value="${buttonText}"]`,
    ];
  } else if (elementType === 'link') {
    locators = [
      `//a[contains(text(),"${buttonText}")]`,
      `//a[@id="${buttonText.toLowerCase()}"]`,
      `//a[@href="${buttonText}"]`,
    ];
  } else {
    throw new Error(`Unknown element type: ${elementType}`);
  }

  let elementFound = false;
  await retry(async () => {
    for (const locator of locators) {
      const element = page.locator(locator);
      if ((await element.count()) > 0) {
        console.log(`Found "${buttonText}" ${elementType} with locator: ${locator}`);
        await element.waitFor({ state: 'visible', timeout: 5000 });
        await element.click({ timeout: 20000 });
        elementFound = true;
        break;
      }
    }

    if (!elementFound) {
      throw new Error(
        `Failed to locate the ${elementType} with text: "${buttonText}" using available locator strategies.`,
      );
    }
  });

  if (!elementFound) {
    throw new Error(
      `Failed to click the ${elementType} with text: "${buttonText}" using the available locator strategies.`,
    );
  }

  if (elementFound) {
    console.log(`Successfully clicked the ${elementType} with text: "${buttonText}"`);
  }
});

When(/^I (check|uncheck) the "(.+)" checkbox$/, async (action: string, label: string) => {
  const page = getPage();
  const locator = `//label[contains(text(), "${label}")]`;
  console.log(`Attempting to ${action} the checkbox with label "${label}"...`);

  if (action === 'check') {
    await page.check(locator);
    console.log(`Successfully checked the checkbox with label "${label}".`);
  } else {
    await page.uncheck(locator);
    console.log(`Successfully unchecked the checkbox with label "${label}".`);
  }
});

Then(/^I should see the "(.+)" (field|button|checkbox|link|textarea)$/, async (label: string, elementType: string) => {
  const page = getPage();
  let locators: string[] = [];
  console.log(`Waiting for the "${label}" ${elementType} to be visible...`);
  await page.waitForLoadState('load');

  switch (elementType) {
    case 'field':
    case 'input':
      locators = [
        `//input[@name="${label.toLowerCase()}"]`,
        `//input[@name="${label}"]`,
        `//input[@id="${label.toLowerCase()}"]`,
        `//input[@id="${label}"]`,
        `//input[@placeholder="${label}"]`,
        `//label[contains(text(), "${label}")]/following-sibling::input`,
      ];
      break;
    case 'textarea':
      locators = [
        `//textarea[@name="${label.toLowerCase()}"]`,
        `//textarea[@id="${label.toLowerCase()}"]`,
        `//textarea[@placeholder="${label}"]`,
      ];
      break;
    case 'button':
      locators = [
        `//button[@type="${label.toLowerCase()}"]`,
        `//button[@id="${label}"]`,
        `//button[@id="${label.toLowerCase()}"]`,
        `//button[contains(text(),"${label}")]`,
        `//input[@type="button" and @value="${label}"]`,
      ];
      break;
    case 'checkbox':
      locators = [
        `//label[contains(text(), "${label}")]/preceding-sibling::input[@type="checkbox"]`,
        `//label[contains(text(), "${label}")]`,
        `//input[@type="checkbox" and @name="${label.toLowerCase()}"]`,
        `//input[@type="checkbox" and @id="${label.toLowerCase()}"]`,
      ];
      break;
    case 'link':
      locators = [`//a[@href="${label}"]`, `//a[contains(text(),"${label}")]`, `//a[@id="${label.toLowerCase()}"]`];
      break;
    default:
      throw new Error(`Unknown element type: ${elementType}`);
  }

  let elementFound = false;
  await retry(async () => {
    for (const locator of locators) {
      await page.waitForLoadState('networkidle');
      const element = page.locator(locator);
      if ((await element.count()) > 0) {
        console.log(`Found "${label}" ${elementType} with locator: ${locator}`);
        await element.scrollIntoViewIfNeeded();
        await element.waitFor({ state: 'visible', timeout: 30000 });
        await expect(element).toBeVisible();
        elementFound = true;
        break;
      }
    }

    if (!elementFound) {
      console.error(`Element "${label}" of type "${elementType}" not found.`);
      throw new Error(`Element "${label}" of type "${elementType}" not found using the available locator strategies.`);
    }
  });

  if (!elementFound) {
    throw new Error(`Element "${label}" of type "${elementType}" not found using the available locator strategies.`);
  }

  if (elementFound) {
    console.log(`Successfully located the "${label}" ${elementType}`);
  }
});

When(/^I press the "(.*)" key$/, async (key: string) => {
  const page = getPage();
  console.log(`Pressing the "${key}" key...`);
  await page.keyboard.press(key);
  console.log(`Successfully pressed the "${key}" key.`);
});

Then(/^I should see the "(.*)" text$/, async (text: string) => {
  const page = getPage();
  console.log(`Checking if the text "${text}" is visible...`);
  await expect(page.locator(`//span[contains(text(), "${text}")] | //h1[contains(text(), "${text}")]`)).toBeVisible();
  console.log(`The text "${text}" is visible.`);
});

Then(/^I should see (an error|normal) message "([^"]*)"$/, async (messageType: string, expectedMessage: string) => {
  const page = getPage();
  console.log(`Checking if the ${messageType} message "${expectedMessage}" is visible...`);
  await expect(page.locator(`//p[contains(text(), "${expectedMessage}")]`)).toBeVisible();
  console.log(`The ${messageType} message "${expectedMessage}" is visible.`);
});

Given(/^I am on the "([^"]*)" page$/, async (pageName: string) => {
  const page = getPage();
  const pages: Record<string, string> = {
    'sign-in': `${process.env.HOST}/login`,
    inquiries: `${process.env.HOST}/inquiries`,
  };

  if (!(pageName in pages)) {
    throw new Error(`Page "${pageName}" is not defined in the pages mapping.`);
  }

  console.log(`Navigating to the "${pageName}" page...`);
  await retry(() => page.goto(pages[pageName], { waitUntil: 'networkidle' }));
  console.log(`Successfully navigated to the "${pageName}" page.`);
});

Given(/^I am a user who needs to sign in$/, async () => {
  const page = getPage();
  console.log('Navigating to the sign-in page...');
  await page.goto(`${process.env.HOST}/login`);
});

Then(
  /^the focus should move sequentially through the "(.*)", "(.*)", "(.*)" checkbox, and "(.*)" button$/,
  async (emailField: string, passwordField: string, checkboxField: string, buttonField: string) => {
    const page = getPage();
    console.log(
      `Verifying focus sequence for fields: "${emailField}", "${passwordField}", "${checkboxField}", and button: "${buttonField}"`,
    );
    await expect(page.locator(`//input[@name="${emailField.toLowerCase()}"]`)).toBeFocused();
    console.log(`Focus is on the "${emailField}" field`);
    await page.keyboard.press('Tab');
    await expect(page.locator(`//input[@name="${passwordField.toLowerCase()}"]`)).toBeFocused();
    console.log(`Focus moved to the "${passwordField}" field`);
    await page.keyboard.press('Tab');
    await expect(page.locator(`//button[@role="checkbox"]`)).toBeFocused();
    console.log(`Focus moved to the "${checkboxField}" checkbox`);
    await page.keyboard.press('Tab');
    await expect(page.locator(`//button[@type="${buttonField.toLowerCase()}"]`)).toBeFocused();
    console.log(`Focus moved to the "${buttonField}" button`);
  },
);

When(
  /^I enter "(.*)" in the "(.+)" (field|input|textarea)$/,
  async (value: string, fieldName: string, elementType: string) => {
    const page = getPage();
    console.log(`Entering value "${value}" into the "${fieldName}" ${elementType}`);

    const envVarPattern = /^\{env\.(.+)\}$/;
    const match = value.match(envVarPattern);

    if (match) {
      const envVarName = match[1];
      value = process.env[envVarName] || `default-${envVarName}`; // Fallback if the env variable is not set
    }

    const locator =
      elementType === 'field' || elementType === 'input'
        ? `//input[@name="${fieldName}"]`
        : `//textarea[@name="${fieldName.toLowerCase()}"]`;

    await retry(async () => {
      const element = page.locator(locator);
      await element.scrollIntoViewIfNeeded();
      await element.waitFor({ state: 'visible', timeout: 5000 });
      await element.focus();
      await element.fill(value);
    });
    console.log(`Successfully entered value "${value}" into the "${fieldName}" ${elementType}`);
  },
);

When(
  /^I click "([^"]*)" button and select "([^"]*)" from the "([^"]*)" dropdown$/,
  async (buttonName: string, option: string, dropdownName: string) => {
    const page = getPage();
    console.log(`Clicking the "${buttonName}" button and selecting "${option}" from the "${dropdownName}" dropdown`);

    const dropdownButtonLocator = page.locator(`//button[@id='${buttonName}']`);

    await dropdownButtonLocator.scrollIntoViewIfNeeded();
    await dropdownButtonLocator.waitFor({ state: 'visible', timeout: 5000 });
    await dropdownButtonLocator.click();

    const dropdownLocator = page.locator(`//select[@name='${dropdownName}']`);
    await dropdownLocator.scrollIntoViewIfNeeded();
    await dropdownLocator.waitFor({ state: 'visible', timeout: 5000 });

    await page.waitForTimeout(1000);

    await dropdownLocator.selectOption({ value: option });

    await page.keyboard.press('Escape');
    console.log(`Successfully selected "${option}" from the "${dropdownName}" dropdown`);
  },
);

Then(/^I should see a dropdown for "([^"]*)" with options:$/, async (dropdownName: string, expectedOptionsTable) => {
  const page = getPage();
  console.log(`Checking if dropdown "${dropdownName}" contains the expected options`);

  const expectedOptions = expectedOptionsTable.raw().flat();

  const dropdownTriggerLocator = page.locator(`//button[@id='${dropdownName}']`);

  await dropdownTriggerLocator.scrollIntoViewIfNeeded();
  await dropdownTriggerLocator.focus();

  await dropdownTriggerLocator.click();

  await page.waitForTimeout(1000);

  await page.keyboard.press('Escape');

  await page.waitForTimeout(500);

  await dropdownTriggerLocator.click();

  const customOptionsContainer = page.locator('//div[@role="listbox" or contains(@class,"dropdown-container")]');
  await customOptionsContainer.waitFor({ state: 'visible', timeout: 5000 });

  await customOptionsContainer.scrollIntoViewIfNeeded();

  const visibleOptions = customOptionsContainer.locator('//div[@role="option" or contains(@class,"dropdown-item")]');
  await visibleOptions.first().waitFor({ state: 'visible', timeout: 5000 });

  const actualOptions = await visibleOptions.evaluateAll((elements) => {
    return elements.map((option) => option.textContent?.trim() || '');
  });

  expect(actualOptions).toEqual(expectedOptions);
  console.log(`Dropdown "${dropdownName}" contains the expected options.`);
});
