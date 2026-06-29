const Exceljs = require('exceljs');

const { expect } = require('@playwright/test');

const filePath = 'C:\\Users\\nigam\\Downloads\\Retail Inventory.xlsx';

async function retailReadWriteStronger() {

    const workbook = new Exceljs.Workbook();

    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet('Retail Inventory');

    let productNameCol, supplierNameCol;

    const headerRow = worksheet.getRow(1);

    headerRow.eachCell((cell, colNumber) => {

        if (cell.value == 'Product Name') {

            productNameCol = colNumber;

        }

        if (cell.value == 'Supplier Name') {

            supplierNameCol = colNumber;

        }

    });

    console.log('Product Name column:', productNameCol);

    console.log('Supplier Name column:', supplierNameCol);

    let rowNumber;

    worksheet.eachRow((row, rNum) => {

        if (rNum == 1) return;

        const productName = row.getCell(productNameCol).value;

        if (productName == 'Dried Fruit') {

            console.log('Found Product Name at row:', rNum);

            rowNumber = rNum;

        }

    });

    const supplierCell = worksheet.getCell(rowNumber, supplierNameCol);

    console.log('Old Supplier Name:', supplierCell.value);

    supplierCell.value = 'Tentogram supply';

    await workbook.xlsx.writeFile(filePath);

    const updatedValue = worksheet.getCell(rowNumber, supplierNameCol).value;

    console.log('Updated Supplier Name:', updatedValue);

    expect(updatedValue).toBe('Tentogram supply');

    console.log('RESULT: PASS');

}

retailReadWriteStronger().catch((error) => {

    console.log('RESULT: FAIL');

    console.log(error.message);

    process.exit(1);

});
