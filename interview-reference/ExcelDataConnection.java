import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * INTERVIEW REFERENCE — Java + Apache POI + TestNG/Cucumber
 *
 * Say this in interview:
 * "ExcelDataConnection opens the workbook, reads header row, maps each data row
 *  to a Map/Object[], and returns it to TestNG @DataProvider or Cucumber steps."
 *
 * Maven deps (pom.xml):
 *   org.apache.poi:poi-ooxml
 *   org.testng:testng
 *
 * Excel layout (utils/loginTestdata.xlsx):
 *   Sheet "LoginData" -> row1 headers, row2+ data
 */
public class ExcelDataConnection {

    public static Object[][] getData(String filePath, String sheetName) throws IOException {
        List<Object[]> rows = new ArrayList<>();

        try (FileInputStream fis = new FileInputStream(filePath);
             Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheet(sheetName);
            Row headerRow = sheet.getRow(0);
            int colCount = headerRow.getLastCellNum();

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row dataRow = sheet.getRow(i);
                if (dataRow == null) continue;

                Object[] rowData = new Object[colCount];
                for (int j = 0; j < colCount; j++) {
                    rowData[j] = getCellValue(dataRow.getCell(j));
                }
                rows.add(rowData);
            }
        }

        return rows.toArray(new Object[0][]);
    }

    public static Map<String, String> getRowAsMap(String filePath, String sheetName, int rowIndex)
            throws IOException {
        Map<String, String> map = new HashMap<>();

        try (FileInputStream fis = new FileInputStream(filePath);
             Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheet(sheetName);
            Row headerRow = sheet.getRow(0);
            Row dataRow = sheet.getRow(rowIndex);

            for (int j = 0; j < headerRow.getLastCellNum(); j++) {
                String key = getCellValue(headerRow.getCell(j));
                String value = getCellValue(dataRow.getCell(j));
                map.put(key, value);
            }
        }

        return map;
    }

    private static String getCellValue(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> "";
        };
    }
}
