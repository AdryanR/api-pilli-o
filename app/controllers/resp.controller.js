const db = require("../models");

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
    nome: req.body.nome,
    login: req.body.login,
    firebaseUserUid: req.body.firebaseUserUid
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