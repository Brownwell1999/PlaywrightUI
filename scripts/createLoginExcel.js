const ExcelJS = require('exceljs'); // This is a module that is used to read, manipulate and write Excel files andimpo we are importinng dependencies 
const path = require('path'); // This is a module that is used to join the path of the file and we are importing the path module so we can use the methods and properties of the path module

async function createLoginExcel() {
    const workbook = new ExcelJS.Workbook(); //Here we are creating an object of the ExcelJS module, so we can use the methods and properties of the ExcelJS module and we are calling the workbook constructor/method to create a new workbook and this workbook has ability to read excel files and write to excel files
    const sheet = workbook.addWorksheet('LoginData');

    sheet.addRow(['userEmail', 'userPassword', 'productName']);
    sheet.addRow([
        'deepak5550nigam@gmail.com',
        'NOotherway12#@',
        'zara coat 3',
    ]);
    sheet.addRow([
        'deepak5550nigam@gmail.com',
        'NOotherway12#@',
        'zara coat 2',
    ]);

    const outPath = path.join(__dirname, '../utils/loginTestdata.xlsx');
    await workbook.xlsx.writeFile(outPath);
    console.log('Created:', outPath);
}

createLoginExcel();
