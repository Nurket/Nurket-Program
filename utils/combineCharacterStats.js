const path = require('path');
const fs = require('fs').promises;


function safeAddStats(target, stats) {
  for (const [stat, val] of Object.entries(stats)) {
    // Only add if stat is a string (not a number string) and val is a number
    if (typeof stat === 'string' && isNaN(Number(stat)) && typeof val === 'number') {
      target[stat] = (target[stat] || 0) + val;
    } else {
      console.warn(`Skipping invalid stat entry: key='${stat}', value=`, val);
    }
  }
}

async function loadJSON(filePath) {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

/**
 * Combine base stats, class bonuses, origin, specialization, additional passives, unique passives, and equipment into derived stats.
 */
async function combineCharacterStats(characterData) {
  const classes = await loadJSON(path.join(__dirname, '../public/json/classes.json'));
  const additionalPassives = await loadJSON(path.join(__dirname, '../public/json/additionalPassives.json'));
  const origins = await loadJSON(path.join(__dirname, '../public/json/origins.json'));

  // Find character's class data
  const charClass = classes.find(c => c.id === characterData.classId);
  if (!charClass) throw new Error('Class not found for character');

  // Start with base stats from class
  let combinedStats = { ...charClass.baseStats };

// Add class bonus
if (charClass.bonus) {
  safeAddStats(combinedStats, charClass.bonus);
}

// Add specialization bonuses
if (characterData.specializationId && charClass.specializations) {
  const spec = charClass.specializations.find(s => s.id === characterData.specializationId);
  if (spec?.bonus) {
    safeAddStats(combinedStats, spec.bonus);
  }
}

// Add origin bonuses
if (characterData.originId) {
  const origin = origins.find(o => o.id === characterData.originId);
  if (origin?.bonuses) {
    for (const bonus of origin.bonuses) {
      // Here bonus has .stat and .value, so do a little different:
      if (typeof bonus.stat === 'string' && !isNaN(bonus.value)) {
        combinedStats[bonus.stat] = (combinedStats[bonus.stat] || 0) + bonus.value;
      }
    }
  }
}

// Add additional passive bonuses
if (Array.isArray(characterData.additionalPassiveIndices)) {
  for (const passiveId of characterData.additionalPassiveIndices) {
    const passive = additionalPassives.find(p => p.id === passiveId);
    if (passive?.bonuses) {
      for (const bonus of passive.bonuses) {
        if (typeof bonus.stat === 'string' && !isNaN(bonus.value)) {
          combinedStats[bonus.stat] = (combinedStats[bonus.stat] || 0) + bonus.value;
        }
      }
    }
  }
}

  // Placeholder for unique passive bonus (not yet implemented)
  if (characterData.uniquePassiveIndex != null) {
    // TODO: Implement unique passive bonuses once structure is defined
    console.log('Unique passive logic not yet implemented.');
  }

// Add equipment bonuses
if (characterData.equipment) {
  for (const slot in characterData.equipment) {
    const item = characterData.equipment[slot];
    if (!item) continue;

    if (item.stats) {
      safeAddStats(combinedStats, item.stats);
    }
    if (item.bonus) {
      safeAddStats(combinedStats, item.bonus);
    }
  }
}

  // Derived stats example: attack = strength * 2 + flat attack
  combinedStats.attack = (combinedStats.strength || 0) * 2 + (combinedStats.attack || 0);

  return combinedStats;
}

module.exports = { combineCharacterStats };
