import express from "express";
import { chromium, firefox } from "playwright";
import cors from "cors";
import { scrapeListings } from "./src/utils/scraper.js";

const app = express();
const PORT = 5001;

app.use(cors());

app.get("/scrape", async (req, res) => {
  let browser;
  const { browserType } = req.query;  // Get browser type from query (either 'chromium' or 'firefox')

  try {
    if (browserType === "firefox") {
      browser = await firefox.launch();  // Launch Firefox
    } else {
      browser = await chromium.launch();  // Default to Chromium
    }

    const listings = await scrapeListings({ browser, retryCount: 3 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Scraper server running on http://localhost:${PORT}`);
});
