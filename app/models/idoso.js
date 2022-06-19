
module.exports = (sequelize, Sequelize) => {
  const Idoso = sequelize.define("Idoso", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    nome: {
      type: Sequelize.STRING
    },
    login : {
      type: Sequelize.STRING
    },
    codigoAcesso: {
      type: Sequelize.STRING
    },
    telefone: {
      type: Sequelize.STRING
    },
    firebaseUserUid: {
      type: Sequelize.STRING
    }
  });

  return Idoso;
};
