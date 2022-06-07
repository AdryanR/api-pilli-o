module.exports = (sequelize, Sequelize) => {
  const Machines = sequelize.define("Maquinas", {
    codigoMaquina: {
      type: Sequelize.STRING
    },
  });

  return Machines;
};
