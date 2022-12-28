const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  loginCommerce,
  validateToken,
  getCommerce,
  createCommerce,
  uploadFile,
  getCommerceList,
  updateShop,
} = require("../controllers/commerce");

// endpoint '/api/Commerce'

const router = Router();

router.post("/new", createCommerce);

router.post(
  "/login",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password con minimo 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  loginCommerce
);

router.post("/", uploadFile);

router.put("/:id", updateShop);

router.get("/list/", getCommerceList);

router.get("/:id", getCommerce);

router.get("/renew", validarJWT, validateToken);

module.exports = router;
