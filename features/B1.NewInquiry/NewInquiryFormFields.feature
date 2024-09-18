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
        And I should see a dropdown for Inquiry Type - "kind" dropdown, with options: Call, Chat, Form, Referred, Secondary

    Scenario: User submits a New Inquiry form
        Given I am on the New Inquiry form page
        When I enter "Alabama" in the "Campaign" field for Campaign
        And I enter "1991/01/17" in the "Inquiry Date" field for Inquiry Date
        And I enter "Animal Bite" in the "Case Type" field for Case Type
        And I enter "Adroll" in the "Source" field for Source
        When I click "Submit" button
        Then the inquiry should be saved
        And I should see a confirmation message indicating the inquiry has been successfully created