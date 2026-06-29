const Exceljs = require('exceljs');

const { expect } = require('@playwright/test');

const filePath = 'C:\\Users\\nigam\\Downloads\\Retail Inventory.xlsx';

async function retailReadWrite() {

    const workbook = new Exceljs.Workbook();

    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet('Retail Inventory');

    let rowNumber, productNameCol;

    worksheet.eachRow((row, rNum) => {

        row.eachCell((cell, cNum) => {

            if (cell.value == 'Dried Fruit') {

                console.log('Found Product Name at row:', rNum, 'column:', cNum);

                rowNumber = rNum;

                productNameCol = cNum;

            }

        });

    });

    const supplierCol = productNameCol + 2;

    const supplierCell = worksheet.getCell(rowNumber, supplierCol);

    console.log('Old Supplier Name:', supplierCell.value);

    supplierCell.value = 'Tentogram supply'; //This is the new value that is being set to the cell and we are using the value property to set the value of the cell and we are using the supplierCell object to set the value of the cell and we are using the value property to set the value of the cell

    await workbook.xlsx.writeFile(filePath); //This is the method that is used to write the changes to the excel file and we are using the writeFile method to write the changes to the excel file and we are using the filePath to specify the path of the excel file and we are using the workbook object to write the changes to the excel file and we are using the xlsx property to write the changes to the excel file and we are using the writeFile method to write the changes to the excel file and we are using the filePath to specify the path of the excel file and this is a promise that is resolved when the changes are written to the excel file       

    const updatedValue = worksheet.getCell(rowNumber, supplierCol).value;

    console.log('Updated Supplier Name:', updatedValue);

    expect(updatedValue).toBe('Tentogram supply');

    console.log('RESULT: PASS');

}

retailReadWrite().catch((error) => {

    console.log('RESULT: FAIL');

    console.log(error.message);

    process.exit(1);

});
