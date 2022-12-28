const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  createProduct,
  uploadFile,
  getProducts,
  getProduct,
  updateProduct,
  enabledProducts,
  deleteProduct,
  replaceProduct,
  getproductSinTkn,
} = require("../controllers/product");

const router = Router();

router.post("/", uploadFile);

router.post("/sintkn", getproductSinTkn);

router.use(validarJWT);

router.post(
  "/new",
  [
    check("name", "El nombre es opbligatorio").not().isEmpty(),
    check("category", "La categoria es obligatoria").not().isEmpty(),
    check("price", "El precio es opbligatorio").not().isEmpty(),
    validarCampos,
  ],
  createProduct
);

router.get("/", getProducts);

router.get("/:id", getProduct);

router.put("/", updateProduct);

router.put("/replace/:id", replaceProduct);

router.post("/enabled", enabledProducts);

//router.post("/added", aggregateProducts);

router.delete("/delete/:id", deleteProduct);

module.exports = router;
