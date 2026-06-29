import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.io.IOException;
import java.util.Map;

/**
 * INTERVIEW REFERENCE — TestNG + Excel DataProvider + UI test method
 *
 * Say this in interview:
 * "TestNG DataProvider calls ExcelDataConnection.getRowAsMap(), passes Map to @Test,
 *  and the test uses Page Object methods — same flow as Cucumber Given/When/Then."
 */
public class LoginTestNGRunner {

    private static final String EXCEL_PATH = "utils/loginTestdata.xlsx";
    private static final String SHEET = "LoginData";

    @DataProvider(name = "loginData")
    public Object[][] loginData() throws IOException {
        // row 1 in POI = Excel row 2 (first data row)
        Map<String, String> row2 = ExcelDataConnection.getRowAsMap(EXCEL_PATH, SHEET, 1);
        return new Object[][] { { row2 } };
    }

    @Test(dataProvider = "loginData")
    public void loginAndAddProduct(Map<String, String> data) {
        String email = data.get("userEmail");
        String password = data.get("userPassword");
        String product = data.get("productName");

        // LoginPage loginPage = new LoginPage(driver);
        // loginPage.goto();
        // loginPage.validLogin(email, password);
        // ... add product, assert cart ...

        System.out.println("Data-driven test with: " + email + ", " + product);
    }
}
