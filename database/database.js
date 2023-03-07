const Sequelize = require('sequelize');

const {DB_DATABASE, DB_USER, DB_PASSWORD} = process.env;

const connection = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  timezone: '-03:00'
});

module.exports = connection;
