const pool = require('../config/db'); 

const createProductsTable = async () => {
    const createQuery = `
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_name VARCHAR(255) NOT NULL,
            MRP DECIMAL(10, 2) NOT NULL,
            link_of_image VARCHAR(255) NOT NULL
        )
    `;
    try {
        await pool.query(createQuery);
    } catch (err) {
        console.error('Error creating products table:', err);
        throw err;
    }
};

const createCustomersTable = async () => {
    const createQuery = `
        CREATE TABLE IF NOT EXISTS customers (
            id VARCHAR(255) PRIMARY KEY,
            shopname VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            phonenumber VARCHAR(20) UNIQUE,
            division VARCHAR(255),
            district VARCHAR(255),
            policestation VARCHAR(255),
            shopaddress VARCHAR(255),
            password_hash VARCHAR(255),
            dp VARCHAR(255)
        )
    `;
    try {
        await pool.query(createQuery);
    } catch (err) {
        console.error('Error creating customers table:', err);
        throw err;
    }
};

const createDistributorsTable = async () => {
    const createQuery = `
        CREATE TABLE IF NOT EXISTS distributors (
            id VARCHAR(255) PRIMARY KEY,
            firstname VARCHAR(255),
            lastname VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            nid VARCHAR(255),
            licence VARCHAR(255),
            phonenumber VARCHAR(20) UNIQUE,
            division VARCHAR(255),
            district VARCHAR(255),
            policestation VARCHAR(255),
            address TEXT,
            password_hash VARCHAR(255),
            dp VARCHAR(255)
        )
    `;
    try {
        await pool.query(createQuery);
    } catch (err) {
        console.error('Error creating distributors table:', err);
        throw err;
    }
};

const initDB = async (req, res, next) => {
    try {
        await createProductsTable();
        await createCustomersTable();
        await createDistributorsTable();
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = initDB;
