module.exports = (sequelize, Sequelize) => {
  const Reading = sequelize.define('reading', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    link: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    // result: {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    // },
  })

  return Reading
}
