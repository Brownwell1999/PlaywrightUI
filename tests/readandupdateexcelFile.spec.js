const Exceljs = require('exceljs');

const { test } = require('@playwright/test');



const filePath = 'C:\\Users\\nigam\\Downloads\\Retail Inventory.xlsx';



async function readupdateExcelFile() {

    const workbook = new Exceljs.Workbook();

    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet('Retail Inventory');



    let rowNumber, coloumnlNumber;
    // let output = {rowNumber:-1, cellNumber:-1};

    worksheet.eachRow((row, rNum) => {

        row.eachCell((cell, cNum) => {

            if(cell.value == "Dish Soap")

            {

                console.log(rNum, cNum);
                rowNumber = rNum;
                coloumnlNumber = cNum;

            }

        });

    });



    const cell = worksheet.getCell(rowNumber, coloumnlNumber);

    cell.value = "Lens Cleaner";

    await workbook.xlsx.writeFile(filePath);

}



readupdateExcelFile();


