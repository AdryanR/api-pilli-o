module.exports = (sequelize, Sequelize) => {
  const Disparo = sequelize.define("DisparoAgenda", {
    dataDisparo: {
      type: Sequelize.DATE
    },
    horaDisparo: {
      type: Sequelize.TIME
    },
    tomouRemedio: {
      type: Sequelize.INTEGER
    }
  });

  return Disparo;
};
