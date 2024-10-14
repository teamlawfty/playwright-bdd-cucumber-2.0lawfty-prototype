import { Page } from '@playwright/test';

export class NewInquiryPage {
  constructor(private page: Page) {}

  async navigateToNewInquiryPage(url: string) {
    await this.page.goto(url);
  }

  async verifyFormFieldsVisible() {
    const fields = [
      'select[name="kind"]',
      'select[name="caseType"]',
      'select[name="campaignId"]',
      'select[name="sourceId"]',
      'input[name="inquiryTime"]',
      'button[id="stage"]',
      'button[aria-label="caseType"]',
      'button[aria-label="sourceId"]',
      'button[id="user"]',
      'input[placeholder="Select Incident Date"]',
      'input[name="passedDate"]',
      'input[name="signedDate"]',
      'textarea[id="description"]',
      'input[name="name"]',
      'input[name="email"]',
      'input[name="phoneNumber"]',
      'button[id="inquirerLanguage"]',
      'input[name="address"]',
      'input[name="city"]',
      'button[id=state]',
      'input[name="zip"]',
      'input[name="streakBoxKey"]',
      'button[type="submit"]',
    ];
    for (const field of fields) {
      await this.page.waitForSelector(field);
    }
  }

  async verifyFieldsExist(fieldNames: string[]) {
    const fieldSelectors: { [key: string]: string } = {
      'Inquiry Type': 'select[name="kind"]',
      'Case Type': 'select[name="caseType"]',
      Campaign: 'select[name="campaignId"]',
      Source: 'select[name="sourceId"]',
      'Inquiry Date': 'input[name="inquiryTime"]',
      User: 'select[name="user"]',
      Stage: 'select[name="stage"]',
      'Incident Date': 'input[name="incident.incidentDate"]',
      'Passed Date': 'input[name="passedDate"]',
      'Signed Date': 'input[name="passedDate"]',
      Description: 'textarea[name="description"]',
      Name: 'input[name="name"]',
      Email: 'input[name="email"]',
      'Phone Number': 'input[name="phoneNumber"]',
      'Inquirer Language': 'select[name="inquirerLanguage"]',
      Address: 'input[name="address"]',
      City: 'input[name="city"]',
      State: 'select[name="state"]',
      Zip: 'input[name="zip"]',
      'Streak Box Key': 'input[name="streakBoxKey"]',
    };

    for (const fieldName of fieldNames) {
      const selector = fieldSelectors[fieldName];
      if (selector) {
        await this.page.waitForSelector(selector, { state: 'visible' });
      } else {
        throw new Error(`No selector defined for field name: ${fieldName}`);
      }
    }
  }

  async verifyDropdownOptions(dropdownName: string, options: string[]) {
    const dropdown = this.page.locator(`select[name="${dropdownName}"]`);
    const dropdownButton = this.page.locator(`button[role="combobox"][aria-label="kind"]`);

    await dropdown.scrollIntoViewIfNeeded();

    await dropdownButton.click();

    for (const option of options) {
      this.page.locator(`option[value="${option}"]`).isVisible();
    }
  }

  async selectCampaign() {
    const dropdownButton = this.page.locator('button[type="button"][aria-label="campaignId"]');

    await dropdownButton.scrollIntoViewIfNeeded();

    await dropdownButton.click({ force: true });

    await this.page.selectOption('select[name="campaignId"]', 'alabama');

    await this.page.click('body', { force: true });
  }

  async enterInquiryDate() {
    const inquiryDateInput = this.page.locator('input[name="inquiryTime"]');
    await inquiryDateInput.fill('1991/01/17');
  }

  async selectCaseType() {
    const dropdownButton = this.page.locator('button[aria-label="caseType"]');
    await dropdownButton.scrollIntoViewIfNeeded();

    await dropdownButton.click({ force: true });

    await this.page.selectOption('select[name="caseType"]', 'ANIMAL_BITE');

    await this.page.click('body', { force: true });
  }

  async selectSource() {
    const dropdownButton = this.page.locator('button[aria-label="sourceId"]');
    await dropdownButton.scrollIntoViewIfNeeded();

    await dropdownButton.click({ force: true });

    await this.page.selectOption('select[name="sourceId"]', 'adroll');

    await this.page.click('body', { force: true });
  }

  async submitInquiry() {
    const submitButton = this.page.locator('button[type="submit"]:has-text("Create New Inquiry")');

    await submitButton.click();
  }

  async enterFieldValue(fieldName: string, value: string) {
    await this.page.fill(`input[name="${fieldName}"]`, value);
  }

  async selectDropdownOption(dropdownName: string, option: string) {
    await this.page.selectOption(`select[name="${dropdownName}"]`, option.toLowerCase());
  }

  async clickButton(buttonText: string) {
    await this.page.click(`button:has-text("${buttonText}")`);
  }

  async verifyInquirySaved() {
    await this.page.waitForSelector('text=Inquiry saved successfully');
  }
}
