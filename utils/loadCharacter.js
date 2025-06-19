const fs = require('fs');
const path = require('path');
const electron = require('electron');

function loadCharacterFromDisk(slot = 1) {
  return new Promise((resolve, reject) => {
    const userDataPath = electron.app.getPath('userData');
    const filePath = path.join(userDataPath, `character_save_${slot}.json`);
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        resolve(null);
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

module.exports = loadCharacterFromDisk;