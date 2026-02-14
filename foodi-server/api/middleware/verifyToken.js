const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    return res.status(500).send({ message: "Server misconfiguration" });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }
    req.decoded = decoded;
    next();
  });
};

module.exports = verifyToken;