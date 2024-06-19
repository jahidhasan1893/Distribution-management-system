require('dotenv').config();

const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;



const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.redirect('/home')
  } else {
    jwt.verify(token, secretKey, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/home');
      } else {
        next();
      }
    });
  }
};


module.exports = verifyToken;