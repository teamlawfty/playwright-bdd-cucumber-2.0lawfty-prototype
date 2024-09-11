Feature: Sign-in page

  Scenario: User successfully navigates to the sign-in page
    Given I am a user who needs to sign in
    When I navigate to the sign-in URL "https://api.staging-lawfty.com/users/sign_in"
    Then I should see the sign-in page with the fields "Email address" and "Password"
    And I should see a "Remember me" checkbox
    And I should see a "Sign in" button
    And I should see a "Forgot your password?" link

  Scenario: User enters valid credentials and signs in
    Given I am on the sign-in page
    When I enter a valid email address in the "Email address" field
    And I enter a valid password in the "Password" field
    And I check the "Remember me" checkbox
    And I click the "Sign in" button
    Then I should be signed in successfully
    And the application should store the authentication token

  Scenario: User navigates through the sign-in form using the tab key
    Given I am on the sign-in page
    When I press the "Tab" key
    Then the focus should move sequentially through the "Email address", "Password", "Remember me" checkbox, and "Sign in" button

  Scenario: User submits the form using the return key
    Given I am on the sign-in page
    And I have entered a valid email and password
    When I press the "Enter" key
    Then the form should be submitted
    And I should be signed in successfully
