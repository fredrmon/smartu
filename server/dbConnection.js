const mysql = require("mysql");

// Development only, move to env before prod
let connection = mysql.createPool({
  host: process.env.MARIADB_HOST_IP,
  user: "root",
  port: 3306,
  password: "password",
  database: "smartu",
  connectionLimit: 4,
});

// Timeout to wait for DB to init when using Docker
setTimeout(() => {
  connection.getConnection((error) => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
  });
}, 20 * 1000);

module.exports = connection;
