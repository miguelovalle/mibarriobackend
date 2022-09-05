 const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generarJWT } = require('../helpers/jwt');

const createUser = async(req, res = response ) => {

    const { email, password }  = req.body;
    try {
        let user = await User.findOne( { email } );
        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con este correo'
                
            });
        } 

        user = new User( req.body );
        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();
        
        // generar JWT
        const token = await generarJWT( user.id, user.name );
        
        res.status(201).json({  
            ok: true,
            uid: user.id,
            name: user.name,
            token
        }) 

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Favor comunicarse con el administrador'
        })
    }
};


const loginUser = async(req, res= response ) => {
    const { email, password }  = req.body;
    try {
        const user = await User.findOne( { email:email } );
        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con ese email'
            });
        } 
        
        // Confirmar la contraseña
        const validPassword = bcrypt.compareSync( password, user.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'contraseña incorrecta'
            });
        }
        // Generar nuestro JWT
        const token = await generarJWT( user.id, user.name );

        res.status(201).json({
            ok: true,
            id: user.id,
            name: user.name,
            token
        })  
          
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Favor comunicarse con el administrador'
        })
    }
};
   

const validateToken = async(req, res= response ) => {
 
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
     createUser,
     loginUser,
     validateToken,
 }  