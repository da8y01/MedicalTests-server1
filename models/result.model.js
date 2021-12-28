module.exports = (sequelize, Sequelize) => {
    const Result = sequelize.define("result", {
      status: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      patient: {
        type: Sequelize.INTEGER
      }
    })
  
    return Result
}