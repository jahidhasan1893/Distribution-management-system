const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const validator = require('validator');




const app = express();
const port = 3000;


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('views'));


// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin1234',
  database: 'user',
});







app.get('/', (req, res) => {
  res.sendFile(__dirname + "/views/home.html");
})







app.post('/customer_sign_up', (req, res) => {
  const shopname = req.body.shopname;
  const email = req.body.email;
  const phonenumber = req.body.phonenumber;
  const division = req.body.divisions;
  const district = req.body.district;
  const policestation = req.body.policestation;
  const address = req.body.shopaddress;
  const password = req.body.password;


  if (!validator.isEmail(email)) {
    res.status(400).send('Invalid email address');
  }

  // Hash the password 
  bcrypt.hash(password, 10, function (err, hashedPassword) {
    // Store hash in your password DB.
    // Insert the hashed password and salt into the MySQL database
    pool.query('INSERT INTO customers (shopname, email, phonenumber, division, district, policestation, address, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [shopname, email, phonenumber, division, district, policestation, address, hashedPassword], (error, results) => {
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

          res.render('customers', { email: email, products: products });
        });
      }
    });
  });


});




app.post('/customers', (req, res, next) => {
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
            // Password matched, login successful

            // // Generate a token
            // const token = generateToken(user);

            // // Set the token as an HTTP-only cookie
            // res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiry

            // res.json({email});
            // console.log(userEmail+"1");
            pool.query('SELECT * FROM products ', (error, products) => {
              if (error) {
                console.error('Error Log In:', error);
                return res.status(500).send('Error occurred. Please try again later.');
              }

              res.render('customers', { email: email, products: products });
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


app.get('/dashboard',(req,res)=>{
  const email = req.query.email;
  pool.query('SELECT * FROM products ', (error, products) => {
    if (error) {
      console.error('Error Log In:', error);
      return res.status(500).send('Error occurred. Please try again later.');
    }

    res.render('customers', { email: email, products: products });
  });
});


app.get('/profile', (req, res) => {

  const email = req.query.email;
  pool.query('SELECT * FROM customers WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Error Log In:', error);
      res.status(500).send('Error occurred. Please try again later.');
    } else {

      const user = results[0];
      res.render('customers_profile', { shopname: user.shopname, email: user.email, phonenumber: user.phonenumber, division: user.division, district: user.district, policestation: user.policestation, address: user.address, password: user.password });


    }
  });


});


app.get('/cart', (req, res) => {
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
    
          
          
          res.render('customers_cart', { shopname: user.shopname, email: user.email, phonenumber: user.phonenumber, division: user.division, district: user.district, policestation: user.policestation, address: user.address,carts: carts });
    
    
        }
      });
      // res.render('customers_cart', { shopname: user.shopname, email: user.email, phonenumber: user.phonenumber, division: user.division, district: user.district, policestation: user.policestation, address: user.address });


    }
  });
})


app.get('/orders', (req, res) => {
  const email = req.query.email;
  res.render('customer_orders', { email: email })
});


app.post('/add-to-cart', (req, res) => {
  const { productImg, productName, quantity, price, totalPrice, total, userEmail } = req.body;

  const sql = 'INSERT INTO cart (productImg, productName, quantity, price, totalPrice, total, userEmail) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [productImg, productName, quantity, price, totalPrice, total, userEmail];

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



app.listen(port, (req, res) => {
  console.log(`listening at port number ${port}`);
})