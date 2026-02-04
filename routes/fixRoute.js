// ===== routes/fixRoute.js =====
const express = require('express');
const router = express.Router();

// A simple test route to make sure Express paths are valid
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running, route path is valid!' });
});

// Optional redirect route example (use full URLs safely inside route handlers)
router.get('/redirect-to-frontend', (req, res) => {
  // Replace with your frontend URL if needed
  res.redirect('https://yourfrontenddomain.com');
});

module.exports = router;
