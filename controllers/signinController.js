const { v4: uuid4 } = require('uuid');
const {  verifyDistributor, verifyCustomer } = require('../controllers/dbController');

module.exports.getSignin = (url, req, res) => {
    if(url.includes('customer')){
        res.render('customer_sign_in');
    }

    if(url.includes('distributors')){
        res.render('distributor_sign_in');
    }
};

module.exports.postSignin = async (url, req, res) => {
    if (url.includes('customers')) {
        const customer = { email, password } = req.body;

        try {
            await verifyCustomer(customer.email, customer.password, req, res);
        } catch (error) {
            console.error('Error creating user:', error)
            res.status(500).send(error.message);
        }
    }

    if (url.includes('distributors')) {
        const distributor = { email, password } = req.body;


        try {
            await verifyDistributor(distributor.email, distributor.password, req, res);
        } catch (error) {
            console.error('Error creating user:', error)
            res.status(500).send(error.message);
        }
    }
  };
  