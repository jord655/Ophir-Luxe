


// const express = require('express');
// const router = express.Router();
// const Order = require('../models/Order');
// const Product = require('../models/Product');
// const axios = require('axios');
// const nodemailer = require('nodemailer');

// // ===== CREATE ORDER & INITIALIZE PAYSTACK =====
// router.post('/', async (req, res) => {
//   try {
//     const { items, customer } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: 'Cart is empty' });
//     }

//     // Calculate total & build order items
//     let amount = 0;
//     const orderItems = [];

//     for (const it of items) {
//       const product = await Product.findById(it.id);
//       if (!product) return res.status(400).json({ message: 'Invalid product in cart' });

//       const qty = Number(it.qty) || 1;
//       amount += product.price * qty;

//       orderItems.push({
//         productId: product._id,
//         name: product.name,
//         price: product.price,
//         image: product.image,
//         qty,
//       });
//     }

//     // Create new order
//     const newOrder = new Order({
//       customer,
//       items: orderItems,
//       amount,
//       status: 'paid',
//     });

//     await newOrder.save();

//     // Initialize Paystack
//     const paystackRes = await axios.post(
//       'https://api.paystack.co/transaction/initialize',
//       {
//         email: customer.email,
//         amount: Math.round(amount * 100), // Naira → Kobo
//         metadata: {
//           customer,
//           orderId: newOrder._id.toString(),
//           items: orderItems,
//         },
//         callback_url: `https://ophir-iuxe.netlify.app/home.html
// `,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     const { authorization_url, reference } = paystackRes.data.data;
//     newOrder.paystackRef = reference;
//     newOrder.authorization_url = authorization_url;
//     await newOrder.save();

//     res.json({
//       success: true,
//       paymentLink: authorization_url,
//       orderId: newOrder._id,
//     });

//   } catch (err) {
//     console.error(err.response ? err.response.data : err.message);
//     res.status(500).json({ message: 'Order creation failed' });
//   }
// });

// // ===== VERIFY PAYMENT =====
// router.get('/verify/:reference', async (req, res) => {
//   try {
//     const ref = req.params.reference;

//     const verifyRes = await axios.get(
//       `https://api.paystack.co/transaction/verify/${ref}`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
//         },
//       }
//     );

//     const data = verifyRes.data.data;

//     const order = await Order.findOne({ paystackRef: ref });
//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     if (data.status === 'success') {
//       order.status = 'paid';
//       await order.save();

//       // Send email notification with product details
//       const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
//       });

//       let productList = order.items
//         .map(
//           (i) => `
// 📦 ${i.name} (Qty: ${i.qty})
// 💰 ₦${i.price}
// 🖼 Image: ${i.image}
// `
//         )
//         .join('\n');

//       await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: process.env.CLIENT_EMAIL,
//         subject: `🛒 New Paid Order #${order._id}`,
//         text: `
// ✅ A new paid order has been received!

// Customer Details:
// Name: ${order.customer.name}
// Email: ${order.customer.email}
// Phone: ${order.customer.phone}
// State: ${order.customer.state}
// Message/Address: ${order.customer.message}

// Products:
// ${productList}

// Total: ₦${order.amount}

// View this order in your dashboard.
//         `,
//       });

//       return res.json({ verified: true, order });
//     }

//     // If failed
//     order.status = 'failed';
//     await order.save();
//     res.json({ verified: false, data });

//   } catch (err) {
//     console.error(err.response ? err.response.data : err.message);
//     res.status(500).json({ message: 'Payment verification failed' });
//   }
// });

// // ===== ADMIN: Get all PAID orders =====
// router.get('/paid', async (req, res) => {
//   try {
//     const paidOrders = await Order.find({ status: 'paid' }).sort({ createdAt: -1 });
//     res.json(paidOrders);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ message: 'Failed to fetch paid orders' });
//   }
// });

// // ===== ADMIN: Get ALL orders =====
// router.get('/', async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ message: 'Failed to fetch orders' });
//   }
// });

// // ===== ADMIN: Get single order by ID =====
// router.get('/:id', async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ message: 'Order not found' });
//     res.json(order);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ message: 'Failed to fetch order' });
//   }
// });

// // 

// module.exports = router;


const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const axios = require('axios');
const nodemailer = require('nodemailer');

// ===== CREATE ORDER & INITIALIZE PAYSTACK =====
router.post('/', async (req, res) => {
  try {
    const { items, customer } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total & build order items
    let amount = 0;
    const orderItems = [];

    for (const it of items) {
      const product = await Product.findById(it.id);
      if (!product) return res.status(400).json({ message: 'Invalid product in cart' });

      const qty = Number(it.qty) || 1;
      amount += product.price * qty;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty,
      });
    }

    // Create new order
    const newOrder = new Order({
      customer,
      items: orderItems,
      amount,
      status: 'paid',
    });

    await newOrder.save();

    // Initialize Paystack
    const paystackRes = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: customer.email,
        amount: Math.round(amount * 100), // Naira → Kobo
        metadata: {
          customer,
          orderId: newOrder._id.toString(),
          items: orderItems,
        },
        callback_url: `https://ophir-iuxe.netlify.app/home.html`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { authorization_url, reference } = paystackRes.data.data;
    newOrder.paystackRef = reference;
    newOrder.authorization_url = authorization_url;
    await newOrder.save();

    res.json({
      success: true,
      paymentLink: authorization_url,
      orderId: newOrder._id,
    });

  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).json({ message: 'Order creation failed' });
  }
});

// ===== VERIFY PAYMENT =====
router.get('/verify/:reference', async (req, res) => {
  try {
    const ref = req.params.reference;

    const verifyRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
        },
      }
    );

    const data = verifyRes.data.data;

    const order = await Order.findOne({ paystackRef: ref });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (data.status === 'success') {
      order.status = 'paid';
      await order.save();

      // Send email notification with product details
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      let productList = order.items
        .map(
          (i) => `
📦 ${i.name} (Qty: ${i.qty})
💰 ₦${i.price}
🖼 Image: ${i.image}
`
        )
        .join('\n');

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.CLIENT_EMAIL,
        subject: `🛒 New Paid Order #${order._id}`,
        text: `
✅ A new paid order has been received!

Customer Details:
Name: ${order.customer.name}
Email: ${order.customer.email}
Phone: ${order.customer.phone}
State: ${order.customer.state}
Message/Address: ${order.customer.message}

Products:
${productList}

Total: ₦${order.amount}

View this order in your dashboard.
        `,
      });

      return res.json({ verified: true, order });
    }

    // If failed
    order.status = 'failed';
    await order.save();
    res.json({ verified: false, data });

  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

// ===== ADMIN: Get all PAID orders =====
router.get('/paid', async (req, res) => {
  try {
    const paidOrders = await Order.find({ status: 'paid' }).sort({ createdAt: -1 });
    res.json(paidOrders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to fetch paid orders' });
  }
});

// ===== ADMIN: Get ALL orders =====
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// ===== ADMIN: Get single order by ID =====
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

// ===== ADMIN: Delete single order =====
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to delete order' });
  }
});

module.exports = router;