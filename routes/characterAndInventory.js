const express = require('express');
const router = express.Router();
const loadCharacterFromDisk = require('../utils/loadCharacter');

router.get('/character-inventory', async (req, res) => {
  try {
    let characterData = await loadCharacterFromDisk(1);
    if (!characterData) {
      characterData = {
        name: 'Default Hero',
        className: 'Warrior',
        level: 1,
        hp: 100,
        classImageUrl: '/images/default.png',
      };
    }
    res.render('partials/characterAndInventory', { characterData });
  } catch (err) {
    console.error('Error loading character:', err);
    res.render('partials/characterAndInventory', {
      characterData: {
        name: 'Default Hero',
        className: 'Warrior',
        level: 1,
        hp: 100,
        classImageUrl: '/images/default.png',
      }
    });
  }
});

module.exports = router;
