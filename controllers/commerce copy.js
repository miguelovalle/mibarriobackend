const { response } = require("express");
//const Commerce = require('../models/Commerce');
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const { getDb } = require("../database/conn");
const ObjectId = require("mongodb").ObjectId;

const loginCommerce = async (req, res) => {
  const { email, password } = req.body;
  let db_connect;

  try {
    db_connect = getDb();
    const query = { email: email };
    const commerce = db_connect.collection("commerces");
    const result = await commerce.findOne(query);
    //  if (err) throw err;
    if (!result) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un contacto con ese email",
      });
    }
    //    console.log(result);
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
  const commerce = req.body;
  let db_connect;

  try {
    db_connect = getDb();
    const query = { email: commerce.email };
    const commerce = db_connect.collection("commerces");

    // const result = await commerce.findOne(query, (err, result) => {
    //   if (err) throw err;
    //   console.log(result);
    //   if (result) {
    //     return res.status(400).json({
    //       ok: false,
    //       msg: "Un usuario existe con este correo",
    //     });
    //   }
    // });

    const salt = bcrypt.genSaltSync();
    commerce.passwd = bcrypt.hashSync(commerce.passwd, salt);
    //    db_connect = getDb();
    await db_connect.collection("commerces").insertOne(commerce);

    // , (err, result) => {
    //   if (err) throw err;
    // });

    const token = await generarJWT(commerce.id, commerce.name);

    return res.status(201).json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: `comuniquese con el administrador ${err}`
    });
  }
};

const getCommerce = async (req, res) => {
  const uid = req.params.id;

  try {
    let db_connect = getDb();
    db_connect
      .collection("commerce")
      .findOne({ _id: ObjectId(uid) }, (err, result) => {
        if (err) throw err;
        res.status(201).json(result);
      });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "error emitido por el servidor getCommerce en el server",
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
};
