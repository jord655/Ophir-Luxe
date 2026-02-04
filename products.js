
// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const Product = require("../models/Product");
// const auth = require("../middleware/auth"); // JWT middleware

// // === Multer setup for file upload ===
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Save all uploaded images in 'uploads/' folder
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     // Generate a fully unique filename
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname); // preserves .png, .jpg, etc.
//     cb(null, uniqueSuffix + ext);
//   },
// });

// const upload = multer({ storage });

// // === ADD PRODUCT ===
// router.post("/", auth, upload.single("image"), async (req, res) => {
//   try {
//     const newProduct = new Product({
//       name: req.body.name,
//       description: req.body.description,
//       price: req.body.price,
//       stock: req.body.stock,
//       category: req.body.category,
//       // Always generate full URL for frontend
//       image: req.file
//         ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
//         : null,
//     });

//     const saved = await newProduct.save();
//     res.json(saved);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // === GET ALL PRODUCTS ===
// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // === GET PRODUCTS BY CATEGORY ===
// router.get("/category/:cat", async (req, res) => {
//   try {
//     const products = await Product.find({ category: req.params.cat });
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // === UPDATE PRODUCT ===
// router.put("/:id", auth, upload.single("image"), async (req, res) => {
//   try {
//     const updatedData = {
//       name: req.body.name,
//       description: req.body.description,
//       price: req.body.price,
//       stock: req.body.stock,
//       category: req.body.category,
//       sizes: req.body.sizes,
//       colors: req.body.colors
//     };

//     if (req.file) {
//       updatedData.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
//     }

//     const updated = await Product.findByIdAndUpdate(req.params.id, updatedData, {
//       new: true,
//     });

//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // === DELETE PRODUCT ===
// router.delete("/:id", auth, async (req, res) => {
//   try {
//     const prod = await Product.findById(req.params.id);
//     if (!prod) return res.status(404).json({ message: "Product not found" });

//     // Remove file from uploads folder
//     if (prod.image) {
//       const filename = prod.image.split("/uploads/")[1];
//       const fs = require("fs");
//       fs.unlink(path.join(__dirname, "..", "uploads", filename), (err) => {
//         if (err) console.warn("Could not delete file:", err.message);
//       });
//     }

//     await prod.deleteOne();
//     res.json({ message: "Product deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;



// // const express = require("express");
// // const router = express.Router();
// // const Product = require("./models/product");

// // // ==================
// // // GET all products
// // // ==================
// // router.get("/", async (req, res) => {
// //   try {
// //     const products = await Product.find();
// //     res.json(products);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // // ==================
// // // GET single product by ID
// // // ==================
// // router.get("/:id", async (req, res) => {
// //   try {
// //     const product = await Product.findById(req.params.id);
// //     if (!product) return res.status(404).json({ message: "Product not found" });
// //     res.json(product);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // // ==================
// // // POST - create product
// // // ==================
// // router.post("/", async (req, res) => {
// //   try {
// //     const { name, description, price, stock, category, image, sizes, colors } = req.body;

// //     const product = new Product({
// //       name,
// //       description,
// //       price,
// //       stock,
// //       category,
// //       image,
// //       sizes: sizes || [],   // make sure sizes is array
// //       colors: colors || []  // make sure colors is array
// //     });

// //     const newProduct = await product.save();
// //     res.status(201).json(newProduct);
// //   } catch (err) {
// //     res.status(400).json({ message: err.message });
// //   }
// // });

// // // ==================
// // // PUT - update product
// // // ==================
// // router.put("/:id", async (req, res) => {
// //   try {
// //     const updatedProduct = await Product.findByIdAndUpdate(
// //       req.params.id,
// //       req.body,
// //       { new: true }
// //     );
// //     if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
// //     res.json(updatedProduct);
// //   } catch (err) {
// //     res.status(400).json({ message: err.message });
// //   }
// // });

// // // ==================
// // // DELETE product
// // // ==================
// // router.delete("/:id", async (req, res) => {
// //   try {
// //     const deletedProduct = await Product.findByIdAndDelete(req.params.id);
// //     if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
// //     res.json({ message: "Product deleted successfully" });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");
const auth = require("../middleware/auth"); // JWT middleware

// === Multer setup for file upload ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save all uploaded images in 'uploads/' folder
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Generate a fully unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // preserves .png, .jpg, etc.
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// === ADD PRODUCT ===
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      // Always generate full URL for frontend
      image: req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : null,
    });

    const saved = await newProduct.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === GET ALL PRODUCTS ===
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === GET PRODUCTS BY CATEGORY ===
router.get("/category/:cat", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.cat });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === GET SINGLE PRODUCT BY ID ===
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === UPDATE PRODUCT ===
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const updatedData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category
      // sizes: req.body.sizes,
      // colors: req.body.colors,
    };

    if (req.file) {
      updatedData.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === DELETE PRODUCT ===
router.delete("/:id", auth, async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Product not found" });

    // Remove file from uploads folder
    if (prod.image) {
      const filename = prod.image.split("/uploads/")[1];
      const fs = require("fs");
      fs.unlink(path.join(__dirname, "..", "uploads", filename), (err) => {
        if (err) console.warn("Could not delete file:", err.message);
      });
    }

    await prod.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
