const express = require('express'); 
const router = express.Router();
const loadCharacterFromDisk = require('../utils/loadCharacter');
const saveCharacterToDisk = require('../utils/saveCharacter');
const { combineCharacterStats } = require('../utils/combineCharacterStats');
const loadItems = require('../utils/loadItems');

// ----- MAPPING FUNCTIONS -----
function mapEquipmentIdsToObjects(equipment = {}, allItems = {}) {
  const mapped = {};
  for (const slot in equipment) {
    const id = equipment[slot]?.id || equipment[slot];
    mapped[slot] = id && allItems[id] ? { ...allItems[id], quantity: 1 } : null;
  }
  return mapped;
}

function mapInventoryItems(inventory = [], allItems = {}) {
  return inventory.map(invItem => {
    const fullItem = allItems[invItem.id];
    if (!fullItem) {
      console.warn(`Item id ${invItem.id} not found in items list`);
      return null;
    }
    return {
      ...fullItem,
      quantity: invItem.quantity || 1,
    };
  }).filter(Boolean);
}

function mapInventoryIdsToObjects(inventory = [], allItems = {}) {
  return inventory.map(invItem => {
    if (invItem && invItem.id && allItems[invItem.id]) {
      return {
        ...allItems[invItem.id],
        quantity: invItem.quantity || 1
      };
    }
    return null;
  }).filter(Boolean);
}

// ----- ROUTES -----

// GET /game page
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

    const allItems = await loadItems();

    characterData.equipment = mapEquipmentIdsToObjects(characterData.equipment || {}, allItems);
    characterData.inventory = mapInventoryItems(characterData.inventory || [], allItems);

    const derivedStats = await combineCharacterStats(characterData);
    characterData.derivedStats = derivedStats;

    res.render('game', { characterData, allItems });
  } catch (err) {
    console.error('Error loading character:', err);
    res.render('game', { characterData: null });
  }
});

// GET /game/character-inventory API
router.get('/character-inventory', async (req, res) => {
  try {
    let characterData = await loadCharacterFromDisk(1);
    if (!characterData) {
      characterData = { /* default character data */ };
    }

    const allItems = await loadItems();

    characterData.equipment = mapEquipmentIdsToObjects(characterData.equipment, allItems);
    characterData.inventory = mapInventoryIdsToObjects(characterData.inventory, allItems);

    const derivedStats = await combineCharacterStats(characterData);
    characterData.derivedStats = derivedStats;

    res.json(characterData);
  } catch (err) {
    console.error('Error in character-inventory:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /game/equip-item API
router.post('/equip-item', async (req, res) => {
  try {
    const { itemId, inventorySlot, targetSlot } = req.body;

    let characterData = await loadCharacterFromDisk(1);
    if (!characterData) return res.status(404).json({ error: 'Character not found' });

    const allItems = await loadItems();

    const item = characterData.inventory[inventorySlot];
    if (!item || item.id !== itemId) {
      return res.status(400).json({ error: 'Invalid item or inventory slot' });
    }

    const allowedSlotsByType = {
      helmet: ['helmet'],
      ring: ['ring1', 'ring2'],
      weapon: ['mainHand', 'offHand'],
      body: ['body'],
      boots: ['boots'],
      necklace: ['necklace'],
    };

    const itemData = allItems[itemId];
    if (!itemData) return res.status(400).json({ error: 'Item not found' });

    const validSlots = allowedSlotsByType[itemData.type] || [];
    if (!validSlots.includes(targetSlot)) {
      return res.status(400).json({ error: `Cannot equip ${itemData.type} to slot ${targetSlot}` });
    }

    characterData.equipment[targetSlot] = { ...itemData, quantity: 1 };
    characterData.inventory.splice(inventorySlot, 1);

    const derivedStats = await combineCharacterStats(characterData);
    characterData.derivedStats = derivedStats;

    await saveCharacterToDisk(characterData, 1);

    res.json(characterData);
  } catch (err) {
    console.error('Error in equip-item:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// POST /game/save-character API
router.post('/save-character', async (req, res) => {
  try {
    const characterData = req.body;
    await saveCharacterToDisk(characterData, 1);
    res.status(200).send('Character saved successfully');
  } catch (err) {
    console.error('Failed to save character:', err);
    res.status(500).send('Error saving character');
  }
});
 /* save calling?
 await fetch('/game/save-character', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(characterData)
}); */

module.exports = router;
