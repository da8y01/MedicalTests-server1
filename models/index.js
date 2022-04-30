const dbConfig = require('../config/db.config.js')

const Sequelize = require('sequelize')

const options = {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.dialectOptions,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
}

let sequelize
if (dbConfig.use_env_variable)
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], options)
else
  sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    options
  )

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.results = require('./result.model.js')(sequelize, Sequelize)
db.readings = require('./reading.model.js')(sequelize, Sequelize)
db.user = require('./user.model.js')(sequelize, Sequelize)
db.role = require('./role.model.js')(sequelize, Sequelize)

db.role.belongsToMany(db.user, {
  through: 'user_roles',
  foreignKey: 'roleId',
  otherKey: 'userId',
})
db.user.belongsToMany(db.role, {
  through: 'user_roles',
  foreignKey: 'userId',
  otherKey: 'roleId',
})

db.user.hasMany(db.results, { as: 'results' })
db.results.belongsTo(db.user, {
  foreignKey: 'userId',
  as: 'user',
})

db.results.hasOne(db.readings)

db.ROLES = ['patient', 'admin', 'medic', 'reader']

module.exports = db
