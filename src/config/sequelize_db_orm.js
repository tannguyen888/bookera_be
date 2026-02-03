const { Sequelize } = require("sequelize");
const { config } = require("dotenv");
const logger = require('../lib/logger');
config();

const requiredEnv = ['MYSQL_DATABASE', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_HOST', 'MYSQL_PORT'];
const missing = requiredEnv.filter((v) => !process.env[v]);
if (missing.length) {
  logger.warn('Missing required env vars for DB connection:', missing.join(', '));
}

let sequelize = new Sequelize(
  String(process.env.MYSQL_DATABASE || ''),
  String(process.env.MYSQL_USER || ''),
  String(process.env.MYSQL_PASSWORD || ''),
  {
    host: String(process.env.MYSQL_HOST || 'localhost'),
    port: Number(process.env.MYSQL_PORT || 3306),
    dialect: "mysql",
    logging: (msg) => logger.debug(msg),
  },
);

const connectSequelize = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Connection has been established successfully (MySQL).');
  } catch (error) {
    if (error && error.original && error.original.sqlMessage) {
      logger.error('DB error:', error.original.sqlMessage);
    } else {
      logger.error('Unable to connect to the database:', error && error.message ? error.message : error);
    }

    // Fallback to in-memory sqlite for local development so server can start
    try {
      logger.warn('Falling back to SQLite in-memory for development/testing.');
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: (msg) => logger.debug(msg),
      });
      await sequelize.authenticate();
      logger.info('Fallback SQLite in-memory connection ready.');
    } catch (sqliteErr) {
      logger.error('Fallback to SQLite failed:', sqliteErr && sqliteErr.message ? sqliteErr.message : sqliteErr);
    }
  }
};

module.exports = {
  connectSequelize,
  sequelizeGetter: () => sequelize,
};
