function calculateDerivedStats(characterData) {
  let derivedStats = { ...characterData.stats };

  for (let slot in characterData.equipment) {
    const item = characterData.equipment[slot];
    if (item) {
      if (item.stats) {
        for (let stat in item.stats) {
          derivedStats[stat] = (derivedStats[stat] || 0) + item.stats[stat];
        }
      }
      if (item.bonus) {
        for (let stat in item.bonus) {
          derivedStats[stat] = (derivedStats[stat] || 0) + item.bonus[stat];
        }
      }
    }
  }

  // Derived calculations example
  derivedStats.attack = (derivedStats.strength || 0) * 2 + (derivedStats.attack || 0);
  
  return derivedStats;
}

module.exports = { calculateDerivedStats };
