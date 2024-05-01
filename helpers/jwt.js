const jwt = require("jsonwebtoken");

const generarJWT = (id, nombre) => {
  return new Promise((resolve, reject) => {
    const payload = { id, nombre };

    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: "2h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        }

        resolve(token);
      }
    );
  });
};

module.exports = { generarJWT };
