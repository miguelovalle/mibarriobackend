const { MongoClient } = require("mongodb");
const uri = process.env.DB_CNN;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _db;
const dbConn = async () => {
  try {
    _db = await client.connect();
    _db = await _db.db("mibarriodbs");
    if (_db) {
      console.log("Ahora está conectado a la Base de Datos");
    }
  } catch (err) {
    console.log(err);
  }
};
dbConn().catch(console.dir);

const getDb = () => {
  return _db;
};

module.exports = { getDb };
