module.exports = (sequelize, Sequelize) => {
  const MaquinaResp = sequelize.define("MaquinaResp", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    }
  });

  return MaquinaResp;
};
