const configOptions = {
  development: {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_DATABASE,
    dialect: "postgres",
    dialectOptions: {
      ssl: false,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false
      // }
      ssl: false,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};

const config =
  process.env.NODE_ENV === "production"
    ? configOptions.production
    : configOptions.development;
module.exports = config;
