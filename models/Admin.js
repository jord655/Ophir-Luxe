const mongoose2 = require('mongoose');
const AdminSchema = new mongoose2.Schema({
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
name: { type: String }
}, { timestamps: true });
module.exports = mongoose2.model('Admin', AdminSchema);