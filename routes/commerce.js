const {Router} = require('express');
const { check } = require('express-validator' );
const { validarCampos} = require('../middlewares/validar-campos');
const router = Router();
const { validarJWT } = require('../middlewares/validar-jwt');
const { createCommerce, loginCommerce, uploadFile, getCommerce,  validateToken,  updateShop, getCommerceList} = require('../controllers/commerce');

// endpoint '/api/Commerce'

router.post('/new', createCommerce );

router.post(
    '/login',
    [
        check('email', 'El email es obligatorio').isEmail(),
         check('password', 'El password con minimo 6 caracteres').isLength({min: 6}),
         validarCampos
    ],
    loginCommerce );

router.post( '/', uploadFile); 

router.put('/:id', updateShop);

router.get('/', getCommerceList );

router.get('/:id' , getCommerce );
  
 router.get('/renew', validarJWT,  validateToken );
 
module.exports = router;   