const express = require('express');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); 
const verifyToken = require('../middlewares/verifyToken');
const signupController = require('../controllers/signupController');
const signinController = require('../controllers/signinController');
const { getAllProducts } = require('../controllers/dbController');

const router = express.Router();
const secretKey = process.env.SECRET_KEY;



router.get('/sign_up', (req, res)=>signupController.getSignup(req.originalUrl, req, res)); 

router.get('/sign_in', (req, res)=>signinController.getSignin(req.originalUrl, req, res));

router.post('/sign_up', (req, res)=>signupController.postSignup(req.originalUrl, req, res));

router.post('/sign_in', (req, res)=>signinController.postSignin(req.originalUrl, req, res));


router.get('/dashboard', (req, res) => {
  res.render('distributors', { user: req.session.user , products: req.session.products });
});

router.get('/profile', (req, res) => {
  res.render('distributors_profile', { user });
});

router.get('/orders', (req, res) => {
  const email = req.query.email;
  pool.query('SELECT * FROM distributors WHERE email = ?', [email], (error, results) => {
    if (error) {
      res.status(500).send('Error occurred. Please try again later.');
      return;
    }
    res.render('distributor_orders', { email, dp: results[0].dp });
  });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/distributors/sign_in')
});

module.exports = router;

