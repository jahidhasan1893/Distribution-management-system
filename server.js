require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const customerRoutes = require('./routes/customerRoutes');
const distributorRoutes = require('./routes/distributorRoutes');
const verifyToken=require('./middlewares/verifyToken');
const session = require('express-session');
const { getAllProducts } = require('./controllers/dbController');
const initDB = require('./middlewares/initDB');
const secretKey = process.env.SECRET_KEY;

const app = express();
const port = 3000;

app.use(initDB);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(session({secret: secretKey, resave: false, saveUninitialized: false}));


// set template engine

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));



app.use('/customers', customerRoutes);
app.use('/distributors', distributorRoutes);
app.use(getAllProducts);



app.get('/', (req, res) => {
    verifyToken(req, res);
});

app.get('/home', (req, res)=>{
  res.sendFile(__dirname + "/views/home.html");
})




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});