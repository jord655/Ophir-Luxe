

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: { 
      type: String, 
      required: true, 
      enum: ["ready to wear", "fabrics", "casual", "other"] 
    },
    image: { type: String }, // full URL to /uploads/...
    sizes: [{ type: String }],   // 👈 added
    colors: [{ type: String }]   // 👈 added
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);

