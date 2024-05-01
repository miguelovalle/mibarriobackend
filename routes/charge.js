const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");

const {
  createCharge,
  chargesList,
  chargeSum,
  updateCharge,
} = require("../controllers/charge");

const router = Router();

router.use(validarJWT);

router.post(
  "/charge",
  [
    check("shopId", "El nit es obligatorio").not().isEmpty(),
    check("bank", "El banco es obligatorio").not().isEmpty(),
    check("mount", "La fecha es obligatoria").not().isEmpty(),
  ],
  createCharge
);

router.post("/chargeslist", chargesList);

router.post("/chargesum", chargeSum);

router.put("/:id", updateCharge);

module.exports = router;
