const express = require('express');
const signupController = require('../controllers/signupController');
const signinController = require('../controllers/signinController');


const router = express.Router();
const secretKey = process.env.SECRET_KEY;




router.get('/sign_up', (req, res)=>signupController.getSignup(req.originalUrl, req, res)); 

router.get('/sign_in', (req, res)=>signinController.getSignin(req.originalUrl, req, res));

router.post('/sign_up', (req, res)=>signupController.postSignup(req.originalUrl, req, res));

router.post('/sign_in', (req, res)=>signinController.postSignin(req.originalUrl, req, res));


router.get('/dashboard', (req, res) => {
  res.render('customers', { user: req.session.user , products: req.session.products });
});

router.get('/profile', (req, res) => {
  res.render('customers_profile', { user: req.session.user });
});


router.get('/cart', (req, res) => {
  res.render('customers_cart', { user: req.session.user });
});


router.get('/orders', (req, res) => {
  res.render('customer_orders', { user: req.session.user });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/customers/sign_in')
});

module.exports = router;
