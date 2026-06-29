const Exceljs = require('exceljs'); // // This is a module that is used to read, manipulate and write Excel files and  we are importinng dependencies here so we can use the methods and properties of the ExcelJS module
const { test, expect } = require('@playwright/test');

async function writeExcelTest(searchText, replaceText, change,filePath) // This is a function that is used to write to an Excel file and async is used to wait for the function to complete and this is a promise that is resolved when the function is completed
{
    
    const workbook = new Exceljs.Workbook();// workbook has collection of all worksheets //Here we are creating an object of the ExcelJS module, so we can use the methods and properties of the ExcelJS module and we are calling the workbook constructor/method to create a new workbook and this workbook has ability to read excel files and write to excel files
    await workbook.xlsx.readFile(filePath); //Here we are reading the excel file and this workbook has ability to read excel files and write to excel files and await is used to wait for the excel file to be read and this is a promise that is resolved when the excel file is read
    const worksheet = workbook.getWorksheet('SampleData'); //Here we are getting the worksheet from the workbook and this worksheet has ability to read and write to the worksheet and we are using the getWorksheet method to get the worksheet from the workbook which has values
    const output = await readExcel(worksheet, searchText); //Here we are reading the excel file and this workbook has ability to read excel files and write to excel files and await is used to wait for the excel file to be read and this is a promise that is resolved when the excel file is read
    
    const cell = worksheet.getCell(output.row, output.column+change.columnChange);
    cell.value = replaceText;
    await workbook.xlsx.writeFile(filePath);
}

async function readExcel(worksheet,searchText)
{
    let output = {row:-1, column:-1}; //This is an object that is used to store the row and column of the cell that is found and we are using the row and column to store the row and column of the cell that is found where {-1, -1} are default values
    worksheet.eachRow((row, rowNumber) =>  //This is a method that is used to iterate over the rows of the worksheet and this method returns a row object and we are using the eachRow method to iterate over the rows of the worksheet which has values
{
    row.eachCell((cell, colNumber) => //This is a method that is used to iterate over the cells of the row and this method returns a cell object and we are using the eachCell method to iterate over the cells of the row which has values
    {
        if(cell.value === searchText)
        {
            output.row = rowNumber;
            output.column = colNumber;
   
           
        }
    });
});
    return output;
}
// Update the value of cell C2 to 5000 if the value of cell A2 is 9876543213
//writeExcelTest("9876543213",
    //"5000",{rowChange:0,columnChange:2}, "C:\\Users\\nigam\\Downloads\\sample_testing_data.xlsx");
test('Excel file upload and download', async({page}) => 
    {
    await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
    const downloadPromise = page.waitForEvent('download');  
    await page.getByRole('button', {name : "Download"}).click();
    await downloadPromise;
    writeExcelTest("Mango",
    "5000",{rowChange:0,columnChange:2}, "C:\\Users\\nigam\\Downloads\\testdata.xlsx");
    await page.locator('#fileinput').click();
    await page.locator('#fileinput').setInputFiles("C:\\Users\\nigam\\Downloads\\testdata.xlsx");


    });
