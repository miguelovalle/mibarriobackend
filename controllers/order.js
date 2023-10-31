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

module.exports = { registerOrder, getOrders, getOrdersGrouped, updateOrder };
