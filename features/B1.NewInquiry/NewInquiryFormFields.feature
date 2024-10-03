Feature: New Inquiry Form Fields

    Scenario: User successfully navigates to the New Inquiry form page
        Given I am on the "sign-in" page
        When I enter a valid "{env.EMAIL}" in the "email" field
        And I enter a valid "{env.PASSWORD}" in the "password" field
        And I check the "Remember me" checkbox
        And I click the "Submit" button
        Then I should see the "Dashboard" text
        Given I am on the "inquiries" page
        When I navigate to "/inquiries/new"
        Then I should see the "kind" button
        And I should see the "caseType" button
        And I should see the "campaignId" button
        And I should see the "sourceId" button
        And I should see the "inquiryTime" field
        And I should see the "user" button
        And I should see the "stage" button
        And I should see the "incidentDate" field
        And I should see the "passedDate" field
        And I should see the "signedDate" field
        And I should see the "Description" textarea
        And I should see the "Name" field
        And I should see the "Email" field
        And I should see the "phoneNumber" field
        And I should see the "inquirerLanguage" button
        And I should see the "Address" field
        And I should see the "city" field
        And I should see the "state" button
        And I should see the "zip" field
        And I should see the "streakBoxKey" field
        And I should see a dropdown for "kind" with options:
            | Select Inquiry Type |
            | Call                |
            | Chat                |
            | Form                |
            | Referred Inquiry    |
            | Secondary Inquiry   |

    Scenario: User submits a New Inquiry form
        Given I am on the "sign-in" page
        When I enter a valid "{env.EMAIL}" in the "email" field
        And I enter a valid "{env.PASSWORD}" in the "password" field
        And I check the "Remember me" checkbox
        And I click the "Submit" button
        Then I should see the "Dashboard" text
        Given I am on the "inquiries" page
        When I navigate to "/inquiries/new"
        When I click "state" button and select "AL" from the "state" dropdown
        And I enter a valid "1991/01/17" in the "inquiryTime" field
        And I click "caseType" button and select "ANIMAL_BITE" from the "caseType" dropdown
        And I click "sourceId" button and select "adroll" from the "sourceId" dropdown
        And I click the "Submit" button
        # Then I should see a confirmation message indicating the inquiry has been successfully created
