const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

// endpoint '/api/auth

const {
  validateUser,
  createUser,
  loginUser,
  validateToken,
  userDetail,
  addAddress,
} = require("../controllers/auth");

const router = Router();

router.post(
  "/new",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("address", "La dirección es obligatoria").not().isEmpty(),
    check("phone", "El numero de telefono es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password con minimo 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  createUser
);

router.post("/", loginUser);

router.post("/validate", validateUser);

router.get("/renew", validateToken);

router.post("/userDetail", userDetail);

router.post("/addAddress", addAddress);

module.exports = router;
