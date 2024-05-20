const jwt = require('jsonwebtoken');
const generateSecretKey = require('./generateSecretKey');
const secretKey = generateSecretKey();


const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.tokenValid = false;
    next();
  } else {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        req.tokenValid = false;
      } else {
        req.tokenValid = true;
        req.user = decoded;
      }
      next();
    });
  }
};


module.exports = verifyToken;
