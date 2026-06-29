Feature: Login and cart with Excel test data
  As a QA engineer
  I want to drive UI tests from an Excel sheet
  So that business users can maintain test data without code changes

  Scenario: User logs in and adds product from Excel row 2
    Given login test data is loaded from Excel row 2
    When I open the client application
    And I login with loaded credentials
    And I add the configured product to cart
    Then the configured product should be visible in cart
