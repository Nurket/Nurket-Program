const express = require('express');
const router = express.Router();
const { app: electronApp } = require('electron'); // Get Electron app for path
const fs = require('fs');
const path = require('path');
const loadItems = require('../utils/loadItems'); // your helper to load all items

function mapEquipmentIdsToObjects(equipment = {}, allItems = {}) {
  const mapped = {};
  for (const slot in equipment) {
    const id = equipment[slot];
    mapped[slot] = id && allItems[id] ? { ...allItems[id], quantity: 1 } : null;
  }
  return mapped;
}

router.get('/character-inventory', (req, res) => {
  try {
    const userDataPath = electronApp.getPath('userData');
    const saveFilePath = path.join(userDataPath, 'character_save_1.json');
    const rawData = fs.readFileSync(saveFilePath, 'utf8');
    const characterData = JSON.parse(rawData);

    // Load all items
    const allItems = loadItems();

    // Map equipment and inventory to full item objects
    characterData.equipment = mapEquipmentIdsToObjects(characterData.equipment, allItems);
    characterData.inventory = (characterData.inventory || [])
      .map(invItem => {
        const item = allItems[invItem.id];
        if (!item) return null;
        return { ...item, quantity: invItem.quantity || 1 };
      })
      .filter(Boolean);

    // Load classes.json for baseStats and class info
    const classesPath = path.join(__dirname, '../public/json/classes.json');
    const classesRaw = fs.readFileSync(classesPath, 'utf8');
    const classes = JSON.parse(classesRaw);

    // Find class by classId
    const characterClass = classes.find(c => c.id === characterData.classId);
    if (characterClass) {
      characterData.classBaseStats = characterClass.baseStats || {};
      characterData.className = characterClass.name || '';
      // optionally add other class info here if needed
    } else {
      characterData.classBaseStats = {};
      characterData.className = '';
    }

    res.json(characterData);
  } catch (err) {
    console.error('Error loading character data:', err.stack || err);
    res.status(500).json({ error: 'Failed to load character data' });
  }
});

module.exports = router;
