const express = require("express");
const puppeteer = require("puppeteer");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

const WEBHOOK_URL = "https://n8n-fk9q.onrender.com/webhook-test/receive-post";

app.get("/", async (req, res) => {
  console.log("🔁 Trigger received. Scraping...");

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    );

    await page.goto("https://truthsocial.com/@xai711", {
      waitUntil: "networkidle2",
    });

    // ⏱ Wait for posts to load (Puppeteer doesn't have waitForTimeout)
    await new Promise(resolve => setTimeout(resolve, 8000));

    const latestPost = await page.evaluate(() => {
      const postElement = document.querySelector(
        ".status__wrapper .status__content-wrapper p"
      );
      return postElement ? postElement.innerText.trim() : "⚠️ No post found!";
    });

    await browser.close();

    console.log("✅ Latest post:", latestPost);

    if (!latestPost.startsWith("⚠️")) {
      const response = await axios.post(WEBHOOK_URL, { post: latestPost });
      console.log("✅ Sent to n8n:", response.status);
      res.json({ status: "Sent to n8n", post: latestPost });
    } else {
      res.json({ status: "No post found" });
    }
  } catch (err) {
    console.error("❌ Scraping failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
