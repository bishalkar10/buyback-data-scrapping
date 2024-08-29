const xlsx = require("xlsx");
const fs = require("fs");

function saveToExcel(data, filePath = "output.xlsx") {
  // Load the existing workbook if it exists, or create a new one
  let workbook;

  if (fs.existsSync(filePath)) {
    workbook = xlsx.readFile(filePath);
  } else {
    workbook = xlsx.utils.book_new();
  }

  // Determine the last sheet number
  let sheetCounter = 0;
  if (workbook.SheetNames.length > 0) {
    const lastSheetName = workbook.SheetNames[workbook.SheetNames.length - 1];
    const match = lastSheetName.match(/Sheet(\d+)/);
    if (match) {
      sheetCounter = parseInt(match[1], 10);
    }
  }

  // Increment the counter for the new sheet
  sheetCounter++;
  const newSheetName = `Sheet${sheetCounter}`;

  // Create a new sheet from the data provided
  const worksheet = xlsx.utils.json_to_sheet(data);

  // Add the new sheet to the workbook
  xlsx.utils.book_append_sheet(workbook, worksheet, newSheetName);

  // Save the workbook
  xlsx.writeFile(workbook, filePath);

  console.log(`Sheet "${newSheetName}" has been added to ${filePath}`);
}

module.exports = saveToExcel;
