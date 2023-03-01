const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // token
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  // vem neste formato "Bearer safsajdhae", temos que fazer split
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado" });
  }

  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (error) {
    res.status(400).json({ msg: "Token inválido" });
  }
};
