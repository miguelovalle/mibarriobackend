const { response } = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../database/conn");

const createProduct = async (req, res = response) => {
  try {
    const db_connect = getDb();
    const product = req.body;
    const result = await db_connect.collection("products").insertOne(product);
    return res.json({
      ok: true,
      id: result.insertedId,
    });
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
  }
};

/* const aggregateProducts = async () => {
  try {
    
    const db_connect = getDb();
    const aggregate = req.body;
    const result = await db_connect
      .collection("aggregates")
      .insertOne(aggregate);
    return res.json({run 
      ok: true,
      id: result.insertedId,
    });
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
  }
}; */

const getProducts = async (req, res = response) => {
  try {
    const id = req.id;

    console.log(id);
    const db_connect = getDb();
    const product = db_connect.collection("products");
    const query = { commerce: id };
    //const query = {};
    const cursor = await product.find(query);
    let products = [];
    await cursor.forEach((doc) => products.push(doc));

    return res.json({
      ok: true,
      products,
    });
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
  }
};

const getproductSinTkn = async (req, res = response) => {
  try {
    const { id } = req.body;

    const db_connect = getDb();
    const product = db_connect.collection("products");
    const query = { commerce: id };
    //const query = {};
    const cursor = await product.find(query);
    let products = [];
    await cursor.forEach((doc) => products.push(doc));

    return res.json({
      ok: true,
      products,
    });
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
  }
};

const getProduct = async (req, res = response) => {
  try {
    const id = req.params.id;
    const db_connect = getDb();
    const product = db_connect.collection("products");
    const query = { commerce: id };
    const result = await product.findById(query);
    return res.json({
      ok: true,
      result,
    });
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
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

const updateProduct = async (req, res) => {
  try {
    const productId = ObjectId(req.body._id);
    const enb = req.body.enabled;
    const db_connect = getDb();
    const products = await db_connect.collection("products");
    const query = { _id: productId };
    const updateDoc = { $set: { enabled: enb } };
    await products.updateOne(query, updateDoc);
    return res.json({
      ok: true,
      message: "El producto ha sido actualizado",
    });
    /*       if( product.commerce.toString !== uid ) {
      return res.status(401).json({
        ok:false,
        msg: 'No tiene privilegios para editar este evento'
      });
    } */
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
  }
};

const replaceProduct = async (req, res) => {
  try {
    const productId = ObjectId(req.params);
    const replace = req.body;
    const db_connect = getDb();
    const product = await db_connect.collection("products");
    const query = { _id: productId };
    await product.replaceOne(query, replace);
    return res.json({
      ok: true,
      message: "El producto ha sido actualizado",
    });
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
  }
};

const enabledProducts = async (req, res) => {
  const commerceId = req.body.id;
  const enab = req.body.enabl;
  let keyEnabled = enab;
  enab === "si" ? (keyEnabled = "no") : (keyEnabled = "si");
  try {
    const db_connect = getDb();
    const products = await db_connect.collection("products");
    const query = { commerce: commerceId };
    const updateDoc = { $set: { enabled: keyEnabled } };
    const result = await products.updateMany(query, updateDoc);
    return res.json({
      ok: true,
      message: `Se actualizaron & {result.modifiedCount} productos`,
    });
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
  }
};

const deleteProduct = async (req, res) => {
  const productId = ObjectId(req.params.id);
  try {
    const db_connect = getDb();
    const query = { _id: productId };
    const product = await db_connect.collection("products");
    await product.deleteOne(query);
    return res.json({ ok: true });
  } catch (error) {
    res.status(500).send(`error devuelto ${error}`);
  }
};

module.exports = {
  createProduct,
  uploadFile,
  updateProduct,
  getProducts,
  getProduct,
  enabledProducts,
  deleteProduct,
  replaceProduct,
  getproductSinTkn,
};
