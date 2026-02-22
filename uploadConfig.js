// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Save images here
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // unique filename
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true); // allow any image type
//   } else {
//     cb(new Error('Only images allowed!'), false);
//   }
// };

// const upload = multer({ storage, fileFilter });
// module.exports = upload;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary'); // your cloudinary config file

// === Cloudinary storage for Multer ===
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ophir-luxe',              // folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // allowed image types
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // optional resizing
  },
});

const upload = multer({ storage });

module.exports = upload;