Feature: Forgot Password

  Scenario: User successfully navigates to the forgot password page
    Given I am a user who needs to sign in
    When I navigate to "/login"
    Then I should see the "Email" field
    And I should see the "Password" field
    And I should see the "Remember me" checkbox
    And I should see the "Submit" button
    And I should see the "/forgot-password" link
    And I click the "/forgot-password" link
    Then I should see the "Forgot Password" text

  Scenario: User submits email for password reset
    When I navigate to "/forgot-password"
    Then I should see the "Forgot Password" text
    And I enter "{env.EMAIL}" in the "email" field
    And I click the "Submit" button
    Then I should have received an email with a password reset link

  Scenario: User submits email for password reset
    When I navigate to "/forgot-password"
    And I enter "test123@test.com" in the "email" field
    And I click the "Submit" button
    Then I should see normal message "User was not found or was not logged in"
