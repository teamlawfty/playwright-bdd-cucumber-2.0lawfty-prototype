Feature: New Inquiry Form Fields

    Scenario: User views the New Inquiry form fields
        Given I am on the New Inquiry form page
        When I view the form fields
        Then I should see all required fields on the New Inquiry form
            | fieldKey         | fieldName         |
            | inquiryType      | Inquiry Type      |
            | caseType         | Case Type         |
            | campaign         | Campaign          |
            | source           | Source            |
            | inquiryDate      | Inquiry Date      |
            | testInquiry      | Test Inquiry      |
            | user             | User              |
            | stage            | Stage             |
            | incidentDate     | Incident Date     |
            | passedDate       | Passed Date       |
            | signedDate       | Signed Date       |
            | description      | Description       |
            | name             | Name              |
            | email            | Email             |
            | phoneNumber      | Phone Number      |
            | inquirerLanguage | Inquirer Language |
            | address          | Address           |
            | city             | City              |
            | state            | State             |
            | zip              | Zip               |
            | streakBoxKey     | Streak Box Key    |
        And I should see a dropdown for "Inquiry Type" with options: Call, Chat, Form, Referred, Secondary

    Scenario: User submits a New Inquiry form
        Given I am on the New Inquiry form page
        When I enter "John" in the "First Name" field
        And I enter "Doe" in the "Last Name" field
        And I enter "john.doe@example.com" in the "Email" field
        And I enter "1234567890" in the "Phone" field
        And I select "Call" from the "Inquiry Type" dropdown
        When I click the "Submit" button
        Then the inquiry should be saved
        And I should see a confirmation message indicating the inquiry has been successfully created