module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    email2: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    birthdate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    documentType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    medic: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
  })

  return User
}
