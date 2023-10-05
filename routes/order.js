const { Router } = require("express");
//const { validarJWT } = require("../middlewares/validar-jwt");

const { registerOrder } = require("../controllers/order");

const router = Router();

//router.use(validarJWT);

router.post("/", registerOrder);

// router.put("/update", updateOrder);

// router.get("/:id", getOrder);

module.exports = router;
