const mongoose4 = require('mongoose');
const OrderSchema = new mongoose4.Schema({
customer: {
name: String,
email: String,
phone: String,
state: String,
message: String
},
items: [{
productId: { type: mongoose4.Schema.Types.ObjectId, ref: 'Product' },
name: String,
price: Number,
image: String,
qty: Number
}],
amount: Number, // in Naira (e.g. 2500.50), we'll convert to kobo when calling Paystack
status: { type: String, default: 'pending' }, // pending | paid | failed
paystackRef: String,
authorization_url: String
}, { timestamps: true });
module.exports = mongoose4.model('Order', OrderSchema);