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
  const email = req.query.email;
  pool.query('SELECT * FROM customers WHERE email = ?', [email], (error, results) => {
    if (error) {
      res.status(500).send('Error occurred. Please try again later.');
      return;
    }
    const user = results[0];
    res.render('customers_profile', { ...user });
  });
});

router.get('/cart', (req, res) => {
  const email = req.query.email;
  pool.query('SELECT * FROM customers WHERE email = ?', [email], (error, results) => {
    if (error) {
      res.status(500).send('Error occurred. Please try again later.');
      return;
    }
    const user = results[0];
    pool.query('SELECT * FROM cart WHERE userEmail = ?', [email], (error, carts) => {
      if (error) {
        res.status(500).send('Error occurred. Please try again later.');
        return;
      }
      res.render('customers_cart', { ...user, carts });
    });
  });
});

router.get('/orders', (req, res) => {
  const email = req.query.email;
  pool.query('SELECT * FROM customers WHERE email = ?', [email], (error, results) => {
    if (error) {
      res.status(500).send('Error occurred. Please try again later.');
      return;
    }
    res.render('customer_orders', { email, dp: results[0].dp });
  });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.render('customer_sign_in');
});

module.exports = router;
