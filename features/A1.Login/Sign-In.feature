Feature: Sign-in page

  Scenario: User successfully navigates to the sign-in page
    Given I am a user who needs to sign in
    When I navigate to "/login"
    Then I should see the "Email" field
    And I should see the "Password" field
    And I should see the "Remember me" checkbox
    And I should see the "Submit" button
    And I should see the "/forgot-password" link

  Scenario: User enters valid credentials and signs in
    Given I am on the "sign-in" page
    When I enter a valid "{env.EMAIL}" in the "email" field
    And I enter a valid "{env.PASSWORD}" in the "password" field
    And I check the "Remember me" checkbox
    And I click the "Submit" button
    Then I should see the "Dashboard" text
    And the application should store the authentication token

  Scenario: User navigates through the sign-in form using the tab key
    Given I am on the "sign-in" page
    When I press the "Tab" key
    Then the focus should move sequentially through the "Email", "Password", "Remember me" checkbox, and "Submit" button

  Scenario: User submits the form using the return key
    Given I am on the "sign-in" page
    And I enter a valid "{env.EMAIL}" in the "email" field
    And I enter a valid "{env.PASSWORD}" in the "password" field
    When I press the "Enter" key
    Then I should see the "Dashboard" text

  Scenario: User enters an invalid email
    Given I am on the "sign-in" page
    And I enter an invalid "invalid@mail.com" in the "email" field
    And I enter a valid "{env.PASSWORD}" in the "password" field
    And I click the "Submit" button
    Then I should see an error message "Invalid login credentials. Please try again."

  Scenario: User enters an invalid password
    Given I am on the "sign-in" page
    When I enter a valid "{env.EMAIL}" in the "email" field
    And I enter an invalid "wrongpassword" in the "password" field
    And I click the "Submit" button
    Then I should see an error message "Invalid login credentials. Please try again."

  Scenario: User enters an invalid email format
    Given I am on the "sign-in" page
    When I enter an invalid "testmail" in the "email" field
    And I enter a valid "{env.PASSWORD}" in the "password" field
    And I click the "Submit" button
    # Then I should see an error message "Invalid login credentials. Please try again."
