const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
try {
const header = req.headers.authorization;
if (!header) return res.status(401).json({ message: 'No token provided' });
const token = header.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.adminId = decoded.id;
next();
} catch (err) {
return res.status(401).json({ message: 'Invalid token' });
}
};