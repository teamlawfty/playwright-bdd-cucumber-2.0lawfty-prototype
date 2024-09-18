Feature: Sign-in page

  Scenario: User successfully navigates to the sign-in page
    Given I am a user who needs to sign in
    When I navigate to "/users/sign_in"
    Then I should see the "Email address" field
    And I should see the "Password" field
    And I should see the "Remember me" checkbox
    And I should see the "Sign in" button
    And I should see the "Forgot your password?" link

  Scenario: User enters valid credentials and signs in
    Given I am on the sign-in page
    When I enter "{env.EMAIL}" in the "Email address" field
    And I enter "{env.PASSWORD}" in the "Password" field
    And I check the "Remember me" checkbox
    And I click the "Sign in" button
    Then I should see the "Dashboard" page
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

  Scenario: User enters an invalid email format
    Given I am on the sign-in page
    When I enter "invalidemail" in the "Email address" field
    And I enter a valid password in the "Password" field
    And I click the "Sign in" button
    Then I should see an error message for invalid email format

  Scenario: User enters an invalid password
    Given I am on the sign-in page
    When I enter a valid email address in the "Email address" field
    And I enter "wrongpassword" in the "Password" field
    And I click the "Sign in" button
    Then I should see an error message "Invalid login credentials. Please try again."

  Scenario: User enters an invalid email with correct format
    Given I am on the sign-in page
    When I enter "invalid@test.com" in the "Email address" field
    And I enter a valid password in the "Password" field
    And I click the "Sign in" button
    Then I should see an error message "Invalid login credentials. Please try again."
