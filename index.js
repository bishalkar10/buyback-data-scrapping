const saveToExcel = require("./src/excelHandler.js");
const {
  filterLinks,
  fetchHTML,
  getShareholderHTML,
} = require("./src/utils.js");

const {
  scrapeLinks,
  scrapeBuybackDetailsPage,
  scrapeShareholderPage,
} = require("./src/scraper.js");

// this function retrieves the links and name of the companies
async function getLinks() {
  const url =
    "https://www.chittorgarh.com/report/latest-buyback-issues-in-india/80/tender-offer-buyback/";

  const htmlText = await fetchHTML(url); // Fetch the HTML of the page
  return scrapeLinks(htmlText);
}

async function getBuybackDetails({ name, link }) {
  try {
    const [buybackdetailsPage, shareholderPage] = await Promise.all([
      fetchHTML(link),
      getShareholderHTML(name),
    ]);

    const buybackData = await scrapeBuybackDetailsPage(buybackdetailsPage);
    const shareholderNumbers = await scrapeShareholderPage(shareholderPage);

    // Add shareholder numbers to the buyback data
    buybackData["Number of Shareholders"] = shareholderNumbers;

    return buybackData;
  } catch (error) {
    console.log(`Error fetching buyback details for ${name}:`, error);
    return null; // Return null if an error occurs
  }
}

(async function getTable() {
  try {
    const links = await getLinks();
    const filteredLinks = links.filter(filterLinks);

    const table = await Promise.all(
      filteredLinks.map(async (link) => {
        try {
          return getBuybackDetails(link);
        } catch (error) {
          console.log(`Error processing link ${link}:`, error.message);
          return null;
        }
      }),
    );

    // Filter out null results and save the data to Excel
    saveToExcel(table.filter(Boolean));

    console.log("Excel file has been updated.");
  } catch (error) {
    console.log("Error fetching the table:", error);
    return []; // Return an empty array if the entire process fails
  }
})();
