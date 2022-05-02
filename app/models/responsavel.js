module.exports = (sequelize, Sequelize) => {

  const LoginResp = sequelize.define("Responsavel", {
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


  return LoginResp;
};
