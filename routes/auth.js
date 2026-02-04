const express2 = require('express');
const routerAuth = express2.Router();
const bcrypt = require('bcryptjs');
const jwt2 = require('jsonwebtoken');
const Admin = require('../models/Admin');


// Login route
routerAuth.post('/login', async (req, res) => {
try {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
const admin = await Admin.findOne({ email });
if (!admin) return res.status(400).json({ message: 'Invalid credentials' });
const isMatch = await bcrypt.compare(password, admin.password);
if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
const token = jwt2.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


module.exports = routerAuth;