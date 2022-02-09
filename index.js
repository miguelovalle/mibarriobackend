const express = require('express');
require('dotenv').config();
const cors = require('cors');
const fileupload = require("express-fileupload");
const { dbConnection } = require('./database/config');
   
//crear el servidor de express
 const app = express();

 dbConnection();
app.use( express.json() );

// lectura y parseo srd del body: peticiones q vengan en json se procesan en este midleware y se extrae su contenido
app.use(cors());

app.use(fileupload() );

app.use( express.static('public') );
 
// todo lo que exporte  el archivo ./routes/auth lo va a habilitar en la ruta del  endpoint api/auth
 app.use('/api/auth', require('./routes/auth') );
 app.use('/api/negocio', require('./routes/negocio') );

 const port = process.env.PORT || 4000

 app.listen(port, () => {
   console.log(`Server running successfully on port ${port}`);
 });