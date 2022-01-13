module.exports = (sequelize, Sequelize) => {
    const Result = sequelize.define("result", {
      name: {
        type: Sequelize.STRING
      },
      link: {
        type: Sequelize.STRING
      },
      patient: {
        type: Sequelize.INTEGER
      }
    })
  
    return Result
}