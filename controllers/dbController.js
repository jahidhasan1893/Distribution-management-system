require('dotenv').config();
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const secretKey = process.env.SECRET_KEY;

module.exports.createCustomer = async (customer, req, res) => {
    if (!validator.isEmail(customer.email)) {
        res.status(400).send('Invalid email address');
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(customer.password, 10);
        customer.password = hashedPassword;

        const results = await pool.query(
            'INSERT INTO customers (id, shopname, email, phonenumber, division, district, policestation, shopaddress, password_hash, dp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [customer.id, customer.shopname, customer.email, customer.phonenumber, customer.division, customer.district, customer.policestation, customer.shopaddress, customer.password, customer.dp]
        );

        const token = jwt.sign({ id: customer.id, userType: 'distributor' }, secretKey, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
        res.redirect(`/customers/dashboard?id=${customer.id}`);
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).send(error.message);
        return;
    }
};




module.exports.createDistributor = async (distributor, req, res) => {
    if (!validator.isEmail(distributor.email)) {
        res.status(400).send('Invalid email address');
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(distributor.password, 10);
        distributor.password = hashedPassword;

        await pool.query(
            'INSERT INTO distributors (id, firstname, lastname, email, nid, licence, phonenumber, division, district, policestation, address, password_hash, dp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [distributor.id, distributor.firstname, distributor.lastname, distributor.email, distributor.nid, distributor.licence, distributor.phonenumber, distributor.division, distributor.district, distributor.policestation, distributor.address, distributor.password, distributor.dp],
            (error, results) => {
                if (error) {
                    console.error('Error inserting distributor:', error);
                    return res.status(500).send(error.message);
                }

                try {
                    const token = jwt.sign({ id: distributor.id, userType: 'distributor' }, secretKey, { expiresIn: '1h' });
                    console.log(token);
                    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
                    res.redirect(`/distributors/dashboard?id=${distributor.id}`);
                } catch (error) {
                    res.status(500).send(error.message);
                    return;
                }
            }
        );
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).send(error.message);
        return;
    }
};



module.exports.verifyCustomer = async (email, password, req, res) => {
    if (!validator.isEmail(email)) {
        res.status(400).send('Invalid email address');
        return;
    }

    pool.query('SELECT * FROM customers WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.error('Error Log In:', error);
            res.status(500).send('Error occurred. Please try again later.');
            return;
        }

        if (results.length === 0) {
            res.status(401).send('Invalid username or password.');
            return;
        }

        const user = results[0];


        await bcrypt.compare(password, user.password_hash, (err, result) => {
            if (result) {
                const token = jwt.sign({ id: user.id, userType: 'customer' }, secretKey, { expiresIn: '1h' });
                res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
                req.session.user = user;
                res.redirect(`/customers/dashboard?id=${user.id}`);
            }
            else {
                res.status(500).send('Error comparing passwords');
                return;
            }
        });
    });
};


module.exports.verifyDistributor = async (email, password, req, res) => {

    if (!validator.isEmail(email)) {
        res.status(400).send('Invalid email address');
        return;
    }

    await pool.query('SELECT * FROM distributors WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.error('Error Log In:', error);
            res.status(500).send('Error occurred. Please try again later.');
            return;
        }

        if (results.length === 0) {
            res.status(401).send('Invalid username or password.');
            return;
        }

        const user = results[0];


        await bcrypt.compare(password, user.password_hash, (err, result) => {
            if (result) {
                const token = jwt.sign({ id: user.id, userType: 'distributor' }, secretKey, { expiresIn: '1h' });
                req.session.user = user;
                res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
                res.redirect(`/distributors/dashboard?id=${user.id}`);
            }
            else {
                res.status(500).send('Error comparing passwords');
                return;
            }
        });
    });
};


module.exports.getAllProducts = (req, res, next) => {
    pool.query('SELECT * FROM products', (error, results) => {
        if (error) {
            console.error('Error fetching products:', error);
            res.status(500).send('An error occurred while fetching products.');
            return;
        }

        const products = results.map(result => {
            return {
                id: result.id,
                product_name: result.product_name,
                MRP: result.MRP,
                link_of_image: result.link_of_image
            };
        });



        req.session.products = results;
        next();
    });
};


// module.exports.findCustomer = (email, req, res) => {
//      pool.query('SELECT * FROM customers WHERE email = ?', [email], (error, results) => {
//         if (error) {
//             console.log(error);
//             res.locals.user = null;
//         }
//         else {
//             const user = {...results[0]};
//             console.log("customer", user);
//             if(user) res.locals.user = user;
//             else res.locals.user = null;
//         }

//     });
// };

// module.exports.findDistributor = (email, req, res) => {
//     pool.query('SELECT * FROM distributors WHERE email = ?', [email], (error, results) => {
//         if (error) {
//             console.log(error);
//             res.locals.user = null;
//         }
//         else {
//             const user = {...results[0]};
//             console.log("distributor", user);
//             if(user) res.locals.user = user;
//             else res.locals.user = null;
//         }

//     });
// };


