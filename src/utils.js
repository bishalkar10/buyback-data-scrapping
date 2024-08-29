function removeDot(text) {
  if (text.length === 0) return "";

  if (text.at(-1) === ".") {
    text = text.slice(0, text.length - 1);
  }
  return text;
}

function filterLinks(item) {
  // if recordDate is an empty string, it means the record date is not announced yet
  if (!item.recordDate) {
    return true;
  }

  return new Date(item.recordDate) >= new Date(); // Compare the recordDate with the current date
}

async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

async function fetchHTML(url) {
  const response = await fetch(url);
  return response.text();
}

async function getShareholderHTML(name) {
  try {
    name = removeDot(name); // Remove trailing dot from name
    let body = await fetchData(
      `https://www.screener.in/api/company/search/?q=${name}`,
    );

    // Check if the body contains any results and if the URL exists
    if (!body || !body.length || !body[0].url) {
      console.log(`No URL found for ${name}`);
      return null; // Return null if no valid URL is found
    }
    var companyURL = body[0].url;
    return await fetchHTML(`https://www.screener.in${companyURL}`);
  } catch (error) {
    console.log(
      `Error fetching shareholder numbers for ${name}:`,
      error.message,
    );
    return null; // Return null if an error occurs
  }
}

module.exports = {
  removeDot,
  filterLinks,
  fetchData,
  fetchHTML,
  getShareholderHTML,
};
