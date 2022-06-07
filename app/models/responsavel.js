module.exports = (sequelize, Sequelize) => {

  const LoginResp = sequelize.define("Responsavel", {
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


  return LoginResp;
};
