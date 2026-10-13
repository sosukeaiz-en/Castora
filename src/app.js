const express = require("express");


const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "StreamYard backend is running",
  });
});

module.exports = app;