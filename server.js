const express = require('express');
const mysql2 = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',     // Replace with your MySQL username
    password: '12345678',     // Replace with your MySQL password
    database: 'my_database'  // Replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Fetch Entries
app.get('/entries', (req, res) => {
    const query = 'SELECT * FROM entries';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching entries:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results);
    });
});

// Search Endpoint
app.get('/search', (req, res) => {
    const searchQuery = req.query.q || '';
    const query = `SELECT * FROM entries WHERE medicine LIKE ? OR category LIKE ? OR vendor LIKE ?`;
    const searchPattern = `%${searchQuery}%`;

    db.query(query, [searchPattern, searchPattern, searchPattern], (err, results) => {
        if (err) {
            console.error('Error during search:', err.message);
            res.status(500).json({ error: 'Database error', details: err.message });
            return;
        }
        res.json(results);
    });
});

// Add Entry
app.post('/entries', (req, res) => {
    const { medicine, category, vendor, stock, quantity, expire } = req.body;
    const query = 'INSERT INTO entries (medicine, category, vendor, stock, quantity, expire) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [medicine, category, vendor, stock, quantity, expire], (err, result) => {
        if (err) {
            console.error('Error adding entry:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ batch: result.insertId });
    });
});

// Update Entry
app.put('/entries/:batch', (req, res) => {
    const { batch } = req.params;
    const { medicine, category, vendor, stock, quantity, expire } = req.body;

    const query = 'UPDATE entries SET medicine = ?, category = ?, vendor = ?, stock = ?, quantity = ?, expire = ? WHERE batch = ?';

    db.query(query, [medicine, category, vendor, stock, quantity, expire, batch], (err, result) => {
        if (err) {
            console.error('Error updating entry:', err);
            res.status(500).json({ error: 'Database error', details: err.message });
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Entry not found' });
            return;
        }

        res.json({ updated: true, message: 'Entry updated successfully', affectedRows: result.affectedRows });
    });
});

// Delete Entry
app.delete('/entries/:batch', (req, res) => {
    const { batch } = req.params;
    const query = 'DELETE FROM entries WHERE batch = ?';
    db.query(query, [batch], (err, result) => {
        if (err) {
            console.error('Error deleting entry:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ deleted: result.affectedRows > 0 });
    });
});

// Get orders by hospital ID
app.get('/api/orders/hospital/:id', (req, res) => {
    const query = `
        SELECT o.*, v.vendor_name 
        FROM orders o 
        JOIN vendors v ON o.vendor_id = v.vendor_id 
        WHERE o.hospital_id = ?
        ORDER BY o.order_date DESC
    `;
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});

// Create new order
app.post('/api/orders', (req, res) => {
    const { hospital_id, vendor_id, medicine_name, quantity } = req.body;
    const query = `
        INSERT INTO orders (hospital_id, vendor_id, medicine_name, quantity, order_date, status) 
        VALUES (?, ?, ?, ?, CURDATE(), 'Pending')
    `;
    db.query(query, [hospital_id, vendor_id, medicine_name, quantity], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(201).json({ message: 'Order created successfully', orderId: result.insertId });
    });
});

// Get all vendors
app.get('/api/vendors', (req, res) => {
    const query = 'SELECT * FROM vendors';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});

// Get orders by vendor ID
app.get('/api/orders/vendors/:id', (req, res) => {
    const query = `
        SELECT o.*, c.name as hospital_name 
        FROM orders o 
        JOIN hospital c ON o.hospital_id = c.hospital_id 
        WHERE o.vendor_id = ?
    `;
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});

// Update order status
app.put('/api/orders/:id/status', (req, res) => {
    const { status, notes } = req.body;
    const query = 'UPDATE orders SET status = ?, notes = ? WHERE order_id = ?';
    db.query(query, [status, notes, req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({ message: 'Order status updated successfully' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});