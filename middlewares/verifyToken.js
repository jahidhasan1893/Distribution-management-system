require('dotenv').config();

const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const verifyToken = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    res.redirect('/home');
  } else {
    jwt.verify(token, secretKey, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/home');
      } else {
        if (decodedToken.userType === 'customer') {
          res.redirect(`/customers/dashboard?id=${decodedToken.id}`);
        } else {
          res.redirect(`/distributors/dashboard?id=${decodedToken.id}`);
        }
      }
    });
  }
};

module.exports = verifyToken;
