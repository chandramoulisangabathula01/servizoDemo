const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Update the backend URL
const BACKEND_BASE_URL = 'https://servizobackend.onrender.com';

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
    const backendUrl = `${BACKEND_BASE_URL}/api/chefs`;
    console.log('Forwarding to:', backendUrl); // Add this for debugging
    
    const apiResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const responseData = await apiResponse.json();
    
    if (!apiResponse.ok) {
      console.error("Backend API error:", responseData);
      throw new Error(responseData.message || 'Backend API error');
    }

    res.status(200).json({
      message: "Data received and forwarded successfully",
      receivedData: req.body,
      apiResponse: responseData
    });
  } catch (error) {
    console.error("Error forwarding data:", error);
    res.status(500).json({
      message: "Error forwarding data to backend API",
      error: error.message
    });
  }
});

// Route to handle newsletter subscriptions
app.post('/api/newsletter', async (req, res) => {
  try {
      const fetch = (await import('node-fetch')).default;
      const response = await fetch(`${BACKEND_BASE_URL}/api/newsletter`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(req.body)
      });

      const data = await response.json();
      res.status(response.status).json(data);
  } catch (error) {
      console.error('Error forwarding newsletter subscription:', error);
      res.status(500).json({ success: false, message: 'Error forwarding subscription' });
  }
});

// Route to handle cookie preferences
app.post('/api/cookies/preferences', async (req, res) => {
    try {
        const { sessionId, accepted, preferences } = req.body;
        // Save preferences to database or perform necessary actions
        console.log('Received cookie preferences:', { sessionId, accepted, preferences });
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error saving cookie preferences:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
