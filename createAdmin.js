// if (require.main === module) {
// (async () => {
// const mongooseC = require('mongoose');
// require('dotenv').config();
// const bcrypt2 = require('bcryptjs');
// const AdminModel = require('./models/Admin');
// try {
// await mongooseC.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// const existing = await AdminModel.findOne({ email: process.env.ADMIN_EMAIL });
// if (existing) {
// console.log('Admin already exists:', existing.email);
// process.exit(0);
// }
// const hashed = await bcrypt2.hash(process.env.ADMIN_PASSWORD, 10);
// const admin = new AdminModel({ email: process.env.ADMIN_EMAIL, password: hashed, name: 'Owner' });
// await admin.save();
// console.log('Admin created:', admin.email);
// process.exit(0);
// } catch (err) {
// console.error('createAdmin error', err);
// process.exit(1);
// }
// })();
// }


// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const User = require('./models/User');
// require('dotenv').config();

// mongoose.connect(process.env.MONGO_URI)
//   .then(async () => {
//     const email = "admin@example.com";
//     const password = "StrongPass123";

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const admin = new User({
//       name: "Admin",
//       email,
//       password: hashedPassword,
//       isAdmin: true,
//     });

//     await admin.save();
//     console.log("✅ Admin user created:", email, "/", password);
//     mongoose.disconnect();
//   })
//   .catch(err => console.error(err));



const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const email = process.env.ADMIN_EMAIL || "daviddike930@gmail.com";
    const password = process.env.ADMIN_PASSWORD || "08132330007";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists:", email);
      mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      name: "Admin",
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    await admin.save();
    console.log("✅ Admin user created:", email, "/", password);
    mongoose.disconnect();
  })
  .catch(err => console.error(err));

