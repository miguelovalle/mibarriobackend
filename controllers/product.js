const { response } = require('express');
const Product= require('../models/Product');

const createProduct = async(req,res= response ) => {
  try {
      const product = new Product(req.body);
      const registroGuardado = await product.save();
      return res.json({
        ok: true,
        product: registroGuardado,
      })
  }
  catch (error) {
    res.status(500).send(`error devuelto ${error}`)
  }
}

const getProducts = async (req, res= response )  => {

    const products= await Product.find().where('commerce').equals(req.id);
    return res.json({
      ok:true,
      products
  })
} 

const getProduct = async (req, res= response )  => {
  const productId = req.params.id;
  const product = await Product.findById(productId );
  return res.json({
    ok:true,
    product
})
} 

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

const updateProduct = async(req, res ) => {
  
  const productId = req.params.id;
  const product = req.body;
  try {
    
      const productdb = await Product.findById(productId );
    
      if ( !productdb ) {
         return res.status(404).json({
             ok: false,
             msg: 'producto inxistente por ese Id'
         }); 
      }

/*       if( product.commerce.toString !== uid ) {
          return res.status(401).json({
              ok:false,
              msg: 'No tiene privilegios para editar este evento'
          });
      } */
      
      const productUpdated = await Product.findByIdAndUpdate( productId, product, { new: true } );

      res.json({
          ok: true,
          productUpdated
      });

  } catch (error) {
      res.status(500).json({
          ok: false,
          msg: "hable con el addor"    
      });
  }
}

const enabledProducts = async( req, res ) => {
  const id =req.body.id;
  const enab = req.body.enabl;
  let keyEnabled = enab;
  enab==='si' ? keyEnabled = 'no' : keyEnabled='si';
  try {
    const resp = await Product.updateMany( { commerce: id }, {enabled: keyEnabled } );
    if (resp.acknowledged) {
          res.json({
            ok:true, 
            msg: `Se actualizaron ${resp.modifiedCount} registros`});
    }


  } catch (error) {
    res.status(500).send(`error devuelto ${error}`)
  }
};

const deleteProduct = async( req, res ) => {
  const productId = req.params.id;
  //const uid = req.uid;

  try {
    
      const product = await Product.findById (productId );
      
      if ( !product ) {
         return res.status(404).json({
             ok: false,
             msg: 'No existe un producto con ese Id'
         }); 
      }

      // if( evento.user.toString() !== uid ) {
      //     return res.status(401).json({
      //         ok:false,
      //         msg: 'No tiene privilegios para editar este evento'
      //     });
      // }

      await Product.findByIdAndDelete( productId );

      res.json({ ok: true });

  } catch (error) {
      res.status(500).json({
          ok: false,
          msg: "Operacion rechazada. Intente mas tarde"    
      });
  }

};

module.exports = { createProduct,  uploadFile, updateProduct, getProducts, getProduct, enabledProducts, deleteProduct};