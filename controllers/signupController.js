const { v4: uuid4 } = require('uuid');
const { createDistributor, createCustomer } = require('../controllers/dbController');

module.exports.getSignup = (url, req, res) => {
    if(url.includes('customers')){
        res.render('customer_sign_up');
    }

    if(url.includes('distributors')){
        res.render('distributor_sign_up');
    }
    
};

module.exports.postSignup = async (url, req, res) => {
    if (url.includes('customers')) {
        const customer = { shopname, email, phonenumber, division, district, policestation, shopaddress, password } = req.body;
        customer.dp = process.env.DEFAULT_DP;
        customer.id = uuid4();

        try {
            await createCustomer(customer, req, res);
        } catch (error) {
            console.error('Error creating user:', error)
            res.status(500).send(error.message);
        }
    }


    if (url.includes('distributors')) {
        const distributor = { firstname, lastname, email, nid, licence, phonenumber, divisions, district, policestation, address, password } = req.body;
        distributor.dp = process.env.DEFAULT_DP;
        distributor.id = uuid4();

        try {
            await createDistributor(distributor, req, res);
        } catch (error) {
            console.error('Error creating user:', error)
            res.status(500).send(error.message);
        }
    }


};