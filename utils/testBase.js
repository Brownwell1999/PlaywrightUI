const {base} = require('@playwright/test');

exports.customest = base.test.extend( // Prepared the test data as Fixture
    { 
    testDataForLogin : 
        userEmail : 'deepak5550nigam@gmail.com',
        userPassword : 'NOotherway12#@',
        productName : 'zara coat 3'

    }

)