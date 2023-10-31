const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");

const {
  registerOrder,
  getOrders,
  getOrdersGrouped,
  updateOrder,
} = require("../controllers/order");

const router = Router();

router.post("/", registerOrder);
//router.use(validarJWT);

router.post("/orderlist", getOrders);

router.post("/totalgrouped", getOrdersGrouped);

router.put("/update", updateOrder);

// router.get("/:id", getOrder);

module.exports = router;
