const {Router} = require('express');
const { check } = require('express-validator' );
const { validarCampos} = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { createProduct, uploadFile, getProducts, getProduct, updateProduct, enabledProducts, deleteProduct }= require('../controllers/product');

const router = Router();


router.post( '/', uploadFile); 

router.use( validarJWT );

router.post('/new',
[
    check('name', 'El nombre es opbligatorio').not().isEmpty(),
    check('category', 'La categoria es obligatoria').not().isEmpty(),
    check('price', 'El precio es opbligatorio').not().isEmpty(),
    validarCampos
],
createProduct );

router.get('/products', getProducts );

router.get('/products/:id', getProduct );

router.put('/products/:id',updateProduct );

router.post('/enabled', enabledProducts );

router.delete('/delete/:id', deleteProduct );


module.exports = router;   