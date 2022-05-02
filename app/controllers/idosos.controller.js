const db = require("../models");
const bcrypt = require("bcrypt");

const Idoso = db.Idoso;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.login) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  
  const idoso = {
    login: req.body.login,
    senha: req.body.senha,
    nome: req.body.nome,
    idMachine : req.body.idmachine,
    idResp : req.body.idresp
}

  Idoso.create(idoso)
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
   user = Idoso.findOne({ where : {login : req.body.login }})
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


  exports.findAllByIdoso = (req, res) => {
    const id = req.params.id;

    Idoso.findAll({
      where: { id: id },
      include: ["responsavel","maquinas","alarmes"]
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
