
module.exports = (sequelize, Sequelize) => {
  const Idoso = sequelize.define("Idoso", {
    nome: {
      type: Sequelize.STRING
    },
    login : {
      type: Sequelize.STRING
    },
    firebaseUserUid: {
      type: Sequelize.STRING
    }
    
  });

  return Idoso;
};
