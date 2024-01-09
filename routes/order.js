const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");

const {
  registerOrder,
  getOrders,
  getOrdersGrouped,
  updateOrder,
  getOrder,
  registerRatesServices,
  registerRatesApp,
} = require("../controllers/order");

const router = Router();

router.post("/", registerOrder);

router.post("/rateservice", registerRatesServices);

router.post("/rateapp", registerRatesApp);
//router.use(validarJWT);
router.get("/:id", getOrder);

router.post("/orderlist", getOrders);

router.post("/totalgrouped", getOrdersGrouped);

router.put("/update", updateOrder);

// router.get("/:id", getOrder);

module.exports = router;
