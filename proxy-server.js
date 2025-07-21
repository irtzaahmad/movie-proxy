// Load dependencies
const express = require("express");
const request = require("request");
const cors = require("cors");

// App setup
const app = express();
const PORT = 3000; // 👈 Apni marzi se port change kar sakte ho

app.use(cors()); // Allow all origins

// Route for proxy streaming
app.get("/stream", (req, res) => {
    const videoUrl = req.query.url;

    // If no URL provided
    if (!videoUrl) {
        return res.status(400).send("❌ Error: 'url' parameter missing");
    }

    // ⛔ Make sure URL is valid!
    if (!videoUrl.startsWith("http")) {
        return res.status(400).send("❌ Error: Invalid URL");
    }

    // Custom headers to bypass 403 forbidden
    const headers = {
        "Referer": "https://moviebox.ng",  // 👈 FAKE Referer
        "Origin": "https://moviebox.ng",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    };

    // Pipe the video stream to the frontend
    request({ url: videoUrl, headers: headers })
        .on('error', (err) => {
            res.status(500).send("🔥 Proxy Error: " + err.message);
        })
        .pipe(res);
});

// Start the proxy server
app.listen(PORT, () => {
    console.log(`✅ Proxy server running at: http://localhost:${PORT}`);
});