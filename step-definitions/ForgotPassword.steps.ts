import { Then } from '@cucumber/cucumber';
import { getPage } from '../helpers/playwrightContext';
import { expect } from '@playwright/test';

Then(/^I should have received an email with a password reset link$/, async () => {
  const page = getPage();

  await page.route('**/graphql', async (route, request) => {
    const requestPostData = request.postDataJSON();

    if (requestPostData.operationName === 'UserSendPasswordResetWithToken') {
      const emailPayload = requestPostData.variables.email;

      expect(emailPayload).toBe(process.env.EMAIL || 'tester@lawfty.com');

      route.continue();

      const response = await request.response();
      const responseBody = response ? await response.json() : null;

      expect(responseBody?.data.userSendPasswordResetWithToken.message).toBe(
        'You will receive an email with instructions on how to reset your password in a few minutes.',
      );
    } else {
      route.continue();
    }
  });
});
