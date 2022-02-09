const {Router} = require('express');
const { check } = require('express-validator' );
const { validarCampos} = require('../middlewares/validar-campos');
const router = Router();
const { validarJWT } = require('../middlewares/validar-jwt');
const { crearNegocio, loginNegocio, uploadFile, getNegocios, revalidarToken } = require('../controllers/negocio');

router.post('/new', crearNegocio );
router.post(
    '/login',
    [
        check('email', 'El email es obligatorio').isEmail(),
         check('password', 'El password con minimo 6 caracteres').isLength({min: 6}),
         validarCampos
    ],
    loginNegocio );
router.post( '/', uploadFile); 
router.get('/listanegocios', getNegocios );
  
 router.get('/renew', validarJWT,  revalidarToken );
 
module.exports = router;   