const db = require("../models");
const Idoso = db.Idoso;

const Responsavel = db.responsavel;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.login) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    const qtdePadraoCompartimentos = 15;

    const idoso = {
      firebaseUserUid: req.body.idosos[0]?.firebaseUserUid,
      codigoAcesso: req.body.idosos[0]?.codigoAcesso,
      nome: req.body.idosos[0]?.nome,
      login: req.body.idosos[0]?.login,
      telefone: req.body.idosos[0]?.telefone,
      codigoMaquina: req.body.idosos[0]?.codigoMaquina,
      qtdeCompartimentos: req.body.idosos[0]?.qtdeCompartimentos || qtdePadraoCompartimentos
    }
    let idMaq = await CreateMaquina(idoso.codigoMaquina, idoso.qtdeCompartimentos);
    
    const responsavel = {
      nome: req.body.nome,
      login: req.body.login,
      firebaseUserUid: req.body.firebaseUserUid,
    }

    Responsavel.create(responsavel)
      .then(async data => {
        await CreateIdoso(idoso, data.id, idMaq)
        console.log(data)
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Pills."
        });
      });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

async function CreateMaquina(codigoMaquina, qtdeCompartimentos) {
  let createMaq = await db.sequelize.query('INSERT INTO Maquinas (codigoMaquina, qtdeCompartimentos) values (:id, :qtdeCompartimentos)', {
    replacements: { id: codigoMaquina, qtdeCompartimentos: qtdeCompartimentos },
    type: db.sequelize.QueryTypes.INSERT
  });

  return createMaq[0];
}

async function CreateIdoso(idoso, idResp, idMaq) {
  try {
    let createIdoso = await db.sequelize.query(
      // 'INSERT INTO Idosos (nome, login, firebaseUserUid, codigoAcesso, idResp, idMachine) ' +
      // 'values (:nome, :login, :firebaseUserUid, :codigoAcesso, :idResp, :idMaq)',
      'INSERT INTO Idosos (nome, login, firebaseUserUid, codigoAcesso, idResp, idMachine) ' +
      'values (:nome, :login, :firebaseUserUid, :codigoAcesso, :idResp, :idMaq)',
      {
        replacements: {
          nome: idoso.nome,
          login: idoso.login,
          firebaseUserUid: idoso.firebaseUserUid,
           codigoAcesso: idoso.codigoAcesso,
          idResp: idResp,
          idMaq: idMaq,
        },
        type: db.sequelize.QueryTypes.INSERT
      },
    );
  } catch (error) {
    console.log(error);
  }
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


exports.findIdosoByResp = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Idoso.findAll({
      raw: true,
      nest: true,
      where: { idResp: id },
      include: ["maquinas"]
    });

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};