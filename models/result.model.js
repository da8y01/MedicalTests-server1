module.exports = (sequelize, Sequelize) => {
  const Result = sequelize.define('result', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    link: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    // patient: {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    // },
    // reading: {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    // },
  })

  return Result
}
