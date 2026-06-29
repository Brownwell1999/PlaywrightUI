Feature: Login and cart with JSON test data
  As a shopper
  I want to login and add a product using JSON-driven test data
  So that UI tests stay separate from hardcoded credentials

  Scenario: User logs in and adds product from JSON (first row)
    Given login test data is loaded from JSON index 0
    When I open the client application
    And I login with loaded credentials
    And I add the configured product to cart
    Then the configured product should be visible in cart
