const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");
// endpoint '/api/client
const { createAgent, loginAgent } = require("../controllers/customer");

const router = Router();

router.post("/new", createAgent);

router.post("/login", loginAgent);

router.use(validarJWT);

module.exports = router;
