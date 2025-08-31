import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 4000;

// Proxy route: http://localhost:4000/balloons/00
app.get("/balloons/:hour", async (req, res) => {
  const hour = req.params.hour.padStart(2, "0");
  const url = `https://a.windbornesystems.com/treasure/${hour}.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Remote fetch failed" });
    }
    const data = await response.json();

    // Allow browser access
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
