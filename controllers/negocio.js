const { response } = require('express');
const bcrypt = require('bcryptjs');
const Negocio = require('../models/Negocio');
const { generarJWT } = require('../helpers/jwt'); 

const getNegocios = async( req, res )  => {
  const lg= req.query.lg
  const lt= req.query.lt
  
  //const negocios= await Negocio.find()
  const negocios = await  Negocio.find({ location: { $near: { $geometry: { type: "Point", coordinates: [ -74.1094356, 4.6541253 ] }, $maxDistance:1000 } } });
  return res.json({
    ok: true,
    negocios
  })
}
 
const crearNegocio = async(req, res) => {
  const {  email, passwd} = req.body;
//  const negocio = new Negocio( req.body );
    try {
      
      let mail = await Negocio.findOne( { email } );

      if ( mail ) {
          return res.status(400).json({
              ok: false,
              msg: 'Un usuario existe con este correo'
          });
      } 
      
      const negocio = new Negocio( req.body );

      //encriptar contraseña
      const salt =  bcrypt.genSaltSync();
      negocio.passwd =  bcrypt.hashSync( passwd, salt );

      //generar JWT
      const registroGuardado = await negocio.save();
      const token = await generarJWT( negocio.id, negocio.nombre );
      res.json({
        ok: true,
        negocio: registroGuardado,
        token
      })
      
    } catch (error) {
      res.status(500).send(`error devuelto ${error}`)
    }
};

const loginNegocio = async(req, res= response ) => {
  const { email, password}  = req.body;
  console.log(req.body);
  try {
      const negocio = await Negocio.findOne( { email } ); 
      if ( !negocio ) {
          return res.status(400).json({
              ok: false,
              msg: 'No existe un contacto con ese email'
          });
      } 
      
      // Confirmar la contraseña
      const validPassword = bcrypt.compareSync( password, negocio.passwd );
      console.log(validPassword);
      if ( !validPassword ) {
          return res.status(400).json({
              ok: false,
              msg: 'contraseña incorrecta'
          });
      }
      // Generar nuestro JWT
      const token = await generarJWT( negocio.id, negocio.nombre );

      res.status(201).json({
          ok: true,
          id: negocio.id,
          name: negocio.nombre,
          token
      })  
        
  } catch (error) {
      res.status(500).json({
          ok: false,
          msg: 'Favor comunicarse con el administrador'
      })
  }
};


const uploadFile = async(req, resp=response ) => {
    try {
      if (!req.files ) {
        resp.send({
          ok: false,
          message: "No hay archivo para cargar"
        })
      } else {
        const {file} = req.files
        file.mv("./public/imgs/" + file.name)

        resp.send({
          ok:true,
          message: "archivo cargado"
        });
      }
    } catch (error) {
      resp.status(500).send(`error devuelto ${error}`)
      
    }
}

const revalidarToken = async(req, res= response ) => {
 
  const { id, name }  = req; 

  const token = await generarJWT( id, name ); 
   res.json({
      ok: true,
      id,
      name,
      token 
  })

}

module.exports = { uploadFile, crearNegocio, getNegocios, loginNegocio, revalidarToken } ;
