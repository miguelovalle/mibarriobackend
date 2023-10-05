const { response } = require("express");
const { getDb } = require("../database/conn");

const registerOrder = async (req, res = response) => {
  try {
    const db_connect = getDb();

    const order = req.body;
    await db_connect.collection("orders").insertOne(order);

    return res.status(201).json({
      ok: true,
    });
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
  }
};

module.exports = { registerOrder };
