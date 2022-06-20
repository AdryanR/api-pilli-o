module.exports = (sequelize, Sequelize) => {
  const Machines = sequelize.define("Maquinas", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigoMaquina: {
      type: Sequelize.STRING
    },
    qtdeCompartimentos: {
      type: Sequelize.INTEGER
    },
    nomeRedeWifiConectada: {
      type: Sequelize.STRING
    },
  });

  return Machines;
};
