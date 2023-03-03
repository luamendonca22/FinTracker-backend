const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // token
  const authHeader = req.header("Authorization");

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
    console.log(error);
    res.status(400).json({ msg: "Token inválido" });
  }
};
