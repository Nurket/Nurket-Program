const fs = require('fs').promises;
const path = require('path');
const electron = require('electron');

async function loadCharacterFromDisk(slot = 1) {
  try {
    const userDataPath = electron.app.getPath('userData');
    const filePath = path.join(userDataPath, `character_save_${slot}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    // File not found or parse error fallback
    return null;
  }
}

module.exports = loadCharacterFromDisk;
