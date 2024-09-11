import { Page } from '@playwright/test';

export class NewInquiryPage {
    constructor(private page: Page) { }

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
            'input[name="testInquiry"]',
            'select[name="user"]',
            'select[name="stage"]',
            'input[name="incident.incidentDate"]',
            'input[name="passedDate"]',
            'input[name="signedDate"]',
            'textarea[name="description"]',
            'input[name="name"]',
            'input[name="email"]',
            'input[name="phoneNumber"]',
            'select[name="inquirerLanguage"]',
            'input[name="address"]',
            'input[name="city"]',
            'select[name="state"]',
            'input[name="zip"]',
            'input[name="streakBoxKey"]'
        ];
        for (const field of fields) {
            await this.page.waitForSelector(field);
        }
    }

    async verifyFieldsExist(fieldNames: string[]) {
        const fieldSelectors: { [key: string]: string } = {
            'Inquiry Type': 'select[name="kind"]',
            'Case Type': 'select[name="caseType"]',
            'Campaign': 'select[name="campaignId"]',
            'Source': 'select[name="sourceId"]',
            'Inquiry Date': 'input[name="inquiryTime"]',
            'Test Inquiry': 'input[name="testInquiry"]',
            'User': 'select[name="user"]',
            'Stage': 'select[name="stage"]',
            'Incident Date': 'input[name="incident.incidentDate"]',
            'Passed Date': 'input[name="passedDate"]',
            'Signed Date': 'input[name="signedDate"]',
            'Description': 'textarea[name="description"]',
            'Name': 'input[name="name"]',
            'Email': 'input[name="email"]',
            'Phone Number': 'input[name="phoneNumber"]',
            'Inquirer Language': 'select[name="inquirerLanguage"]',
            'Address': 'input[name="address"]',
            'City': 'input[name="city"]',
            'State': 'select[name="state"]',
            'Zip': 'input[name="zip"]',
            'Streak Box Key': 'input[name="streakBoxKey"]'
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
        await this.page.click(`select[name="${dropdownName}"]`);
        for (const option of options) {
            await this.page.waitForSelector(`option[value="${option.toLowerCase()}"]`);
        }
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
