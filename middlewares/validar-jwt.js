
const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next ) => {
    // Pido el token en los headers con x-token
    const token = req.header( 'x-token' );
    
    if ( !token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        })
    }
    
    try {
        const payload = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );
        
        req.id = payload.id;
        req.nombre = payload.name;
        
    } catch ( error ) {
        return res.status(401).json({
            ok: false,  
            msg: 'Token no valido'
        })
    }
    next();
};

module.exports = { validarJWT };