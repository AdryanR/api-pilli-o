const db = require("../models");

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
    nome: req.body.nome,
    login: req.body.login,
    idMachine: req.body.idmachine,
    idResp: req.body.idresp,
    firebaseUserUid: req.body.firebaseUserUid
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

// exports.findAll = (req, res) => {

//   Idoso.findAll()
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving pills."
//       });
//     });
// };


exports.findAllByIdoso = (req, res) => {
  const id = req.params.id;

  Idoso.findAll({
    where: { id: id },
    include: ["responsavel", "maquinas", "alarmes"]
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
