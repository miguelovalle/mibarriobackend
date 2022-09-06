const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt'); 
const Commerce = require('../models/Commerce');

const getCommerceList= async( req, res )  => {
  // const lg= req.query.lg
  // const lt= req.query.lt
  
  //const commerces = await  Commerce.find({ location: { $near: { $geometry: { type: "Point", coordinates: [ -74.1094356, 4.6541253 ] }, $maxDistance:1000 } } });

  const commerces= await Commerce.find({})
  return res.json({
    ok: true,
    commerces
  })
}

const getCommerce = async( req, res ) => {
  try {
    const uid = req.params.id;
    const commerce = await Commerce.findById( uid );
    return res.json({
      ok:true, 
      commerce
    })
    
  } catch (error) {
      res.status(500).json({
      ok: false,
      msg: 'error emitido por getCommerce en el server'
  }) 
  }
}
 
const createCommerce = async(req, res) => { 
    try {
      const {email, passwd} = req.body;
      const mail = await Commerce.findOne( { email } );
      if ( mail ) {
          return res.status(400).json({
              ok: false,
              msg: 'Un usuario existe con este correo'
          });
      } 
      const commerce = new Commerce( req.body );
      //encriptar contraseña
      const salt =  bcrypt.genSaltSync();
      commerce.passwd =  bcrypt.hashSync( passwd, salt );

      //generar JWT
      const registroGuardado = await commerce.save();
      const token = await generarJWT(commerce.id, commerce.name );

      res.json({
        ok: true,
        commerce: registroGuardado,
        token
      })
      
    } catch (error) {
      res.status(500).send(`error devuelto ${error}`)
    }
};

const loginCommerce = async(req, res= response ) => { 
  const { email, password }  = req.body;
  try {
      const commerce = await Commerce.findOne( { email } ); 
      if ( !commerce ) {
          return res.status(400).json({
              ok: false,
              msg: 'No existe un contacto con ese email'
          });
      } 
      const validPassword = bcrypt.compareSync( password, commerce.passwd );
      if ( !validPassword ) {
          return res.status(400).json({
              ok: false,
              msg: 'contraseña incorrecta'
          });
      }

      const token = await generarJWT( commerce._id, commerce.name );

      res.status(201).json({
          ok: true,
          id: commerce._id,
          name: commerce.name,
          categories: commerce.categories,
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

const updateShop = async(req, res ) => {
  const shopid = req.params.id;
  const shop = req.body;
  const salt =  bcrypt.genSaltSync();
  shop.passwd=  bcrypt.hashSync( shop.passwd, salt );
  try {
      const shopdb = await Commerce.findById( shopid );
      if ( !shopdb ) {
          return res.status(404).json({
              ok: false,
              msg: 'Negocio inxistente por ese Id'
          }); 
      }
/*       if( product.commerce.toString !== uid ) {
          return res.status(401).json({
              ok:false,
              msg: 'No tiene privilegios para editar este evento'
          });
      } */
      const shopUpdated = await Commerce.findByIdAndUpdate( shopId, shop, { new: true } );
      console.log(shopUpdated)
      res.json({
          ok: true,
          shopUpdated
      });

  } catch (error) {
      res.status(500).json({
          ok: false,
          msg: "hable con el addor"    
      });
  }
}


const validateToken = async(req, res= response ) => {
  const { id, name }  = req; 
  const token = await generarJWT( id, name ); 
   res.json({
      ok: true,
      id,
      name,
      token 
  })

}

module.exports = {createCommerce , loginCommerce, uploadFile, getCommerce,  validateToken, getCommerceList, updateShop } ;

