const cheerio = require("cheerio"); // Import cheerio

function scrapeLinks(htmlText) {
  const $ = cheerio.load(htmlText); // Load the HTML text into cheerio
  const table = $(".table.table-bordered.table-striped.table-hover.w-auto");
  // Select the rows inside the table body
  const rows = table.find("tbody tr");
  if (rows.length === 0) {
    console.log("No rows found. Check your selector or the HTML structure.");
    return;
  }
  const links = [];
  // Iterate through each row and extract data
  rows.each((index, row) => {
    // Extract the first table data (td) in the row
    const firstTd = $(row).find("td").first();
    const name = firstTd.text().trim(); // Get text content

    // Extract the link (href) if it exists
    const link = firstTd.find("a").attr("href") || "";

    const recordDate = $(row).find("td").eq(1).text().trim();
    links.push({ name: name, link: link, recordDate: recordDate });
  });
  return links;
}

async function scrapeBuybackDetailsPage(htmlText) {
  const $ = cheerio.load(htmlText);

  const tableOne = $(".table.table-bordered.table-striped.w-auto").eq(0);
  const tableTwo = $(".table.table-bordered.table-striped.w-auto").eq(1);
  const data = {};
  const columns = [
    "Issue Period",
    "Security Name",
    "Issue Size (Shares)",
    "Issue Size (Amount)",
    "Buyback Price",
    "Number of Shareholders",
    "Record Date",
    "Offer Opens On",
    "Offer Closes On *",
  ];

  tableOne.find("tr").each((_, row) => {
    const key = $(row).find("td").first().text().trim();
    let value = $(row).find("td").eq(1).text().trim() || "Not available yet"; // the second field can be empty

    if (columns.includes(key)) {
      if (key === "Issue Size (Shares)") {
        value = parseInt(value.replace(/[^\d]/g, ""));
      }
      data[key] = value;
    }
  });

  tableTwo.find("tr").each((_, row) => {
    const key = $(row).find("td").first().text().trim();
    const value = $(row).find("td").eq(1).text().trim() || "Not available yet"; // the second field can be empty
    if (columns.includes(key)) {
      data[key] = value;
    }
  });

  // 15% of Issued buyback shares will be accepted from retail investers
  data["15% of Issue size"] = data["Issue Size (Shares)"] * (15 / 100);
  return data;
}

async function scrapeShareholderPage(htmlText) {
  if (!htmlText) return "Not available";

  const $ = cheerio.load(htmlText);
  const shareholdingTableBody = $("#shareholding table.data-table tbody");
  const shareholderNumbers = shareholdingTableBody
    .find("tr.sub td")
    .last()
    .text();

  return parseInt(shareholderNumbers.replace(/[^\d]/g, "")) || "Not available";
}

module.exports = {
  scrapeLinks,
  scrapeBuybackDetailsPage,
  scrapeShareholderPage,
};
