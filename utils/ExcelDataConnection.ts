import path from 'path';
import ExcelJS from 'exceljs';
import type { LoginTestData } from './types/LoginTestData';

/**
 * TypeScript Excel data reader — mirrors ExcelDataConnection.java (see interview-reference/).
 *
 * Interview flow:
 * 1. Open workbook (Apache POI XSSFWorkbook in Java / ExcelJS here)
 * 2. Read sheet by name
 * 3. Row 1 = column headers, row 2+ = test data
 * 4. Map each row to LoginTestData and return for BDD steps or TestNG DataProvider
 */
export class ExcelDataConnection {
  private static readonly defaultPath = path.join(__dirname, 'loginTestdata.xlsx');
  private static readonly defaultSheet = 'LoginData';

  static getExcelFilePath(): string {
    return ExcelDataConnection.defaultPath;
  }

  static async getAllRows(
    filePath = ExcelDataConnection.defaultPath,
    sheetName = ExcelDataConnection.defaultSheet
  ): Promise<LoginTestData[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const sheet = workbook.getWorksheet(sheetName);
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found in ${filePath}`);
    }

    const headers = sheet.getRow(1).values.slice(1) as string[];
    const rows: LoginTestData[] = [];

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const values = row.values.slice(1);
      const record: Record<string, string> = {};
      headers.forEach((header, index) => {
        record[header] = String(values[index] ?? '');
      });

      rows.push({
        userEmail: record.userEmail,
        userPassword: record.userPassword,
        productName: record.productName,
      });
    });

    return rows;
  }

  /** Read a single Excel row (row 2 = first data row, same as Java getData[rowIndex][col]). */
  static async getRowByNumber(
    rowNumber = 2,
    filePath = ExcelDataConnection.defaultPath,
    sheetName = ExcelDataConnection.defaultSheet
  ): Promise<LoginTestData> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const sheet = workbook.getWorksheet(sheetName);
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found in ${filePath}`);
    }

    const headers = sheet.getRow(1).values.slice(1) as string[];
    const values = sheet.getRow(rowNumber).values.slice(1);

    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = String(values[index] ?? '');
    });

    return {
      userEmail: record.userEmail,
      userPassword: record.userPassword,
      productName: record.productName,
    };
  }
}
