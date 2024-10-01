import { Then } from '@cucumber/cucumber';
import { getContext, getPage } from '../helpers/playwrightContext'; // Adjust the path as necessary
import { expect } from '@playwright/test';

Then(/^the application should store the authentication token$/, async () => {
  try {
    const context = getContext();
    const page = getPage();

    const cookies = await context.cookies();

    const authToken = cookies.find(cookie => cookie.name === 'accessToken');

    expect(authToken).toBeDefined();
    expect(authToken?.value).not.toBe('');
  } catch (error) {

    console.error('Error fetching cookies:', error);
    throw error;
  }
});
