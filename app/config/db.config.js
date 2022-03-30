module.exports = {
  HOST: "us-cdbr-east-05.cleardb.net",
  USER: "be68bb7b6201ba",
  PASSWORD: "79b9c447",
  DB: "heroku_ebe76991654738d",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

/*module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "root",
  DB: "pills",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};*/

// mysql://be68bb7b6201ba:79b9c447@us-cdbr-east-05.cleardb.net/heroku_ebe76991654738d?reconnect=true