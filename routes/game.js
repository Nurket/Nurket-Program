const express = require('express');
const router = express.Router();
const loadCharacterFromDisk = require('../utils/loadCharacter');

router.get('/', async (req, res) => {
  try {
    const characterData = await loadCharacterFromDisk(1);
    res.render('game', { characterData });
  } catch (err) {
    console.error('Error loading character:', err);
    res.render('game', { characterData: null });
  }
});

module.exports = router;
