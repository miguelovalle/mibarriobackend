const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const {
  loginCommerce,
  validateToken,
  getCommerce,
  createCommerce,
  uploadFile,
  commerceList,
  updateShop,
  getCategories,
  getListAll,
  searchText,
} = require('../controllers/commerce');

// endpoint '/api/Commerce'

const router = Router();

router.post('/list', commerceList);

router.get('/cat/types', getCategories);

//router.get("/list", getCommerceList);

router.post(
  '/login',
  [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password con minimo 6 caracteres').isLength({
      min: 6,
    }),
    validarCampos,
  ],
  loginCommerce
);

router.post('/new', createCommerce);

router.post('/', uploadFile);

router.put('/:id', updateShop);
getListAll;
router.get('/listall', getListAll);

router.get('/:id', getCommerce);

router.post('/search', searchText);

router.get('/renew', validarJWT, validateToken);

module.exports = router;
