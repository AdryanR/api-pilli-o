
module.exports = (sequelize, Sequelize) => {
  const Idoso = sequelize.define("Idoso", {
    login: {
      type: Sequelize.STRING
    },
    senha: {
      type: Sequelize.STRING
    },
    nome: {
      type: Sequelize.STRING
    },
    
  });

  return Idoso;
};
