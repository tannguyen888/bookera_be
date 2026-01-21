const express = require("express");

const apiRoutes = express.Router();

apiRoutes.get("/status", async (req, res) => {
  res.json({ status: "API is running" });
});

module.exports = {
  apiRoutes,
};
