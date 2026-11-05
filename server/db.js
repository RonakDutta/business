const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const pg = require("pg");

pg.types.setTypeParser(1082, (value) => value);

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
