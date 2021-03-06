
module.exports = (sequelize, Sequelize) => {
  const Idoso = sequelize.define("Idoso", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    },
    idResp: {
      type: Sequelize.INTEGER
    }
  });

  return Idoso;
};
