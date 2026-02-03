const express = require("express");
const { config } = require("dotenv");
const { apiRoutes } = require("./routes/API_routes");
const { configCORS } = require("./config/cors");
const cookieParser = require("cookie-parser");
const { connectSequelize } = require("./config/sequelize_db_orm");
config();


const app = express();
const port = process.env.BOOKERA_BE_PORT || 8080;
const hostname = process.env.BOOKERA_BE_HOSTNAME || 'localhost';
const logger = require('./lib/logger');

configCORS(app);

// config body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config cookie-parser
app.use(cookieParser());

// Testing Sequelize connectionnnn

// Routes — mount under both /api and root to be compatible with frontend baseURL variations
app.use("/api", apiRoutes);
app.use("/", apiRoutes);

connectSequelize();

app.listen(port, () => {
  logger.info(`Example app listening on http://${hostname}:${port}`);
});
