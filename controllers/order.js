const { response } = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../database/conn");

const registerOrder = async (req, res = response) => {
  try {
    const db_connect = getDb();
    const order = req.body;
    await db_connect.collection("orders").insertOne(order);
    return res.status(201).json({
      ok: true,
      orderId: order._id,
    });
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
  }
};

const registerRatesServices = async (req, res = response) => {
  try {
    const db_connect = getDb();
    const rate = req.body;
    await db_connect.collection("ratesServices").insertOne(rate);
    return res.status(201).json({
      ok: true,
      orderId: order._id,
    });
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
  }
};

const registerRatesApp = async (req, res = response) => {
  try {
    const db_connect = getDb();
    const rate = req.body;
    console.log(rate);
    await db_connect.collection("ratesApps").insertOne(rate);
    return res.status(201).json({
      ok: true,
      orderId: order._id,
    });
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
  }
};

const getOrders = async (req, res = response) => {
  try {
    const db_connect = getDb();
    const { id, changeDate, filtered } = req.body;
    let start = new Date(changeDate).setHours(0, 0, 0);
    let end = new Date(changeDate).setHours(23, 59, 59);

    const orders = db_connect.collection("orders");

    const query =
      filtered.length > 0
        ? {
            commerce: id,
            dateOrder: { $gte: start, $lt: end },
            changeState: filtered,
          }
        : {
            commerce: id,
            dateOrder: { $gte: start, $lt: end },
          };
    const cursor = await orders.find(query);

    let orderList = [];

    await cursor.forEach((doc) => orderList.push(doc));
    return res.json({
      ok: true,
      orderList,
    });
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
  }
};

const getOrdersGrouped = async (req, res = response) => {
  try {
    const db_connect = getDb();
    const { id, changeDate } = req.body;
    let start = new Date(changeDate).setHours(0, 0, 0);
    let end = new Date(changeDate).setHours(23, 59, 59);

    const orders = db_connect.collection("orders");

    const pipeline = [
      {
        $match: {
          commerce: id,
          dateOrder: { $gte: start, $lt: end },
        },
      },
      { $group: { _id: "$changeState", countState: { $count: {} } } },
    ];

    const aggCursor = await orders.aggregate(pipeline);
    // for await (const doc of aggCursor) {
    //   console.log("doc", doc);
    // }
    let countStates = [];
    await aggCursor.forEach((doc) => countStates.push(doc));
    return res.json({
      ok: true,
      countStates,
    });
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
  }
};

const updateOrder = async (req, res = response) => {
  try {
    const { state, changeTime, dateOrder } = req.body;
    let changedTime =
      new Date(changeTime).getHours() + ":" + new Date(changeTime).getMinutes();
    let changedDate = +new Date(dateOrder);
    const db_connect = getDb();
    const orders = db_connect.collection("orders");
    const query = { dateOrder: changedDate };
    const updateDoc = { $set: { changeTime: changedTime, changeState: state } };
    await orders.updateOne(query, updateDoc);
    return res.json({
      ok: true,
      message: "La orden ha sido actualizada",
    });
  } catch {}
};

const getOrder = async (req, res = response) => {
  try {
    const id = req.params.id;
    const db_connect = getDb();
    const order = db_connect.collection("orders");
    const query = { _id: ObjectId(id) };
    const result = await order.findOne(query);
    const stateChange = result.changeState;
    const commerceId = result.commerce;

    if (!result) {
      return res.status(400).json({
        ok: false,
        msg: "No se encontró el registro",
      });
    }

    if (result) {
      res.status(201).json({
        ok: true,
        stateChange,
        commerceId,
      });
    }
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
  }
};

module.exports = {
  registerOrder,
  getOrders,
  getOrdersGrouped,
  updateOrder,
  getOrder,
  registerRatesServices,
  registerRatesApp,
};
