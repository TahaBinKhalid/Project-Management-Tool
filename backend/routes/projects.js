const express = require('express');
const router = express.Router();

// Simple test endpoint
router.get('/', (req, res) => {
  res.json([
    { 
      _id: '69551fc9a9b5d07916c76504', 
      name: 'Default Project', 
      description: 'Main project board' 
    }
  ]);
});

module.exports = router;