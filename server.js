const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const customerRoutes = require('./routes/customerRoutes');
const distributorRoutes = require('./routes/distributorRoutes');
const verifyToken=require('./middlewares/verifyToken')

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('views'));
app.use(cookieParser());



app.use('/customers', customerRoutes);
app.use('/distributors', distributorRoutes);


app.get('/', verifyToken, (req, res) => {
  if (req.tokenValid) {
    const email = req.user.email;


    pool.query('SELECT * FROM customers WHERE email = ?', [email], (error, results) => {

      if (results.length === 0) {
        pool.query('SELECT * FROM distributors WHERE email = ?', [email], (error, results) => {

          if (results.length === 0) {
            // User not found
            res.sendFile(__dirname + "/views/home.html");
          } else {
            const user = results[0];


            pool.query('SELECT * FROM products ', (error, products) => {
              if (error) {
                return res.status(500).send('Error occurred. Please try again later.');
              }
              pool.query('SELECT * FROM distributors WHERE email = ?', [email], (error, results) => {
                if (error) {
                  console.error('Error Log In:', error);
                  res.status(500).send('Error occurred. Please try again later.');
                }
                res.render('distributors', { email: email, products: products, dp: results[0].dp });
              });

            });
          }


        });
      } else {
        const user = results[0];


        pool.query('SELECT * FROM products ', (error, products) => {
          if (error) {
            return res.status(500).send('Error occurred. Please try again later.');
          }
          pool.query('SELECT * FROM customers WHERE email = ?', [email], (error, results) => {
            if (error) {
              console.error('Error Log In:', error);
              res.status(500).send('Error occurred. Please try again later.');
            }
            res.render('customers', { email: email, products: products, dp: results[0].dp });
          });

        });
      }


    });
  }
  else{
    res.sendFile(__dirname + "/views/home.html");
  }
});





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});