const mysql = require('mysql2/promise');

(async () => {
  const config = {
    host: '127.0.0.1',
    port: 3306,
    user: 'bookera',
    password: 'lab123',
    database: 'bookera_database',
  };

  try {
    const conn = await mysql.createConnection(config);
    console.log('Connected to MySQL as', config.user);
    const [rows] = await conn.query('SHOW TABLES;');
    console.log('Tables:', rows.slice(0, 20));
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:');
    console.error(err.code || err.name, '-', err.message);
    if (err.sqlMessage) console.error('sqlMessage:', err.sqlMessage);
    process.exit(1);
  }
})();
