const fs = require('fs');
const path = require('path');
const electron = require('electron');

function saveCharacterToDisk(characterData, slot = 1) {
  return new Promise((resolve, reject) => {
    const userDataPath = electron.app.getPath('userData');
    const filePath = path.join(userDataPath, `character_save_${slot}.json`);
    const jsonData = JSON.stringify(characterData, null, 2);
    
    fs.writeFile(filePath, jsonData, 'utf-8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = saveCharacterToDisk;