const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');

// Initialize Express app
const app = express();

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Item model
const Item = mongoose.model('Item', {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }
});

// Routes

// Create (GET)
app.get('/items/new', (req, res) => {
    res.render('new');
});

// Create (POST)
app.post('/items', async (req, res) => {
    try {
        await Item.create(req.body);
        res.redirect('/items');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Read (GET)
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.render('index', { items });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Update (GET)
app.get('/items/:id/edit', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        res.render('edit', { item });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Update (PUT)
app.put('/items/:id', async (req, res) => {
    try {
        await Item.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/items');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Delete (DELETE)
app.delete('/items/:id', async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.redirect('/items');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});