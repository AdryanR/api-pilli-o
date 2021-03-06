module.exports = (sequelize, Sequelize) => {
  const Pills = sequelize.define("AGENDA", {
    nomeRemedio: {
      type: Sequelize.STRING
    },
    qtdeVezesRepetir: {
      type: Sequelize.INTEGER
    },
    dataInicio: {
      type: Sequelize.DATE
    },
    horaInicio: {
      type: Sequelize.TIME
    },
    repetirEmQuantasHoras: {
      type: Sequelize.INTEGER
    },
    qtdeComprimidosPorDose: {
      type: Sequelize.INTEGER
    },
    ativo: {
      type: Sequelize.INTEGER
    },
    excluido: {
      type: Sequelize.INTEGER
    },
    compartimentos: {
      type: Sequelize.STRING
    }
  });

  return Pills;
};
