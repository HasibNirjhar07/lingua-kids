const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'linguakids_db',
  password: 'pgadmin',
  port: 5432,
});

module.exports = pool;
