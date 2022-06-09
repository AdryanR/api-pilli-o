module.exports = (sequelize, Sequelize) => {
  const Machines = sequelize.define("Maquinas", {
    codigoMaquina: {
      type: Sequelize.STRING
    },
    qtdeCompartimentos : {
      type: Sequelize.INTEGER
    },
  });

  return Machines;
};
