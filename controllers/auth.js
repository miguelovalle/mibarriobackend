 const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = response ) => {

    const { name, email, password}  = req.body;
    try {
        let usuario = await Usuario.findOne( { email } );

        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con este correo'
            });
        } 

        usuario = new Usuario( req.body );

        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();
        
        // generar JWT
        const token = await generarJWT( usuario.id, usuario.name );
        
        res.status(201).json({  
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        }) 

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Favor comunicarse con el administrador'
        })
    }
};


const loginUsuario = async(req, res= response ) => {
    const { email, passwd }  = req.body;
    try {
        console.log("correo ", email);
        const usuario = await Usuario.findOne( { email:email } );
        console.log(usuario);
        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con ese email'
            });
        } 
        
        // Confirmar la contraseña
        const validPassword = bcrypt.compareSync( passwd, usuario.passwd );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'contraseña incorrecta'
            });
        }
        // Generar nuestro JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.status(201).json({
            ok: true,
            id: usuario.id,
            name: usuario.name,
            token
        })  
          
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Favor comunicarse con el administrador'
        })
    }
};
   

const revalidarToken = async(req, res= response ) => {
 
    const { uid, name }  = req; 

    const token = await generarJWT( uid, name ); 
     res.json({
        ok: true,
        uid,
        name,
        token 
    })

}

 module.exports = {
     crearUsuario,
     loginUsuario,
     revalidarToken,
 }  