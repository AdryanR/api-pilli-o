const db = require("../models");

const Responsavel = db.responsavel;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
  // Validate request
  if (!req.body.login) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const idoso = {
    nome: req.body.idosos.nome,
    telefone: req.body.idosos.telefone,
    codigoMaquina: req.body.idosos.codigoMaquina,
    qtdeCompartimentos: req.body.idosos.qtdeCompartimentos
  }
  let idMaq = await CreateMaquina(idoso.codigoMaquina, idoso.qtdeCompartimentos);
  const responsavel = {
    nome: req.body.nome,
    login: req.body.login,
    firebaseUserUid: req.body.firebaseUserUid,
  }

  Responsavel.create(responsavel)
    .then(data => {
      res.send(data);
      CreateIdoso(idoso, data.id, idMaq)
      console.log(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Pills."
      });
    });
};

async function CreateMaquina(codigoMaquina, qtdeCompartimentos) {
  let createMaq = await db.sequelize.query('INSERT INTO Maquinas (codigoMaquina, qtdeCompartimentos) values (:id, :qtdeCompartimentos)', {
    replacements: { id: codigoMaquina, qtdeCompartimentos: qtdeCompartimentos },
    type: db.sequelize.QueryTypes.INSERT
  });

  return createMaq[0];
}

async function CreateIdoso(idoso, idResp, idMaq) {
  let createIdoso = await db.sequelize.query('INSERT INTO Idosos (nome, idResp, idMachine) values (:nome, :idResp, :idMaq)', {
    replacements: { nome: idoso.nome, idResp: idResp, idMaq: idMaq },
    type: db.sequelize.QueryTypes.INSERT
  });
}

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