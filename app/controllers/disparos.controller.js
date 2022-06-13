const db = require("../models");

const Disparo = db.disparo;
const Alarme = db.pills;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.dataDisparo) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const disparo = {
    dataDisparo: req.body.dataDisparo,
    horaDisparo: req.body.horaDisparo,
    tomouRemedio: req.body.tomouRemedio,
    compartimento: req.body.compartimento,
    idAlarme: req.body.idAlarme,
  }

  Disparo.create(disparo)
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

//   Historico.findAll()
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

exports.update = (req, res) => {
  const id = req.params.id;

  Disparo.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Disparo was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Agenda with id=${id}. Maybe Agenda was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Disparo with id=" + id
      });
    });
};

exports.findAlarmeDisparosByIddoso = (req, res) => {
  const id = req.params.id;

  Alarme.findAll({
    where: { idIdoso: id, excluido: 0 },
    include: ["disparos"]
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
