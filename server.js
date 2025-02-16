const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,  'index.html'));
});

// Route to receive form data
app.post("/submit", async (req, res) => {
  console.log("Received Data:", req.body);
  
  try {
    const fetch = (await import('node-fetch')).default;
    // Forward data to backend API
    fetch("http://localhost:5000/api/chefs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    })
    .then(apiResponse => {
      if (!apiResponse.ok) {
        throw new Error('Backend API error');
      }
      return apiResponse.json();
    })
    .then(data => {
      res.status(200).json({
        message: "Data received and forwarded successfully",
        receivedData: req.body,
        apiResponse: data
      });
    })
    .catch(error => {
      console.error("Error forwarding data:", error);
      res.status(500).json({
        message: "Error forwarding data to backend API",
        error: error.message
      });
    });
  } catch (error) {
    console.error("Error importing node-fetch:", error);
    res.status(500).json({
      message: "Error importing node-fetch",
      error: error.message
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
