module.exports = {
  HOST: "us-cdbr-east-04.cleardb.com",
  USER: "b6e5897e356418",
  PASSWORD: "f1b883f9",
  DB: "heroku_da50ecf521608a2",
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