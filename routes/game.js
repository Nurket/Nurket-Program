const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const electron = require('electron');  // You need this for app.getPath

// Load character data function
function loadCharacterFromDisk(slot = 1) {
  return new Promise((resolve, reject) => {
    const userDataPath = electron.app.getPath('userData');
    const filePath = path.join(userDataPath, `character_save_${slot}.json`);
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        resolve(null);  // No save file found
      } else {
        try {
          const characterData = JSON.parse(data);
          resolve(characterData);
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}

// GET /game
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
