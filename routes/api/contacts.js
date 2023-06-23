const express = require('express');

const router = express.Router();

router.get('/', async (req, res, next) => {
  res.json({ message: 'template message' });
});

router.get('/:id', async (req, res, next) => {
  res.json({ message: 'template message' });
});

router.post('/', async (req, res, next) => {
  res.json({ message: 'template message' });
});

router.delete('/:id', async (req, res, next) => {
  res.json({ message: 'template message' });
});

router.put('/:id', async (req, res, next) => {
  res.json({ message: 'template message' });
});

module.exports = router;
