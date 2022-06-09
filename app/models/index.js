const dbConfig = require("../config/db.config.js");
//const CronJob = require('cron').CronJob;

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  //   dialectOptions: {
  //     useUTC: false, //for reading from database
  //     dateStrings: true,
  //     typeCast: true
  // },
  // timezone: '-03:00',
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.pills = require("./pills.js")(sequelize, Sequelize);
db.machines = require("./machines.js")(sequelize, Sequelize);
db.responsavel = require("./responsavel.js")(sequelize, Sequelize);
db.Idoso = require("./idoso.js")(sequelize, Sequelize);
db.disparo = require("./disparo.js")(sequelize, Sequelize);

// relacionamento entre idoso e responsável 1:N
db.Idoso.belongsTo(db.responsavel, {
  constraint: true,
  foreignKey: 'idResp',
  as: "responsavel"
})

db.responsavel.hasMany(db.Idoso, {
  foreignKey: 'idResp',
  as: "idosos"
})

// relacionamento entre idoso e máquina 1:1
db.Idoso.belongsTo(db.machines, {
  constraint: true,
  foreignKey: 'idMachine',
  as: "maquinas"
})

// relacionamento entre idoso e alarmes  1:N
db.pills.belongsTo(db.Idoso, {
  constraint: true,
  foreignKey: 'idIdoso'
})

db.Idoso.hasMany(db.pills, {
  foreignKey: 'idIdoso',
  as: "alarmes"
})

// relacionamento entre alarme e disparo (histórico)  1:N
db.disparo.belongsTo(db.pills, {
  constraint: true,
  foreignKey: 'idAlarme'
})

db.pills.hasMany(db.disparo, {
  foreignKey: 'idAlarme',
  as: "disparos"
})

module.exports = db;

