const { response } = require("express");
const bcrypt = require("bcryptjs");
//const User = require("../models/User");
const { generarJWT } = require("../helpers/jwt");
const { body } = require("express-validator");
const { getDb } = require("../database/conn");

const validateUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    db_connect = getDb();
    const query = { email: email };
    const user = db_connect.collection("users");
    const result = await user.findOne(query);
    if (result) {
      return res.status(400).json({
        ok: false,
        msg: "Un usuario existe con este correo",
      });
    }
  } catch (err) {
    res.status(500).json({
      ok: false,
      msg: `Favor comunicarse con el administrador ${err}`,
    });
  }
};

const createUser = async (req, res = response) => {
  try {
    const db_connect = getDb();

    const user = {
      name: req.body.name,
      address: req.body.address,
      celular: req.body.celular,
      email: req.body.email,
      password: req.body.password,
    };

    const salt = bcrypt.genSaltSync();

    user.password = bcrypt.hashSync(user.password, salt);

    await db_connect.collection("users").insertOne(user);

    const token = await generarJWT(user.celular, user.password);

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Favor comunicarse con el administrador",
    });
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const db_connect = getDb();
    const query = { email: email };
    const user = db_connect.collection("users");
    const result = await user.findOne(query);

    if (!result) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un usuario con ese email",
      });
    }

    // Confirmar la contraseña
    const validPassword = bcrypt.compareSync(password, result.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "contraseña incorrecta",
      });
    }
    // Generar nuestro JWT
    const token = await generarJWT(result._id, user.name);

    res.status(201).json({
      ok: true,
      id: result._id,
      name: result.name.nombres,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Favor comunicarse con el administrador",
    });
  }
};

const validateToken = async (req, res = response) => {
  const { uid, name } = req;

  const token = await generarJWT(uid, name);
  res.json({
    ok: true,
    uid,
    name,
    token,
  });
};

module.exports = {
  createUser,
  loginUser,
  validateToken,
  validateUser,
};
