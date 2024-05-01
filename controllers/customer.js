const { response } = require("express");
const bcrypt = require("bcryptjs");
const { getDb } = require("../database/conn");
const { generarJWT } = require("../helpers/jwt");
const { ObjectId } = require("mongodb");

const createAgent = async (req, res = response) => {
  try {
    const db_connect = getDb();

    const specialist = req.body;

    const salt = bcrypt.genSaltSync();

    specialist.password = bcrypt.hashSync(specialist.password, salt);

    await db_connect.collection("specialists").insertOne(specialist);

    const token = await generarJWT(specialist.profile, specialist.email);

    return res.status(201).json({
      ok: true,
      id: specialist._id,
      token,
    });
  } catch (err) {
    res.status(500).send(`error devuelto ${err}`);
  }
};
const loginAgent = async (req, res = response) => {
  const data = req.body;
  try {
    const db_connect = getDb();
    const query = { email: data.mail };
    const specialist = await db_connect.collection("specialists");
    const result = await specialist.findOne(query);
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
    const token = await generarJWT(result.name.firstName, result.name.lastName);
    res.status(201).json({
      ok: true,
      id: result._id,
      firstName: result.name.firstName,
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

module.exports = {
  createAgent,
  loginAgent,
};
