module.exports = (sequelize, Sequelize) => {
  const Machines = sequelize.define("MAQUINA", {
    id_maq: {
      type: Sequelize.INTEGER
    }
  });

  return Machines;
};
