module.exports = (sequelize, Sequelize) => {
  const Machines = sequelize.define("Maquinas", {
    id_maq: {
      type: Sequelize.STRING
    },
  });

  return Machines;
};
