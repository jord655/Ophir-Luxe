const express5 = require('express');
const routerContact = express5.Router();


// We'll keep contact simple: log to server and respond success. You can expand to store in DB or send email using nodemailer.
routerContact.post('/', (req, res) => {
try {
const { name, email, subject, message } = req.body;
console.log('Contact form submission:', { name, email, subject, message });
// TODO: store or send email
res.json({ success: true });
} catch (err) {
console.error(err);
res.status(500).json({ success: false });
}
});


module.exports = routerContact;