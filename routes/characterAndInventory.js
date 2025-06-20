const express = require('express');
const router = express.Router();
const loadCharacterFromDisk = require('../utils/loadCharacter');
const loadItems = require('../utils/loadItems');
const { combineStats } = require('../utils/statHelper');
const { calculateDerivedStats } = require('../public/js/statCalculator');

function sanitizeStats(stats) {
  const cleanStats = {};
  for (const [key, value] of Object.entries(stats)) {
    if (typeof value === 'number' && !isNaN(value)) {
      cleanStats[key] = value;
    }
  }
  return cleanStats;
}

router.get('/character-inventory', async (req, res) => {
  try {
    let characterData = await loadCharacterFromDisk(1);
    if (!characterData) {
      characterData = {
        name: 'Default Hero',
        classId: 'Warrior',
        equipment: {},
        inventory: [],
        specializationId: null,
        additionalPassiveIndices: [],
      };
    }

    // Apply base stats and passives
    characterData = await combineStats(characterData);

    // Load equipment items
    const allItems = loadItems();
    const fullEquipment = {};
    for (const slot in characterData.equipment) {
      const itemId = characterData.equipment[slot];
      if (allItems[itemId]) {
        fullEquipment[slot] = allItems[itemId];
      }
    }
    characterData.equipment = fullEquipment;

    // Apply equipment bonuses
    const derivedStats = calculateDerivedStats(characterData);

    // Sanitize final stats
    const cleanDerivedStats = sanitizeStats(derivedStats);

    res.json({
      ...characterData,
      derivedStats: cleanDerivedStats
    });

  } catch (err) {
    console.error('Error loading character inventory:', err);
    res.status(500).json({ error: 'Failed to load character' });
  }
});

module.exports = router;
