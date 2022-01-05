const configOptions = {
  development: {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "postgres",
    DB: "postgres",
    dialect: "postgres",
    dialectOptions: {
      ssl: false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    }
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    }
  }
}

const config = process.env.NODE_ENV === 'production' ? configOptions.production : configOptions.development
module.exports = config
