import path from 'path';
import type { LoginTestData } from './types/LoginTestData';
import loginTestdata from './loginTestdata.json';

/**
 * TypeScript equivalent of reading JSON test data.
 * Interview talking point: same role as loading a .json resource in Java
 * (Jackson/Gson) before passing rows into Cucumber steps or TestNG @Test methods.
 */
export class JsonDataConnection {
  static getAllLoginData(): LoginTestData[] {
    return JSON.parse(JSON.stringify(loginTestdata)) as LoginTestData[];
  }

  static getLoginDataByIndex(index = 0): LoginTestData {
    const rows = JsonDataConnection.getAllLoginData();
    if (!rows[index]) {
      throw new Error(`No JSON login data at index ${index}`);
    }
    return rows[index];
  }

  static getLoginDataFilePath(): string {
    return path.join(__dirname, 'loginTestdata.json');
  }
}
