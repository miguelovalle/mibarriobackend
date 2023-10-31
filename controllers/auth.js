const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const { body } = require("express-validator");
const { getDb } = require("../database/conn");
const { ObjectId } = require("mongodb");

const validateUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const db_connect = getDb();
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
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
    };
    const salt = bcrypt.genSaltSync();

    user.password = bcrypt.hashSync(user.password, salt);

    await db_connect.collection("users").insertOne(user);

    const token = await generarJWT(user.celular, user.password);

    res.status(201).json({
      ok: true,
      uid: user._id,
      name: user.name,
      address: user.address,
      phone: user.celular,
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
  const data = req.body;
  try {
    const db_connect = getDb();
    const query = { email: data.mail };
    const user = db_connect.collection("users");
    const result = await user.findOne(query);

    if (!result) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un usuario con ese email",
      });
    }

    // Confirmar la contraseña
    const validPassword = bcrypt.compareSync(data.password, result.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "contraseña incorrecta",
      });
    }
    // Generar nuestro JWT
    const token = await generarJWT(result._id, result.name);
    res.status(201).json({
      ok: true,
      id: result._id,
      firstName: result.name.firstName,
      secondName: result.name.lastName,
      address: result.address,
      celular: result.phone,
      coords: JSON.stringify(result.coords),
      email: result.email,
      token,
    });
  } catch (error) {
    console.log("error", error);
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

const userDetail = async (req, res = response) => {
  try {
    const { id } = req.body;
    const db_connect = getDb();
    const query = { _id: ObjectId(id) };
    const user = db_connect.collection("users");
    const result = await user.findOne(query);
    res.status(201).json({
      ok: true,
      userInf: result,
    });
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
  }
};

const addAddress = async (req, res = response) => {
  try {
    const { id, address } = req.body;
    const db_connect = getDb();
    const query = { _id: ObjectId(id) };
    const user = db_connect.collection("users");
    const result = await user.updateOne(query, { $set: { address: address } });

    res.status(201).json({
      ok: true,
      userInf: `${result.matchedCount} document(s) matched the query criteria.`,
    });
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
  }
};
module.exports = {
  createUser,
  loginUser,
  validateToken,
  validateUser,
  userDetail,
  addAddress,
};
