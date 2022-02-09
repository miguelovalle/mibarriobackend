const {Router} = require('express');
const { check } = require('express-validator' );
const { validarCampos} = require('../middlewares/validar-campos');
const { validarJWT } = require ('../middlewares/validar-jwt');
const router = Router();

 
// es bueno poner comentario asi: Rutas de usuarios/auth
// host + /api/auth  porque de este codigo no se deduce  cual es el endpoint

const { crearUsuario, loginUsuario, revalidarToken} = require('../controllers/auth');

router.post(
    '/new',
    [
         check('name', 'El nombre es obligatorio').not().isEmpty(),
         check('email', 'El email es obligatorio').isEmail(),
         check('password', 'El password con minimo 6 caracteres').isLength({min: 6}),
         validarCampos
    ],
    crearUsuario ); 
 
router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
         check('password', 'El password con minimo 6 caracteres').isLength({min: 6}),
         validarCampos
    ],
    loginUsuario );
    
  
router.get('/renew', validarJWT,  revalidarToken );
  
module.exports = router;   