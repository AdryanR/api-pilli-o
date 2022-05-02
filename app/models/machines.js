module.exports = (sequelize, Sequelize) => {
  const Machines = sequelize.define("Maquinas", {
    id_maq: {
      type: Sequelize.INTEGER
    },
  });

  return Machines;
};
