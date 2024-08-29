# Buyback Details Scraper

## Overview

This project is a Node.js application designed to scrape buyback details and shareholder information from a financial website. The data is collected and stored in an Excel file, with each run of the script creating a new sheet in the Excel file.

## Features

- Scrapes buyback details and shareholder numbers for various companies.
- Automatically filters companies based on the record date.
- Saves the collected data into an Excel file with incrementing sheet names.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/bishalkar10/buyback-data-scrapping
   cd buyback-scraper

2. **Install dependencies:**

    ```bash
    npm install
    ```

## Usage

1. **Configure the script:**

    Ensure your `index.js` and `excel.js` files are properly configured according to your needs.

2. **Run the scraper:**

    ```bash
    node index.js
    ```

    This will run the script, fetch the buyback details, and save them into an Excel file.

3. **Generated Excel File:**

    The script will save the output to `output.xlsx`, with each new run adding a new sheet (`Sheet1`, `Sheet2`, etc.) to the file.

## Error Handling

The script is designed to continue processing even if some requests fail. Errors will be logged to the console, and the script will proceed with the next available data.

## Acknowledgements

- Thanks to the Screener API for providing the necessary data.
- Shoutout to the Node.js and JavaScript communities for their invaluable resources.
