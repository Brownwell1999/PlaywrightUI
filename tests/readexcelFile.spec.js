const Exceljs = require('exceljs');
const { test } = require('@playwright/test');

const filePath = 'C:\\Users\\nigam\\Downloads\\Retail Inventory.xlsx';

async function excelTest() {
    const workbook = new Exceljs.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('Retail Inventory');

    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, cellNumber) => {
            console.log(cell.value);
        });
    });
}

excelTest();
