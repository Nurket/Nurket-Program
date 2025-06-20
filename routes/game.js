const express = require('express');
const router = express.Router();
const loadCharacterFromDisk = require('../utils/loadCharacter');
const { combineStats } = require('../utils/statHelper');

router.get('/', async (req, res) => {
  try {
    let characterData = await loadCharacterFromDisk(1);
    if (!characterData) {
      characterData = {
        name: 'Default Hero',
        classId: 'Warrior',
        level: 1,
        hp: 100,
        classImageUrl: '/images/default.png',
        equipment: {},
        inventory: [],
        specializationId: null,
        additionalPassiveIndices: [],
      };
    }

    characterData = await combineStats(characterData);

    res.render('game', { characterData });
  } catch (err) {
    console.error('Error loading character:', err);
    res.render('game', { characterData: null });
  }
});

module.exports = router;
