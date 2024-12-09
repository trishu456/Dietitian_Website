const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const User = require('./models/user'); // Import the User model

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/detail', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error: ", err));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // For parsing application/json

// Session management
app.use(session({
    secret: 'your_secret_key_here', // Replace with your secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set `secure: true` if using HTTPS
}));

// Paths for static files
const publicpath = path.join(__dirname, '../public');
const htmlpath = path.join(publicpath, 'html');
const csspath = path.join(publicpath, 'css');

app.use(express.static(publicpath));
app.use(express.static(htmlpath));
app.use(express.static(csspath));

// Routes
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(htmlpath, 'login.html'));
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(htmlpath, 'register.html'));
});

app.post('/register', async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        await User.create({ email, password });
        res.redirect('/login');
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Error inserting data');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            const isMatch = await user.comparePassword(password);
            if (isMatch) {
                req.session.userId = user._id; // Set session for authenticated user
                res.redirect('/index.html');
            } else {
                res.status(401).send('Invalid email or password');
            }
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Error during login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).send('Error during logout');
        }
        res.redirect('/login');
    });
});

// Diet routes
app.get('/getDietData', (req, res) => {
    const dietType = req.query.type; // Get the diet type from query parameter
    if (!dietType) {
        return res.status(400).send('Diet type is required');
    }

    const dietDataPath = path.join(__dirname, '..', 'public', 'data', `${dietType}.json`);
    
    fs.readFile(dietDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            res.status(500).send('Error reading data');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Contact routes
const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    message: String
});

const Contact = mongoose.model('Contact', contactSchema);

app.post('/contact', async (req, res) => {
    try {
        const { name, phone, message } = req.body;

        if (!name || !phone || !message) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        const contact = new Contact({ name, phone, message });
        await contact.save();
        res.status(200).json({ message: 'Contact info saved successfully!' });
    } catch (err) {
        console.error('Error saving contact info:', err);
        res.status(500).json({ message: 'Error saving contact info!' });
    }
});

// Error handling
app.use((req, res) => {
    res.status(404).sendFile(path.join(htmlpath, '404.html'));
});

// Start server
const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
