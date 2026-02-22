

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

// // === GET SINGLE PRODUCT BY ID ===
// router.get("/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product)
//       return res.status(404).json({ message: "Product not found" });
//     res.json(product);
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
//       // sizes: req.body.sizes,
//       // colors: req.body.colors,
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






const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// === Cloudinary storage for Multer ===
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ophir-luxe",          // folder in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
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
      image: req.file ? req.file.path : null,       // Cloudinary URL
      imageId: req.file ? req.file.filename : null // Cloudinary public_id
    });

    const saved = await newProduct.save();
    res.json(saved);
  } catch (err) {
    console.error(err);
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
    if (!product) return res.status(404).json({ message: "Product not found" });
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
      category: req.body.category,
    };

    if (req.file) {
      // If replacing image, delete old one first
      const product = await Product.findById(req.params.id);
      if (product && product.imageId) {
        await cloudinary.uploader.destroy(product.imageId);
      }

      updatedData.image = req.file.path;
      updatedData.imageId = req.file.filename;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// === DELETE PRODUCT ===
router.delete("/:id", auth, async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Product not found" });

    // Delete image from Cloudinary
    if (prod.imageId) {
      await cloudinary.uploader.destroy(prod.imageId);
    }

    await prod.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;







































































// const express = require("express");
// const router = express.Router();
// const Product = require("../models/Product");
// const auth = require("../middleware/auth");
// const cloudinary = require("../config/cloudinary");
// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");

// // === Cloudinary storage for Multer ===
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "ophir-luxe",          // folder in Cloudinary
//     allowed_formats: ["jpg", "png", "jpeg", "webp"],
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
//       image: req.file ? req.file.path : null, // Cloudinary URL
//     });

//     const saved = await newProduct.save();
//     res.json(saved);
//   } catch (err) {
//     console.error(err);
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

// // === GET SINGLE PRODUCT BY ID ===
// router.get("/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.json(product);
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
//     };

//     if (req.file) {
//       updatedData.image = req.file.path; // new Cloudinary URL
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

//     // Delete image from Cloudinary
//     if (prod.image) {
//       // Extract public_id from Cloudinary URL
//       const segments = prod.image.split("/");
//       const publicIdWithExt = segments.slice(-1)[0]; // last segment
//       const publicId = "ophir-luxe/" + publicIdWithExt.split(".")[0]; // folder + filename without extension

//       cloudinary.uploader.destroy(publicId, (error, result) => {
//         if (error) console.warn("Cloudinary delete error:", error);
//       });
//     }

//     await prod.deleteOne();
//     res.json({ message: "Product deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;
