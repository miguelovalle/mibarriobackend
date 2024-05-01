const express = require('express');
require('dotenv').config();
const cors = require('cors');
const fileupload = require('express-fileupload');
//crear el servidor de express
const app = express();

app.use(cors());

app.use(express.json()); // lectura y parseo del body: peticiones q vengan en json se procesan en este midleware y se extrae su contenido

app.use(fileupload());

app.use(express.static('public'));

// todo lo que exporte  el archivo ./routes/auth lo va a habilitar en la ruta del  endpoint api/auth
app.use('/api/auth', require('./routes/auth'));
app.use('/api/commerce', require('./routes/commerce'));
app.use('/api/product', require('./routes/product'));
app.use('/api/order', require('./routes/order'));
app.use('/api/customer', require('./routes/customer'));
app.use('/api/charge', require('./routes/charge'));

const port = process.env.PORT || 4000;
//const dbo = require("./database/conn");
const { conn } = require('./database/conn');

app.listen(port, () => {
  // perform a database connection when server starts
  console.log(`Server is running on port: ${port}`);
});
