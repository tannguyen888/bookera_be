const mysql = require("mysql2/promise");
const { config } = require("dotenv");
config();

// Create the connection pool. The pool-specific settings are the defaults
const connection = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
  password: process.env.MYSQL_PASSWORD,
  waitForConnections: true,
  connectionLimit: 100,
  maxIdle: 100, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

module.exports = {
  connection,
};
