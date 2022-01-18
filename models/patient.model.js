module.exports = (sequelize, Sequelize) => {
    const Patient = sequelize.define("patient", {
      document: {
        type: Sequelize.STRING,
        allowNull: false
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      }
    })
  
    return Patient
}