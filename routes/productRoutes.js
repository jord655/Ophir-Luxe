import express from "express";
import multer from "multer";
import Product from "../models/Product.js";

const router = express.Router();

// Image upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ✅ Add Product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Parse arrays (sizes & colors)
    if (req.body.sizes) {
      try { req.body.sizes = JSON.parse(req.body.sizes); } catch { req.body.sizes = []; }
    }
    if (req.body.colors) {
      try { req.body.colors = JSON.parse(req.body.colors); } catch { req.body.colors = []; }
    }

    const product = new Product({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      sizes: req.body.sizes || [],
      colors: req.body.colors || [],
      image: req.file ? `/uploads/${req.file.filename} `: ""
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding product" });
  }
});

// ✅ Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// ✅ Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

export default router;