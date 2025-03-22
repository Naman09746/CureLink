const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Create connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: '', // Replace with your MySQL password
    database: 'CureLinkCRM'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to the database');
});

app.use(bodyParser.json());
app.use(express.static('public'));

// API to get all orders
app.get('/api/orders', (req, res) => {
    const sql = 'SELECT * FROM Orders';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// API to create a new order
app.post('/api/orders', (req, res) => {
    const { customerName, customerPhone, customerEmail, itemName, orderId, orderDate, quantity, discount, tax, totalAmount, paymentMethod } = req.body;
    const sql = `INSERT INTO Orders (customerName, customerPhone, customerEmail, itemName, orderId, orderDate, quantity, discount, tax, totalAmount, paymentMethod) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [customerName, customerPhone, customerEmail, itemName, orderId, orderDate, quantity, discount, tax, totalAmount, paymentMethod];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});