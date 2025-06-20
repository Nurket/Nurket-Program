const path = require('path');
const fs = require('fs').promises;

async function loadJSON(filePath) {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function combineStats(characterData) {
  const classes = await loadJSON(path.join(__dirname, '../public/json/classes.json'));
  const additionalPassives = await loadJSON(path.join(__dirname, '../public/json/additionalPassives.json'));

  const charClass = classes.find(c => c.id === characterData.classId);
  if (!charClass) throw new Error('Class not found for character');

  let combinedStats = { ...charClass.baseStats };

  // class baseHealth can be inside baseStats or outside
  if (charClass.baseStats?.hp) {
    combinedStats.hp = charClass.baseStats.hp;
  } else if (charClass.baseHealth) {
    combinedStats.hp = charClass.baseHealth;
  } else {
    combinedStats.hp = 100;
  }

  if (charClass.bonus) {
    for (const [stat, val] of Object.entries(charClass.bonus)) {
      combinedStats[stat] = (combinedStats[stat] || 0) + val;
    }
  }

  if (characterData.specializationId && charClass.specializations) {
    const spec = charClass.specializations.find(s => s.id === characterData.specializationId);
    if (spec?.bonus) {
      for (const [stat, val] of Object.entries(spec.bonus)) {
        combinedStats[stat] = (combinedStats[stat] || 0) + val;
      }
    }
  }

  if (Array.isArray(characterData.additionalPassiveIndices)) {
    for (const passiveId of characterData.additionalPassiveIndices) {
      const passive = additionalPassives.find(p => p.id === passiveId);
      if (passive?.bonuses) {
        for (const bonus of passive.bonuses) {
          const key = bonus.stat || bonus.effect;
          if (key) {
            combinedStats[key] = (combinedStats[key] || 0) + bonus.value;
          }
        }
      }
    }
  }

  characterData.stats = combinedStats;
  characterData.classImageUrl = charClass.images?.male || '/images/default.png';

  return characterData;
}

module.exports = { combineStats };
