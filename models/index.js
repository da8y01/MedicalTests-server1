const dbConfig = require("../config/db.config.js")

const Sequelize = require("sequelize")

const options = {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
}

let sequelize
if (dbConfig.use_env_variable)
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], options)
else
  sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, options)

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.results = require("./result.model.js")(sequelize, Sequelize)

module.exports = db