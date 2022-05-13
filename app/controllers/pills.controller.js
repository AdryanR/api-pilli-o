const db = require("../models");
const Pills = db.pills;
const Disparos = db.disparo;
const Idosos = db.Idoso;
const Alarmes = db.pills;
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
    idIdoso: req.body.ididoso,
    compartimento: req.body.compartimento
}

  Pills.create(pills)
    .then(data => {
      res.send(data);
      PrimeiroDisparoByAlarme({id: data.id, dataInicio: pills.dataInicio, horaInicio: pills.horaInicio })
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

// recebe o código da máquina que vai verificar se há alarme...
exports.returnEsp = async (req, res) => {
 const maquina = req.params.maquina;
 const resultados = await buscaDisparosByMaquina(maquina)
 const jsonDisparo = JSON.parse(JSON.stringify(resultados));
 let ret = "Não"
 for (let disparo of jsonDisparo) {
    let dataFinal = disparo.dataDisparo.substr(0, 11) + disparo.horaDisparo
    let dataPills = new Date(dataFinal)
    let dataAtual = new Date()
    dataPills.setSeconds(0)
    dataPills.setMilliseconds(0)
    dataAtual.setSeconds(0)
    dataAtual.setMilliseconds(0)
    if(dataPills.toLocaleString() === dataAtual.toLocaleString()){
        // await FauxiliarAlarme(disparo.idAlarme, disparo.dataDisparo, disparo.horaDisparo)
        let compartimento = await FauxiliarAlarme(disparo.idAlarme, disparo.dataDisparo, disparo.horaDisparo)
        ret = "Disparar | " + disparo.id + " | " + compartimento
        break
    }     
 }
  res.send([{message: ret}])
  
};

async function buscaDisparosByMaquina(maquina) {
 let idoso = await Idosos.findOne({
  where: {
    idMachine: maquina
  }
  });

  let disparos = await db.sequelize.query('SELECT * FROM disparoagendas WHERE idAlarme IN (SELECT `id` FROM `AGENDAs` AS `AGENDA` WHERE `AGENDA`.`ativo` = 1 AND `AGENDA`.`idIdoso` = (:id) )', {
    replacements: {id: idoso.id},
    type: db.sequelize.QueryTypes.SELECT
  });

  return disparos

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

async function FauxiliarAlarme(idAlarme, dataDisparo, horaDisparo) {
  let alarme = await Alarmes.findByPk(idAlarme)
  await AlterByDose({id: alarme.id, qtdeVezesRepetir: alarme.qtdeVezesRepetir})
  await CreateProximoDisparo(idAlarme, dataDisparo, horaDisparo, alarme.repetirEmQuantasHoras)
  return alarme.compartimento
};

async function AlterByDose(alarme) {
  const dose = alarme.qtdeVezesRepetir-1;
  if (dose === 0) {
    alarme.ativo = 0;
    alarme.qtdeVezesRepetir = dose;

  } else {
    alarme.qtdeVezesRepetir = dose;
  }

  await Pills.update(alarme, {where: { id : alarme.id}} );
}

// cria o PRIMEIRO disparo para um novo alarme definido...
async function PrimeiroDisparoByAlarme(alarme) {
  
  await Disparos.create({
    dataDisparo: alarme.dataInicio,
    horaDisparo: alarme.horaInicio,
    tomouRemedio: 0,
    idAlarme : alarme.id,
  })

}

// calcula e cria o proximo disparo mediante o disparo anterior de um alarme e a x de repetição.
async function CreateProximoDisparo(idAlarme, dataDisparo, horaDisparo, repeticao) {
  let dataString = dataDisparo.substr(0, 11) + horaDisparo
  let dataDisparoAnterior = new Date(dataString)
  let ProximoDisparo = dataDisparoAnterior
  ProximoDisparo.setHours(dataDisparoAnterior.getHours() + repeticao);

  console.log("proximo disparo: " + ProximoDisparo)

  const formataData = (datetime)=>{
    if (datetime.getDate() <= 10) {
      let formatted_date = datetime.getFullYear() + "-0" + (datetime.getMonth() + 1) + "-0" + datetime.getDate() + " " + datetime.getHours() + ":" + datetime.getMinutes() + ":" + datetime.getSeconds();
      return formatted_date;
    } else {
    let formatted_date = datetime.getFullYear() + "-0" + (datetime.getMonth() + 1) + "-" + datetime.getDate() + " " + datetime.getHours() + ":" + datetime.getMinutes() + ":" + datetime.getSeconds();
    return formatted_date;
    }
  }
    
  let dataFormatada = formataData(ProximoDisparo)
  console.log("data formatada: " + dataFormatada)
  let novaData = dataFormatada.substring(0, 10);
  let novaHora = dataFormatada.substring(11, 18);

  await Disparos.create({
    dataDisparo: novaData,
    horaDisparo: novaHora,
    tomouRemedio: 0,
    idAlarme : idAlarme,
  })

}


