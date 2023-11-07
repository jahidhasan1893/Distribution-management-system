const express =require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');




const app =express();
const port=3000;



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



app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/views/home.html");
})







app.post('/customer_sign_up', (req, res) => {
  const shopname = req.body.shopname;
  const email=req.body.email;
  const phonenumber=req.body.phonenumber;
  const division= req.body.divisions;
  const district=req.body.district;
  const policestation=req.body.policestation;
  const address=req.body.shopaddress;
  const password = req.body.password;


  // Hash the password 
  bcrypt.hash(password, 10, function(err, hashedPassword) {
    // Store hash in your password DB.
    // Insert the hashed password and salt into the MySQL database
  pool.query('INSERT INTO customers (shopname, email, phonenumber, division, district, policestation, address, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [shopname, email, phonenumber, division, district, policestation, address, hashedPassword], (error, results) => {
    if (error) {
      console.error('Error saving data to the database:', error);
      res.status(500).send('Error occurred. Please try again later.');
    } else {
      console.log('Data saved to the database successfully!');
      res.redirect('/customers.html');
    }
  });
});

  
});




app.post('/customer_sign_in', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;


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
         

        bcrypt.compare(password, user.password, function(err, result) {
          if (err) {
            return res.status(500).send("Error comparing passwords");
          }


          if (result) {
            // Password matched, login successful
  
            // // Generate a token
            // const token = generateToken(user);
  
            // // Set the token as an HTTP-only cookie
            // res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiry
  
            res.redirect('/customers.html');
          } else {
            // Password did not match
            res.status(401).send('Invalid username or password.');
          }
      });
      }
    }
  });
 
});



  




app.listen(port,(req,res)=>{
    console.log(`listening at port number ${port}`);
})