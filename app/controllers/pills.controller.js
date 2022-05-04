const db = require("../models");
const Pills = db.pills;
const Disparos = db.disparo;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.nomeRemedio) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const pills = {
    nomeRemedio: req.body.nomeRemedio,
    dataInicio: req.body.dataInicio,
    horaInicio: req.body.horaInicio,
    qtdeVezesRepetir: req.body.qtdeVezesRepetir,
    repetirEmQuantasHoras: req.body.repetirEmQuantasHoras,
    ativo:  req.body.ativo,
    excluido: req.body.excluido,
    idIdoso: req.body.ididoso
}

  Pills.create(pills)
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
  
  Pills.findAll()
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

exports.returnEsp = (req, res) => {
  
  Pills.findAll()
  .then(data => {
    const jsonData = JSON.parse(JSON.stringify(data))
    let ret = "Não"
    for (var i = 0; i < jsonData.length; i++) {
      let dataFinal = jsonData[i].dataInicio.substr(0, 11) + jsonData[i].horaInicio
      let dataPills = new Date(dataFinal)
      let dataAtual = new Date()
      dataPills.setSeconds(0)
      dataPills.setMilliseconds(0)
      dataAtual.setSeconds(0)
      dataAtual.setMilliseconds(0)
      if(dataPills.toLocaleString() === dataAtual.toLocaleString() && (parseInt(jsonData[i].ativo) === 1)){
           ret = "Sim"
          this.AlterByDose(id = jsonData[i].id) // NÃO FUNCIONA DESSE JEITO SOMENTE PELA ROTA...
           break
      }     
   }
    res.send([{message: ret}])
    // AlterByDose(id = jsonData[i].id)
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving pills."
    });
  });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Pills.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Agenda was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Agenda with id=${id}. Maybe Agenda was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Agenda with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Pills.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Agenda was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Agenda with id=${id}. Maybe Agenda was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Agennda with id=" + id
      });
    });
};

exports.AlterByDose = (req, res, id) => {  // para atualizar qtde de remédios e desativar o alarme caso tenha acabado...
 console.log(id)
  return Pills.findByPk(id)
  .then((alarme) => {

    if (!alarme) {
      console.log("Alarme não encontrado ou erro grave.");
      return null;
    }
      const dose = alarme.qtdeVezesRepetir-1;
      if (dose === 0) {
        alarme.ativo = 0;
        alarme.qtdeVezesRepetir = dose;

      } else {
        alarme.qtdeVezesRepetir = dose;
      }
    
      alarme.save();
      res.status(200).send({
        //  message: "Dose alterada!"
      });
})
};

// talvez refatorar essa funcao para reutilizar ela pra criar os disparos, usar parametros...

exports.CreateOneDisparoByAlarme = (req, res) => {  // criar o PRIMEIRO disparo para um novo alarme definido...
  const id = req.params.id;

  return Pills.findByPk(id)
  .then((alarme) => {

    if (!alarme) {
      console.log("Alarme não encontrado ou erro grave.");
      return null;
    }

    Disparos.create({
      dataDisparo: alarme.dataInicio,
      horaDisparo: alarme.horaInicio,
      tomouRemedio: 0,
      idAlarme : alarme.id,
    })

  })
}

//(req, res, data, hora)
exports.CreateProximoDisparo = (req, res) => {
  let idAlarme = 14;
  let data = "2022-05-03T00:00:00.000Z"
  let hora = "14:41:00"
  let dataFinal = data.substr(0, 11) + hora
  let dataPills = new Date(dataFinal) 
  let proximaData = new Date()
  
  proximaData.setHours(dataPills.getHours() + 24); 

  let DateText = proximaData.toString();
  
  let PHora = DateText.substr(0, 10)
  let PData = DateText.substr(10, 17)

      res.status(200).send({
        message: dataPills
      });

    Disparos.create({
      dataDisparo: PHora,
      horaDisparo: PData,
      tomouRemedio: 0,
      idAlarme : idAlarme,
    })

 

}

