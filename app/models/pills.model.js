module.exports = (sequelize, Sequelize) => {
  const Pills = sequelize.define("AGENDA", {
    data: {
      type: Sequelize.DATE
    },
    hora: {
      type: Sequelize.TIME
    },
    repetir: {
      type: Sequelize.INTEGER
    },
    status: {
      type: Sequelize.INTEGER
    }
  });

  return Pills;
};
