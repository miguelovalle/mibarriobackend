const { response } = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../database/conn');
const { generarJWT } = require('../helpers/jwt');
const { ObjectId } = require('mongodb');

const createCharge = async (req, res = response) => {
  try {
    const db_connect = getDb();

    const charge = req.body;

    await db_connect.collection('charges').insertOne(charge);

    const token = await generarJWT(charge.date, charge.name);
    console.log('cargaytoken', charge, token);

    return res.status(201).json({
      ok: true,
      token,
    });
  } catch (err) {
    res.status(500).send(`error devuelto ${err}`);
  }
};

const chargesList = async (req, res = response) => {
  try {
    const db_connect = getDb();
    const { shopId } = req.body;
    const query = { idShop: shopId };
    const charges = db_connect.collection('charges');
    const cursor = await charges.find(query);
    let recharges = [];

    await cursor.forEach((doc) => {
      recharges.push(doc);
    });

    return res.json({
      ok: true,
      recharges,
    });
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
  }
};

const chargeSum = async (req, res = response) => {
  try {
    const db_connect = getDb();
    const { shopId } = req.body;

    const charges = db_connect.collection('charges');

    const pipeline = [
      {
        $match: {
          idShop: shopId,
        },
      },
      {
        $group: {
          _id: null,
          TotalCharge: { $sum: '$amount' },
        },
      },
    ];

    const aggCursor = await charges.aggregate(pipeline);
    // for await (const doc of aggCursor) {
    //   console.log("doc", doc);
    // }
    let totalCharges = [];
    await aggCursor.forEach((doc) => totalCharges.push(doc));
    return res.json({
      ok: true,
      totalCharges,
    });
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
  }
};

const updateCharge = async (req, res = response) => {
  try {
    const db_connect = getDb();

    const { id } = req.params;

    const { newBank, newAmount, correction, oldBank, oldAmount } = req.body;

    const charges = db_connect.collection('charges');

    await charges.updateOne(
      { _id: ObjectId(id) },
      {
        $set: {
          oldBank: oldBank,
          oldValue: oldAmount,
          bank: newBank,
          amount: newAmount,
          correction: correction,
        },
      }
    );
    return res.json({
      ok: true,
    });
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
  }
};
module.exports = {
  createCharge,
  chargesList,
  chargeSum,
  updateCharge,
};
