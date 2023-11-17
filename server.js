const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const cookieParser = require('cookie-parser');




const app = express();
const port = 3000;


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('views'));
app.use(cookieParser());


// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin1234',
  database: 'user',
});

// Function to generate a random string
const generateRandomString = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
};

// Function to generate a secret key
const generateSecretKey = () => {
  // Adjust the length as needed
  return generateRandomString(32); // Example: 32 characters
};

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







app.post('/customers1', (req, res) => {
  const shopname = req.body.shopname;
  const email = req.body.email;
  const phonenumber = req.body.phonenumber;
  const division = req.body.divisions;
  const district = req.body.district;
  const policestation = req.body.policestation;
  const address = req.body.shopaddress;
  const password = req.body.password;
  const dp = "images/businessman.png";


  if (!validator.isEmail(email)) {
    res.status(400).send('Invalid email address');
  }

  // Hash the password 
  bcrypt.hash(password, 10, function (err, hashedPassword) {
    // Store hash in your password DB.
    // Insert the hashed password and salt into the MySQL database
    pool.query('INSERT INTO customers (shopname, email, phonenumber, division, district, policestation, address, password, dp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [shopname, email, phonenumber, division, district, policestation, address, hashedPassword, dp], (error, results) => {
      if (error) {
        console.error('Error saving data to the database:', error);
        res.status(500).send('Error occurred. Please try again later.');
      } else {
        console.log('Data saved to the database successfully!');
        pool.query('SELECT * FROM products ', (error, products) => {
          if (error) {
            console.error('Error Log In:', error);
            return res.status(500).send('Error occurred. Please try again later.');
          }

          const token = jwt.sign({ email: email }, secretKey, { expiresIn: '1h' });

            // Save the token, for example, in a cookie or in local storage
            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

          res.render('customers', { email: email, products: products, dp: dp });
        });
      }
    });
  });


});


app.post('/distributors1', (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const nid = req.body.nid;
  const licence = req.body.licence;
  const phonenumber = req.body.phonenumber;
  const division = req.body.divisions;
  const district = req.body.district;
  const policestation = req.body.policestation;
  const address = req.body.address;
  const password = req.body.password;
  const dp = "images/businessman.png";


  if (!validator.isEmail(email)) {
    res.status(400).send('Invalid email address');
  }

  // Hash the password 
  bcrypt.hash(password, 10, function (err, hashedPassword) {
    // Store hash in your password DB.
    // Insert the hashed password and salt into the MySQL database
    pool.query('INSERT INTO distributors (firstname, lastname, email, nid, licence, phonenumber, division, district, policestation, address, password, dp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstname, lastname, email, nid, licence, phonenumber, division, district, policestation, address, hashedPassword, dp], (error, results) => {
      if (error) {
        console.error('Error saving data to the database:', error);
        res.status(500).send('Error occurred. Please try again later.');
      } else {
        console.log('Data saved to the database successfully!');
        pool.query('SELECT * FROM products ', (error, products) => {
          if (error) {
            console.error('Error Log In:', error);
            return res.status(500).send('Error occurred. Please try again later.');
          }

          const token = jwt.sign({ email: email }, secretKey, { expiresIn: '1h' });

            // Save the token, for example, in a cookie or in local storage
            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

          res.render('distributors', { email: email, products: products, dp: dp });
        });
      }
    });
  });


});




app.post('/customers2', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;



  if (!validator.isEmail(email)) {
    res.status(400).send('Invalid email address');
    return;
  }



  pool.query('SELECT * FROM customers WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Error Log In:', error);
      res.status(500).send('Error occurred. Please try again later.');
    } else {
      if (results.length === 0) {
        // User not found
        res.status(401).send('Invalid username or password.');
      } else {
        const user = results[0];


        bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            return res.status(500).send("Error comparing passwords");
          }


          if (result) {
            // User authenticated
            const token = jwt.sign({ email: email }, secretKey, { expiresIn: '1h' });

            // Save the token, for example, in a cookie or in local storage
            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

            pool.query('SELECT * FROM products ', (error, products) => {
              if (error) {
                console.error('Error Log In:', error);
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



          } else {
            // Password did not match
            res.status(401).send('Invalid username or password.');
          }
        });
      }
    }
  });

});


app.post('/distributor2', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;



  if (!validator.isEmail(email)) {
    res.status(400).send('Invalid email address');
    return;
  }



  pool.query('SELECT * FROM distributors WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Error Log In:', error);
      res.status(500).send('Error occurred. Please try again later.');
    } else {
      if (results.length === 0) {
        // User not found
        res.status(401).send('Invalid username or password.');
      } else {
        const user = results[0];


        bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            return res.status(500).send("Error comparing passwords");
          }


          if (result) {

            // User authenticated
            const token = jwt.sign({ email: email }, secretKey, { expiresIn: '1h' });

            // Save the token, for example, in a cookie or in local storage
            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

            pool.query('SELECT * FROM products ', (error, products) => {
              if (error) {
                console.error('Error Log In:', error);
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



          } else {
            // Password did not match
            res.status(401).send('Invalid username or password.');
          }
        });
      }
    }
  });

});




app.get('/customers_sign_up', (req, res) => {

  res.render('customer_sign_up');
});



app.get('/customers_sign_in', (req, res) => {

  res.render('customer_sign_in');
});

app.get('/distributors_sign_in', (req, res) => {

  res.render('distributor_sign_in');
});

app.get('/distributors_sign_up', (req, res) => {

  res.render('distributor_sign_up');
});


app.get('/customer_dashboard', (req, res) => {
  const email = req.query.email;
  pool.query('SELECT * FROM products ', (error, products) => {
    if (error) {
      console.error('Error Log In:', error);
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
});

app.get('/distributor_dashboard', (req, res) => {
  const email = req.query.email;
  pool.query('SELECT * FROM products ', (error, products) => {
    if (error) {
      console.error('Error Log In:', error);
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
});


app.get('/customers_profile', (req, res) => {

  const email = req.query.email;
  pool.query('SELECT * FROM customers WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Error Log In:', error);
      res.status(500).send('Error occurred. Please try again later.');
    } else {

      const user = results[0];
      res.render('customers_profile', { shopname: user.shopname, email: user.email, phonenumber: user.phonenumber, division: user.division, district: user.district, policestation: user.policestation, address: user.address, password: user.password, dp: user.dp });


    }
  });


});


app.get('/distributors_profile', (req, res) => {

  const email = req.query.email;
  pool.query('SELECT * FROM distributors WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Error Log In:', error);
      res.status(500).send('Error occurred. Please try again later.');
    } else {

      const user = results[0];
      res.render('distributors_profile', { firstname: user.firstname, lastname: user.lastname, email: user.email, nid: user.nid, licence: user.licence, phonenumber: user.phonenumber, division: user.division, district: user.district, policestation: user.policestation, address: user.address, password: user.password, dp: user.dp });


    }
  });


});


app.get('/customers_cart', (req, res) => {
  const email = req.query.email;
  pool.query('SELECT * FROM customers WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Error Log In:', error);
      res.status(500).send('Error occurred. Please try again later.');
    } else {

      const user = results[0];
      pool.query('SELECT * FROM cart WHERE userEmail = ?', [email], (error, carts) => {
        if (error) {
          console.error('Error Log In:', error);
          res.status(500).send('Error occurred. Please try again later.');
        } else {



          res.render('customers_cart', { shopname: user.shopname, email: user.email, phonenumber: user.phonenumber, division: user.division, district: user.district, policestation: user.policestation, address: user.address, carts: carts, dp: user.dp });


        }
      });
      // res.render('customers_cart', { shopname: user.shopname, email: user.email, phonenumber: user.phonenumber, division: user.division, district: user.district, policestation: user.policestation, address: user.address });


    }
  });
})


app.get('/distributors_cart', (req, res) => {
  const email = req.query.email;
  pool.query('SELECT * FROM distributors WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Error Log In:', error);
      res.status(500).send('Error occurred. Please try again later.');
    } else {

      const user = results[0];
      pool.query('SELECT * FROM cart WHERE userEmail = ?', [email], (error, carts) => {
        if (error) {
          console.error('Error Log In:', error);
          res.status(500).send('Error occurred. Please try again later.');
        } else {



          res.render('distributors_cart', { shopname: user.shopname, email: user.email, phonenumber: user.phonenumber, division: user.division, district: user.district, policestation: user.policestation, address: user.address, carts: carts, dp: user.dp });


        }
      });
      // res.render('customers_cart', { shopname: user.shopname, email: user.email, phonenumber: user.phonenumber, division: user.division, district: user.district, policestation: user.policestation, address: user.address });


    }
  });
})


app.get('/customers_orders', (req, res) => {
  const email = req.query.email;
  pool.query('SELECT * FROM customers WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Error Log In:', error);
      res.status(500).send('Error occurred. Please try again later.');
    }
    res.render('customer_orders', { email: email, dp: results[0].dp });
  });
});


app.get('/distributors_orders', (req, res) => {
  const email = req.query.email;
  pool.query('SELECT * FROM distributors WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Error Log In:', error);
      res.status(500).send('Error occurred. Please try again later.');
    }
    res.render('distributors_order', { email: email, dp: results[0].dp });
  });
});

app.get('/distributors_requests', (req, res) => {
  const email = req.query.email;
  pool.query('SELECT * FROM distributors WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Error Log In:', error);
      res.status(500).send('Error occurred. Please try again later.');
    }
    res.render('distributors_requests', { email: email, dp: results[0].dp });
  });
})


app.post('/add-to-cart', (req, res) => {
  const { productImg, productName, quantity, price, totalPrice, total, userEmail } = req.body;

  const sql = 'INSERT INTO cart (productImg, productName, quantity, price, totalPrice, total, userEmail) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [productImg, productName, quantity, price, totalPrice, total, userEmail];

  console.log("added to cart");
  pool.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }


    // Respond to the client.
    res.json({ success: true });
  });
});


app.get('/customer_logout', (req, res) => {
  res.clearCookie('token');
  res.render('customer_sign_in')
});

app.get('/distributor_logout', (req, res) => {
  res.clearCookie('token');
  res.render('distributor_sign_in')
})


app.listen(port, (req, res) => {
  console.log(`listening at port number ${port}`);
})