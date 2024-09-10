import { Page } from 'playwright';
import { Locator } from 'playwright';
import { expect } from '@playwright/test';

export class LoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;

        this.emailInput = this.page.locator('input[name="email"]');
        this.passwordInput = this.page.locator('input[name="password"]');
        this.rememberMeCheckbox = this.page.locator('label:text("Remember me")');
        this.signInButton = this.page.locator('button[type="submit"]');
        this.dashboardSpan = this.page.locator('span:has-text("Dashboard")');
        this.forgotPasswordLink = this.page.locator('a:has-text("Forgot Your Password?")');
    }

    // Locators
    emailInput: Locator;
    passwordInput: Locator;
    rememberMeCheckbox: Locator;
    signInButton: Locator;
    dashboardSpan: Locator;
    forgotPasswordLink: Locator;

    // Actions
    async navigateToLogin(url: string) {
        await this.page.goto(url);
    }

    async enterEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async enterPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async checkRememberMe() {
        await this.rememberMeCheckbox.check();
    }

    async clickSignIn() {
        await this.signInButton.click();
    }

    async pressTabKey() {
        await this.page.keyboard.press('Tab');
    }

    async pressEnterKey() {
        await this.page.keyboard.press('Enter');
    }

    async focusAndCheckElement(locator: string) {
        const element = this.page.locator(locator);
        await element.waitFor({ state: 'visible' });
        await element.focus();
        await expect(element).toBeFocused();
    }

    async getCookies() {
        return await this.page.context().cookies();
    }
}
