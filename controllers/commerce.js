const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const { getDb } = require("../database/conn");
const ObjectId = require("mongodb").ObjectId;

const getCommerceList = async (req, res) => {
  try {
    const long = Number(req.query.lg);
    const lat = Number(req.query.lt);

    const db_connect = getDb();
    const commerce = db_connect.collection("commerces");
    const cursor = await commerce.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [long, lat] },
          $maxDistance: 10000,
        },
      },
    });
    //const cursor = await commerce.find({});
    let commerces = [];
    await cursor.forEach((doc) => commerces.push(doc));

    return res.json({
      ok: true,
      commerces,
    });
  } catch (err) {
    console.log(`Error de conexion. Intente más tarde ${err}`);
  }
};

const loginCommerce = async (req, res) => {
  const { email, password } = req.body;

  try {
    const db_connect = getDb();
    const query = { email: email };
    const commerce = db_connect.collection("commerces");
    const result = await commerce.findOne(query);

    if (!result) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un contacto con ese email",
      });
    }
    const validPassword = bcrypt.compareSync(password, result.passwd);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "contraseña incorrecta",
      });
    }

    const token = await generarJWT(result._id, result.name);

    res.status(201).json({
      ok: true,
      id: result._id,
      name: result.name,
      categories: result.categories,
      token,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      msg: `Favor comunicarse con el administrador ${err}`,
    });
  }
};

const createCommerce = async (req, res) => {
  try {
    const commerce = req.body;

    const db_connect = getDb();

    const salt = bcrypt.genSaltSync();

    commerce.passwd = bcrypt.hashSync(commerce.passwd, salt);

    await db_connect.collection("commerces").insertOne(commerce);

    const token = await generarJWT(commerce.id, commerce.name);

    return res.status(201).json({
      ok: true,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: `comuniquese con el administrador ${err}`,
    });
  }
};

const getCommerce = async (req, res) => {
  try {
    const uid = req.params.id;
    const db_connect = getDb();
    const query = { _id: ObjectId(uid) };
    const commerce = db_connect.collection("commerces");
    const result = await commerce.findOne(query);

    if (!result) {
      return res.status(400).json({
        ok: false,
        msg: "No se encontró el registro",
      });
    }
    if (result) {
      res.status(201).json({
        ok: true,
        result,
      });
    }
  } catch (err) {
    res.status(500).json({
      ok: false,
      msg: `Error emitido por el servidor ${err}`,
    });
  }
};

const uploadFile = async (req, resp = response) => {
  try {
    if (!req.files) {
      resp.send({
        ok: false,
        message: "No hay archivo para cargar",
      });
    } else {
      const { file } = req.files;
      file.mv("./public/imgs/" + file.name);

      resp.send({
        ok: true,
        message: "archivo cargado",
      });
    }
  } catch (error) {
    resp.status(500).send(`error devuelto ${error}`);
  }
};

const updateShop = async (req, res) => {
  const shopid = req.params.id.trim();
  const shop = req.body;
  const salt = bcrypt.genSaltSync();
  shop.passwd = bcrypt.hashSync(shop.passwd, salt);
  try {
    const db_connect = getDb();
    const query = { _id: ObjectId(shopid) };
    const commerce = db_connect.collection("commerces");
    const result = await commerce.replaceOne(query, shop);

    res.json({
      ok: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "hable con el addor",
    });
  }
};

const validateToken = async (req, res = response) => {
  const { id, name } = req;
  const token = await generarJWT(id, name);
  res.json({
    ok: true,
    id,
    name,
    token,
  });
};

module.exports = {
  validateToken,
  loginCommerce,
  createCommerce,
  getCommerce,
  uploadFile,
  getCommerceList,
  updateShop,
};
