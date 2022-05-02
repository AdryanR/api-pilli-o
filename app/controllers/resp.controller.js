const db = require("../models");
const bcrypt = require("bcrypt");

const Responsavel = db.responsavel;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.login) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  
  const responsavel = {
    login: req.body.login,
    senha: req.body.senha,
    nome: req.body.nome
}

  Responsavel.create(responsavel)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Pills."
      });
    });
};

exports.findAll = (req, res) => {
  
  Responsavel.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving pills."
      });
    });
};

exports.auth = (req, res) => {
   user = Responsavel.findOne({ where : {login : req.body.login }})
   .then(user => {
  if(user){
      //  const password_valid = await bcrypt.compare(req.body.password,user.password);
      if(req.body.senha === user.senha){
        res.status(200).send({
          id: user.id
        });
      } else {
        res.status(400).json({ error : "Password Incorrect"});
      }
   
   }else{
     res.status(404).json({ error : "User does not exist!" });
   }
  })
  
   };

  exports.findIdosoByResp = (req, res) => {
    const id = req.params.id;

    Responsavel.findAll({
      where: { id: id },
      include: ["idosos"]
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving pills."
        });
      });
  };