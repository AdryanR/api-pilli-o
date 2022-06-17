const db = require("../models");

const Idoso = db.Idoso;
const Pills = db.pills;
const Responsavel = db.responsavel;
const Maquinas = db.machines;

exports.create = async (req, res) => {
  // Validate request
  if (!req.body.login) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  let qtdePadraoCompartimentos = 15;

  let idMaq = await CreateMaquina(
    req.body.codigoMaquina,
    req.body.qtdeCompartimentos || qtdePadraoCompartimentos
  );

  const idoso = {
    nome: req.body.nome,
    login: req.body.login,
    firebaseUserUid: req.body.firebaseUserUid,
    idMachine: idMaq,
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

async function CreateMaquina(codigoMaquina, qtdeCompartimentos) {
  let createMaq = await db.sequelize.query('INSERT INTO Maquinas (codigoMaquina, qtdeCompartimentos) values (:id, :qtdeCompartimentos)', {
    replacements: { id: codigoMaquina, qtdeCompartimentos: qtdeCompartimentos },
    type: db.sequelize.QueryTypes.INSERT
  });

  return createMaq[0];
}

exports.findAllByIdoso = (req, res) => {
  // notificar();

  const id = req.params.id;

  Idoso.findAll({
    where: { id: id },
    include: {
      model: Maquinas,
      as: 'maquinas',
      model: Responsavel,
      as: 'responsavel',
      model: Pills,
      as: 'alarmes',
      where: {
        excluido: 0
      },
    }
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

function notificar() {
  const mensagem = JSON.stringify({
    "message": {
      "token": "eEz-Q2sG8nQ:APA91bHJQRT0JJ...",
      "notification": {
        "title": "Título Mensagem Teste",
        "body": "Conteúdo Mensagem Teste",
        "icon": "favicon.ico"
      },
      "webpush": {
        "fcm_options": {
          "link": "https://webclient-pillio.herokuapp.com/#/"
        }
      }
    }
  });

  fetch()
}
