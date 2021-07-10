const puppeteer = require("puppeteer");
const args = process.argv.slice(2);
const arg = args[0];

if (!args.length || !arg) {
  console.error("No argument is provided!");
  process.exit();
}

(async function main() {
  try {
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();

    // Load page
    await page.goto("https://codequiz.azurewebsites.net/", {
      waitUntil: "networkidle0",
    });

    // Click accept button
    await page.$eval("input[type=button]", (btn) => btn.click());

    // Wait for table to load
    await page.waitForSelector("table");

    // Get table data
    const tableData = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll("table tr td"));
      return tds.map((td) => td.innerText);
    });

    // Check if arg is in table data
    if (!tableData.includes(arg)) {
      console.error(`Invalid argument. No fund name '${arg}' found.`);
      process.exit();
    }

    // Get index of fund name
    const index = tableData.indexOf(arg);

    // Get value of NAV
    const nav = tableData[index + 1];

    // Print out NAV
    console.log(nav);

    // Close browser and exit
    await browser.close();
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
})();
