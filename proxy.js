import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 4000;

// In-memory cache
let cache = {};

// Proxy route for the latest ballooins position: http://localhost:4000/balloons/00
app.get("/balloons/:hour", async (req, res) => {
  const hour = req.params.hour.padStart(2, "0");

  // If cached and less than 10 minutes old → serve cache
  if (cache[hour] && Date.now() - cache[hour].timestamp < 10 * 60 * 1000) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.json(cache[hour].data);
  }

  const url = `https://a.windbornesystems.com/treasure/${hour}.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Remote fetch failed" });
    }

    const data = await response.json();

    // Save to cache
    cache[hour] = {
      data,
      timestamp: Date.now()
    };

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
